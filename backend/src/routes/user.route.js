import { Router } from "express";
import {
  addAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
  addToWishList,
  removeFromWishList,
  getWishlist,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.use(protectRoute);

userRouter.post("/addresses", addAddress);
userRouter.get("/addresses", getAddresses);
userRouter.put("/addresses:addressId", updateAddress);
userRouter.delete("/addresses:addressId", deleteAddress);

userRouter.post("/wishlist", addToWishList);
userRouter.delete("/wishlist:productId", removeFromWishList);
userRouter.get("/wishlist", getWishlist);

export default userRouter;
