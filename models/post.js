const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "No found or input error"],
    },
    name: {
      type: String,
      required: [true, "No found or input error"],
    },
    tags: {
      type: Array,
      default: ["未分類"],
    },
    likes: {
      type: Number,
      default: 0,
    },
    comment: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    versionKey: false,
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
