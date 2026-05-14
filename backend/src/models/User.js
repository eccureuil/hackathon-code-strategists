// models/User.js
const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  passwordHash: String,
  role: { type: String, enum: ['citizen', 'admin'], default: 'citizen' },
  quartier: String,
  createdAt: { type: Date, default: Date.now }
});