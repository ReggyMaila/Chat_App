const express = require("express");
const Message = require("../models/Message");
const router = express.Router();

router.get("/", async (req, res) => {
  const room = req.query.room || "global";
  const limit = Number(req.query.limit) || 50;

  const messages = await Message.find({ room })
    .sort({ createdAt: -1 })
    .limit(limit);

  res.json(messages.reverse());
});

router.post("/", async (req, res) => {
  const { room = "global", content } = req.body;
  if (!content) return res.status(400).json({ message: "content required" });

  const msg = await Message.create({ room, content });
  res.status(201).json(msg);
});

module.exports = router;
