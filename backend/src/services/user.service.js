import User from "../models/User.js";

export const createUser = async (data) => {
  return await User.create(data);
};

export const getAllUsers = async () => {
  return await User.find().select("-mdp");
};

export const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const getUserById = async (id) => {
  return await User.findById(id).select("-mdp");
};

export const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};