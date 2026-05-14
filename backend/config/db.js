import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
    console.log(`📁 Base de données: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ Erreur MongoDB: ${error.message}`);
    process.exit(1);
  }
};