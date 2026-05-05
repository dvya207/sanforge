import express from "express";
import SavedComponent from "../models/SavedComponent.js";
import { authMiddleware } from "../middleware/authMiddleware.js"; // ✔ Correct import

const router = express.Router();

// Save code
router.post("/save", authMiddleware, async (req, res) => {
  const { title, code, image } = req.body;

  try {
    const saved = await SavedComponent.create({
      userId: req.user.id,
      title,
      code,
      image,
    });
    res.json(saved);
  } catch (error) {
    console.error("Error saving UI:", error);
    res.status(400).json({ error: error.message });
  }
});

// Fetch user saved codes
router.get("/my-codes", authMiddleware, async (req, res) => {
  try {
    const items = await SavedComponent.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch single item
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const item = await SavedComponent.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
