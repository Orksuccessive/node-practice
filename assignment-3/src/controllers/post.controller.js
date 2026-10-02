const postService = require("../services/post.service");

const getPosts = async (req, res) => {
  const posts = await postService.getPosts();

  res.status(200).json({
    success: true,
    data: posts,
  });
};

const getPostById = async (req, res) => {
  const post = await postService.getPostById(req.params.id);

  if (!post) {
    return res.status(404).json({
      success: false,
      error: {
        message: "Post not found",
      },
    });
  }

  res.status(200).json({
    success: true,
    data: post,
  });
};

const addComment = async (req, res) => {
  const { body } = req.body;

  if (!body || !body.trim()) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Comment body is required",
      },
    });
  }

  const post = await postService.addComment(
    req.params.id,
    req.user.userId,
    body
  );

  if (!post) {
    return res.status(404).json({
      success: false,
      error: {
        message: "Post not found",
      },
    });
  }

  res.status(201).json({
    success: true,
    data: post.comments[post.comments.length - 1],
  });
};

module.exports = {
  getPosts,
  getPostById,
  addComment,
};