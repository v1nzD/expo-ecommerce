import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  getAllOrders,
  updateOrderStatus,
  getAllCustomers,
  getDashboardStats,
} from "../controllers/admin.controller.js";
import { protectRoute, adminOnly } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const adminRouter = Router();

// optimization - DRY
adminRouter.use(protectRoute, adminOnly);

adminRouter.post("/products", upload.array("images", 3), createProduct);
adminRouter.get("/products", getAllProducts);
adminRouter.put("/products:id", upload.array("images", 3), updateProduct);

adminRouter.get("/orders", getAllOrders);
adminRouter.patch("/orders:orderId/status", updateOrderStatus);

adminRouter.get("/customers", getAllCustomers);
adminRouter.get("/stats", getDashboardStats);

export default adminRouter;
