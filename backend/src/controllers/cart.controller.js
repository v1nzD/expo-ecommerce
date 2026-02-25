import { Cart } from "../models/cart.model.js";

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

export async function addToCart(req, res) {}

export async function updateCartItem(req, res) {}

export async function removeFromCart(req, res) {}

export async function clearCart(req, res) {}
