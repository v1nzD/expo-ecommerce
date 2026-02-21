import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createOrder, getUserOrders } from "../controllers/order.controller.js";

const orderRouter = Router();
orderRouter.use(protectRoute);

orderRouter.post("/", createOrder);
orderRouter.get("/", getUserOrders);

export default orderRouter;
