import express from "express";
import { registerUser, loginUser, getProfile, getUsers, getUser, removeUser, makeAdmin } from "../controllers/user.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.get("/", protect, adminOnly, getUsers);
router.get("/:id", protect, adminOnly, getUser);
router.delete("/:id", protect, adminOnly, removeUser);
router.patch("/:id/make-admin", protect, adminOnly, makeAdmin);

export default router;
