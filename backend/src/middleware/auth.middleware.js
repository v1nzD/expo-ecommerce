import { requireAuth } from "@clerk/express";
import { User } from "../models/user.model.js";
import { ENV } from "../config/env.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;
      if (!clerkId)
        return res
          .status(401)
          .json({ message: "Unauthorized - invalid token" });

      const user = await User.findOne({ clerkId });
      if (!user) return res.status(404).json({ message: "User not found" });

      // attach user to req.user so the rest of controller can use req.user
      // dont need to query database again
      req.user = user;

      next();
    } catch (error) {
      console.error("Error in protectRoute middleware", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

export const adminOnly = (req, res, next) => {
  // user not authenticated
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized - User not found" });
  }
  if (req.user.email !== ENV.ADMIN_EMAIL) {
    return res.status(403).json({ message: "Unauthorized - Admin only" });
  }

  next();
};
