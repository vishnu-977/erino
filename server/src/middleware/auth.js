import jwt from "jsonwebtoken";
import { COOKIE_NAME, JWT_SECRET } from "../config.js";
import User from "../models/User.js";

export async function auth(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.uid);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
