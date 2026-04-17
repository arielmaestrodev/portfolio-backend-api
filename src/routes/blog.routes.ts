import { Router } from "express";

// Initialize
const router = Router();

// Authentication Routes
router.post("/v1/create-blog", function(req, res) {
  res.json({ message: "Blog created" });
});

export default router;