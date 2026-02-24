import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createReview,
  deleteReview,
} from "../controllers/review.controller.js";

const reviewRouter = Router();
reviewRouter.use(protectRoute);

reviewRouter.post("/", createReview);

// did not implement this in mobile app
reviewRouter.delete("/:reviewId", deleteReview);

export default reviewRouter;
