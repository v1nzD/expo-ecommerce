import { Review } from "../models/review.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

export async function createReview(req, res) {
  try {
    const { productId, orderId, rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const user = req.user;

    // verify order exists and is delivered
    // can only review when order is delivered
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.clerkId !== user.clerkId) {
      return res.status(403).json({ error: "Not authorized to review order" });
    }

    if (order.status !== "delivered") {
      return res
        .status(400)
        .json({ error: "Can only review delivered orders" });
    }

    // allow users to review each product in the order
    // verify if product is in order
    const productInOrder = order.orderItems.find(
      (item) => item.product.toString() === productId.toString(),
    );

    if (!productInOrder) {
      return res.status(400).json({ error: "Product not found in this oder" });
    }

    // atomic update or create
    const review = await Review.findOneAndUpdate(
      { productId, userId: user._id },
      { rating, orderId, productId, userId: user._id },
      { new: true, upsert: true, runValidators: true },
    );

    // update product rating with atomic aggregation
    const reviews = await Review.find({ productId });
    const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        averageRating: totalRating / reviews.length,
        totalReviews: reviews.length,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedProduct) {
      await Review.findByIdAndDelete(review._id);
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (error) {
    console.error("Error in createReview", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteReview(req, res) {
  try {
    const { reviewId } = req.params;

    const user = req.user;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // verify if user is authorized and the owner of the review
    if (review.userId.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this review" });
    }

    await Review.findByIdAndDelete(reviewId);

    // recalculate product rating
    const productId = review.productId;
    const reviews = await Review.find({ productId });
    const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    await Product.findByIdAndUpdate(productId, {
      averageRating: reviews.length > 0 ? totalRating / reviews.length : 0,
      totalReviews: reviews.length,
    });

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error in deleteReview", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
