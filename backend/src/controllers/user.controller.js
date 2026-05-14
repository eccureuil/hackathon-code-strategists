import * as userService from "../services/user.service.js";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, mdp } = req.body;
    if (!email || !mdp) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    const isMatch = await user.comparerMdp(mdp);
    if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect" });
    res.json({
      message: "Connexion réussie",
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProfile = async (req, res) => {
  res.json(req.user);
};

export const getUsers = async (req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
};

export const getUser = async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
  res.json(user);
};

export const removeUser = async (req, res) => {
  await userService.deleteUser(req.params.id);
  res.json({ message: "Utilisateur supprimé" });
};

export const makeAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    user.role = "admin";
    await user.save();
    res.json({ message: "Utilisateur promu admin", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
