import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";

const orderRouter = Router();
orderRouter.use(protectRoute);

export default orderRouter;
