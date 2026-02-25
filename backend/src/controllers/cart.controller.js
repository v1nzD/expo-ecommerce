import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

export async function getCart(req, res) {
  try {
    const clerkId = req.user.clerkId;
    let cart = await Cart.findOne({ clerkId: clerkId }).populate(
      "items.product",
    );

    // user has no products in cart yet, create a cart
    if (!cart) {
      cart = await Cart.create({
        user: user._id,
        clerkId: user.clerkId,
        items: [],
      });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error("Error in getCart", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function addToCart(req, res) {
  try {
    const { productId, quantity = 1 } = req.body;

    // validate product exists and has stock
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: "Product has insufficent stock" });
    }

    // find user's cart
    const clerkId = req.user.clerkId;
    let cart = await Cart.findOne({ clerkId: clerkId });

    if (!cart) {
      cart = await Cart.create({
        user: user._id,
        clerkId: user.clerkId,
        items: [],
      });
    }

    // check if item is already in cart => increment item quantity in cart
    // find the item in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );
    // item already in cart
    if (existingItem) {
      // increment quantity by 1
      const newQuantity = existingItem.quantity + 1;
      if (product.stock < newQuantity) {
        return res.status(400).json({ error: "Product has insufficent stock" });
      }
    } else {
      // add new item
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    console.error("Error in addToCart", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateCartItem(req, res) {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    // find user's cart
    const clerkId = req.user.clerkId;
    let cart = await Cart.findOne({ clerkId: clerkId });
    if (!cart) {
      return res.status(400).json({ error: "Cart not found" });
    }

    // find item in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );
    if (itemIndex === -1) {
      return res.status(400).json({ error: "Item not found in cart" });
    }

    // check if product exists and validate stock
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: "Product has insufficent stock" });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Error in upadteCartItem", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function removeFromCart(req, res) {
  try {
    const { productId } = req.params;

    // find user's cart
    const clerkId = req.user.clerkId;
    let cart = await Cart.findOne({ clerkId: clerkId });
    if (!cart) {
      return res.status(400).json({ error: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );
    await cart.save();

    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    console.error("Error in removeFromCart", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function clearCart(req, res) {}
