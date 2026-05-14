import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {

    console.log("=== PROTECT MIDDLEWARE ===");

    const authHeader = req.headers.authorization;

    console.log("HEADER:", authHeader);

    if (!authHeader) {
      return res.status(401).json({
        message: "Pas de header authorization"
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Format Bearer invalide"
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("TOKEN:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED:", decoded);

    const user = await User.findById(decoded.id).select("-mdp");

    console.log("USER:", user);

    if (!user) {
      return res.status(404).json({
        message: "Utilisateur introuvable"
      });
    }

    req.user = user;

    next();

  } catch (error) {

    console.log("ERROR AUTH:", error);

    return res.status(500).json({
      message: error.message
    });
  }
};

export const adminOnly = (req, res, next) => {

  console.log("=== ADMIN ONLY ===");
  console.log(req.user);

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Accès refusé admin"
    });
  }

  next();
};