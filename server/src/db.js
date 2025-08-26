import mongoose from "mongoose";
import { MONGO_URI } from "./config.js";

export async function connectDB() {
  if (!MONGO_URI) throw new Error("MONGO_URI missing");
  await mongoose.connect(MONGO_URI, { autoIndex: true });
  console.log("✅ MongoDB connected");
}
