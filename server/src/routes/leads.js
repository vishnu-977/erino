import express from "express";
import Lead from "../models/Lead.js";
import { auth } from "../middleware/auth.js";
import { buildLeadQuery } from "../utils/buildLeadQuery.js";

const router = express.Router();
router.use(auth);

// POST /leads → create
router.post("/", async (req, res, next) => {
  try {
    const body = { ...req.body, owner: req.user._id };
    const lead = await Lead.create(body);
    res.status(201).json(lead);
  } catch (e) { next(e); }
});

// GET /leads → list with pagination & filters
router.get("/", async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);

    const filter = buildLeadQuery(req.query, req.user._id);
    const total = await Lead.countDocuments(filter);
    const data = await Lead.find(filter)
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (e) { next(e); }
});

// GET /leads/:id → single
router.get("/:id", async (req, res, next) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });
    if (!lead) return res.status(404).json({ message: "Not found" });
    res.json(lead);
  } catch (e) { next(e); }
});

// PUT /leads/:id → update
router.put("/:id", async (req, res, next) => {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!lead) return res.status(404).json({ message: "Not found" });
    res.json(lead);
  } catch (e) { next(e); }
});

// DELETE /leads/:id → delete
router.delete("/:id", async (req, res, next) => {
  try {
    const r = await Lead.deleteOne({ _id: req.params.id, owner: req.user._id });
    if (r.deletedCount === 0) return res.status(404).json({ message: "Not found" });
    res.status(204).send();
  } catch (e) { next(e); }
});

export default router;
