const mongoose = require("mongoose");

const AIToolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    default: "",
  },

  category: {
    type: String,
    required: true,
    enum: [
      "Chatbot",
      "Image",
      "Writing",
      "Video",
      "Code",
      "Design",
      "Audio",
      "Other",
    ],
  },

  url: {
    type: String,
    required: true,
  },

  features: [
    {
      type: String,
    },
  ],

  tags: [
    {
      type: String,
    },
  ],

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },

  author: {
    name: {
      type: String,
      default: "anonymous",
    },
    email: {
      type: String,
      default: "anonymous@example.com",
    },
    job: {
      type: String,
      default: "developer",
    },
  },

  likes: {
    type: Number,
    default: 0,
  },

  views: {
    type: Number,
    default: 0,
  },

  liked: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("AITool", AIToolSchema);
