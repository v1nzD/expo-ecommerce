import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";

const orderRouter = Router();
orderRouter.use(protectRoute);

orderRouter.post("/", createOrder);
orderRouter.get("/", getUserOrders);

export default orderRouter;
