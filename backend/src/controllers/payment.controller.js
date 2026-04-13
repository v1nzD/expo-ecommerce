import Stripe from "stripe";
import { ENV } from "../config/env.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY);

// ==============================
// CREATE PAYMENT INTENT
// ==============================
export async function createPaymentIntent(req, res) {
  try {
    const { cartItems, shippingAddress } = req.body;
    const user = req.user;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // ✅ Validate + calculate total
    let subtotal = 0;
    const validatedItems = [];

    for (const item of cartItems) {
      const product = await Product.findById(item.product._id);

      if (!product) {
        return res
          .status(404)
          .json({ error: `Product ${item.product.name} not found` });
      }

      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ error: `Insufficient stock for ${product.name}` });
      }

      subtotal += product.price * item.quantity;

      validatedItems.push({
        product: product._id.toString(),
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images?.[0] || "",
      });
    }

    const shipping = 10;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    if (total <= 0) {
      return res.status(400).json({ error: "Invalid order total" });
    }

    // ==============================
    // ✅ CREATE TEMP ORDER (IMPORTANT)
    // ==============================
    const tempOrder = await Order.create({
      user: user._id,
      clerkId: user.clerkId,
      orderItems: validatedItems,
      shippingAddress,
      totalPrice: total,
      status: "pending",
    });

    // ==============================
    // STRIPE CUSTOMER
    // ==============================
    let customer;

    try {
      if (user.stripeCustomerId) {
        customer = await stripe.customers.retrieve(user.stripeCustomerId);

        if (customer.deleted) {
          customer = null;
        }
      }
    } catch {
      customer = null;
    }

    if (!customer) {
      customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          clerkId: user.clerkId,
          userId: user._id.toString(),
        },
      });

      await User.findByIdAndUpdate(user._id, {
        stripeCustomerId: customer.id,
      });
    }

    // ==============================
    // CREATE PAYMENT INTENT
    // ==============================
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: "usd",
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: tempOrder._id.toString(), // ONLY store ID
        userId: user._id.toString(),
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: error.message });
  }
}

// ==============================
// STRIPE WEBHOOK
// ==============================
export async function handleWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      ENV.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ==============================
  // PAYMENT SUCCESS
  // ==============================
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    console.log("Payment succeeded:", paymentIntent.id);

    try {
      const { orderId } = paymentIntent.metadata;

      const order = await Order.findById(orderId);

      if (!order) {
        console.error("Order not found:", orderId);
        return res.json({ received: true });
      }

      // prevent duplicate processing
      if (order.paymentResult?.id === paymentIntent.id) {
        console.log("Order already processed:", paymentIntent.id);
        return res.json({ received: true });
      }

      // ==============================
      // MARK ORDER AS PAID
      // ==============================
      order.paymentResult = {
        id: paymentIntent.id,
        status: "succeeded",
      };

      order.status = "paid";

      await order.save();

      // ==============================
      // UPDATE STOCK
      // ==============================
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }

      // ==============================
      // CLEAR CART
      // ==============================
      await Cart.findOneAndUpdate({ user: order.user }, { items: [] });

      console.log("Order completed:", order._id);
    } catch (error) {
      console.error("Error processing webhook:", error);
    }
  }

  res.json({ received: true });
}
