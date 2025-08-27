// server/src/index.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import leadRoutes from "./routes/leads.js";
import { errorHandler } from "./middleware/error.js";
import { CLIENT_ORIGIN, PORT } from "./config.js";

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// CORS setup: allow frontend from Vercel
app.use(cors({
  origin: CLIENT_ORIGIN,  // <-- must be https://erino-orpin.vercel.app on Render
  credentials: true
}));

// Test route
app.get("/", (_, res) => res.send("Erino LMS API up"));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

// Global error handler
app.use(errorHandler);

// Connect to MongoDB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
    console.log("CLIENT_ORIGIN:", CLIENT_ORIGIN);
  });
}).catch(err => {
  console.error("Failed to connect to DB:", err);
});
