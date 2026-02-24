import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";
const cartRouter = Router();

cartRouter.use(protectRoute);

cartRouter.get("/", getCart);
cartRouter.post("/", addToCart);
cartRouter.put("/:productId", updateCartItem);
cartRouter.delete("/:productId", removeFromCart);
cartRouter.delete("/", clearCart);

export default cartRouter;
