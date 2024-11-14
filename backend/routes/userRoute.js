import express from "express";
import * as userController from "../controllers/userController.js";
import { authenticateToken as authMiddleware } from "../middleware/auth.js";

const userRouter = express.Router();

// User Registration
userRouter.post("/register", userController.registerUser);

// User Login
userRouter.post("/login", userController.loginUser);

// Get User Profile
userRouter.get("/profile", authMiddleware, userController.getProfile);

// Update User Profile
userRouter.put("/profile", authMiddleware, userController.updateProfile);

// Get All Users
userRouter.get("/", authMiddleware, userController.getAllUsers);

// Create Staff User
userRouter.post("/staff", authMiddleware, userController.createStaff);

// Delete User by ID
userRouter.delete("/:id", authMiddleware, userController.deleteUser);

// Update Staff Information
userRouter.put("/staff", authMiddleware, userController.updateStaffInfo);

export default userRouter;
