const mongoose = require("mongoose");
const Post = require("../models/post.model");

const getPosts = async () => {
  return Post.find()
    .populate("author", "name")
    .sort({ createdAt: -1 });
};

const getPostById = async (postId) => {
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return null;
  }

  return Post.findById(postId)
    .populate("author", "name")
    .populate("comments.author", "name");
};

const addComment = async (postId, userId, body) => {
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return null;
  }

  const post = await Post.findById(postId);

  if (!post) {
    return null;
  }

  post.comments.push({
    author: userId,
    body,
  });

  await post.save();

  return post;
};

module.exports = {
  getPosts,
  getPostById,
  addComment,
};