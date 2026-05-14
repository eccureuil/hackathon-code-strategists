import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  getUser,
  removeUser,
  makeAdmin
} from "../controllers/user.controller.js";
import {
  protect,
  adminOnly
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/", getUsers);
router.get("/:id", getUser);
router.delete("/:id", removeUser);
router.patch("/:id/make-admin", protect, adminOnly, makeAdmin);

export default router;