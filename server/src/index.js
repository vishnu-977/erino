import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { CLIENT_ORIGIN, IS_PROD, PORT } from "./config.js";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import leadRoutes from "./routes/leads.js";
import { errorHandler } from "./middleware/error.js";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());


app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true
}));


app.get("/", (_, res) => res.send("Erino LMS API up"));

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`API on :${PORT}`));
});
