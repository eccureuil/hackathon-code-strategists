// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  mdp: { type: String, required: true },
  role: { type: String, enum: ["citizen", "admin"], default: "citizen" },
  quartier: String,
  createdAt: { type: Date, default: Date.now }
});

// Hash password avant save
userSchema.pre("save", async function () {
  if (!this.isModified("mdp")) return;

  const salt = await bcrypt.genSalt(10);
  this.mdp = await bcrypt.hash(this.mdp, salt);
});

// comparer mot de passe
userSchema.methods.comparerMdp = async function (mdpSaisi) {
  return await bcrypt.compare(mdpSaisi, this.mdp);
};

const User = mongoose.model("User", userSchema);

export default User;