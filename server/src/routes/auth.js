import express from "express";
import jwt from "jsonwebtoken";
import { COOKIE_NAME, IS_PROD, JWT_SECRET } from "../config.js";
import User from "../models/User.js";

const router = express.Router();

function setAuthCookie(res, uid) {
  const token = jwt.sign({ uid }, JWT_SECRET, { expiresIn: "7d" });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: IS_PROD ? "none" : "lax",
    secure: IS_PROD,
    maxAge: 7 * 24 * 3600 * 1000
  });
}

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "email & password required" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "User already exists" });
    const user = await User.create({ email, password });
    setAuthCookie(res, user._id.toString());
    res.status(201).json({ id: user._id, email: user.email });
  } catch (e) { next(e); }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    setAuthCookie(res, user._id.toString());
    res.json({ id: user._id, email: user.email });
  } catch (e) { next(e); }
});

router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: IS_PROD ? "none" : "lax", secure: IS_PROD });
  res.status(204).send();
});

router.get("/me", async (req, res) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(200).json(null);
  try {
    const { uid } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(uid).select("_id email");
    res.json(user ? { id: user._id, email: user.email } : null);
  } catch {
    res.json(null);
  }
});

export default router;
