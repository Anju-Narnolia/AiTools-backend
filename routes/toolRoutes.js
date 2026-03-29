const express = require("express");
const router = express.Router();
const AITool = require("../model/AITool");
const authMiddleware = require("../middleware/auth");

// GET all tools
router.get("/all", async (req, res) => {
  try {
    const tools = await AITool.find().sort({ createdAt: -1 });
    res.json(tools);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// GET tools for current user
router.get("/user/tools", authMiddleware, async (req, res) => {
  try {
    const tools = await AITool.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE a new tool (requires authentication)
router.post("/add", authMiddleware, async (req, res) => {
  try {
    let authorName = req.body?.author?.name || "";
    let authorEmail = req.body?.author?.email || "";
    if (typeof authorName !== "string" || authorName.trim() === "") {
      authorName = "anonymous";
    }
    if (typeof authorEmail !== "string" || authorEmail.trim() === "") {
      authorEmail = "anonymous@example.com";
    }
    const toolData = {
      name: req.body.name || "",
      description: req.body.description || "",
      category: req.body.category || "Other",
      url: req.body.url || "",
      features: Array.isArray(req.body.features) ? req.body.features : [],
      tags: Array.isArray(req.body.tags) ? req.body.tags : [],
      userId: req.userId || null,
      author: {
        name: authorName,
        email: authorEmail,
      },
    };
    const tool = new AITool(toolData);
    console.log("New tool being created");
    const newTool = await tool.save();
    await newTool.populate("userId", "name email job");
    res.status(201).json(newTool);
  } catch (error) {
    console.error(
      "Tool creation error:",
      error instanceof Error ? error.message : error,
    );
    res.status(400).json({
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET a single tool by ID
router.get("/:id", async (req, res) => {
  try {
    const tool = await AITool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ message: "Tool not found" });
    }
    res.json(tool);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE a tool (requires authentication and ownership)
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, description, category, url, features, tags, likes, views, liked } =
    req.body;

  try {
    const tool = await AITool.findById(id);
    if (!tool) {
      return res.status(404).json({ message: "Tool not found" });
    }

    // Allow updating views and likes without ownership
    if (likes !== undefined || views !== undefined || liked !== undefined) {
      if (likes !== undefined) tool.likes = likes;
      if (views !== undefined) tool.views = views;
      if (liked !== undefined) tool.liked = liked;
      await tool.save();
      await tool.populate("userId", "name email job");
      return res.json(tool);
    }

    // For content updates, check ownership
    if (name || description || category || url || features || tags) {
      if (tool.userId.toString() !== req.userId) {
        return res.status(403).json({
          message: "Unauthorized - you can only edit your own tools",
        });
      }
      const updatedTool = await AITool.findByIdAndUpdate(
        id,
        { name, description, category, url, features, tags },
        { new: true },
      ).populate("userId", "name email job");
      return res.json(updatedTool);
    }
    res.json(tool);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE a tool (requires authentication and ownership)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const tool = await AITool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ message: "Tool not found" });
    }

    if (tool.userId.toString() !== req.userId) {
      return res.status(403).json({
        message: "Unauthorized - you can only delete your own tools",
      });
    }

    await AITool.findByIdAndDelete(req.params.id);
    res.json({ message: "Tool deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
