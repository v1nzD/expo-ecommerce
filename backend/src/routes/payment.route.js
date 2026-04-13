import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createPaymentIntent,
  handleWebhook,
} from "../controllers/payment.controller.js";

const paymentRouter = Router();

paymentRouter.post("/create-intent", protectRoute, createPaymentIntent);

// No auth needed - Stripe validates via signature
paymentRouter.post("/webhook", handleWebhook);

export default paymentRouter;
