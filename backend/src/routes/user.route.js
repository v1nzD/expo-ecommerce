import { Router } from "express";
import {
  addAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.post("/addresses", protectRoute, addAddress);
userRouter.get("/addresses", protectRoute, getAddresses);
userRouter.put("/addresses:addressId", protectRoute, updateAddress);
userRouter.delete("/addresses:addressId", protectRoute, deleteAddress);

export default userRouter;
