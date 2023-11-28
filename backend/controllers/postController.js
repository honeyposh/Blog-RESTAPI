// try {
//   const post = await Post.findById(req.params.postId);
//   if (!post) {
//     return next(new errorResponse("post not found", 404));
//   }
//   if (post.postedBy !== req.user._id &&  req.user.role !== "admin") {
//     return next(new errorResponse("You cannot delete this post", 403));
//   }
//   await Post.findByIdAndDelete(req.params.postId);
//   res.status(200).json({
//     success: true,
//     message: "successfully deleted",
//   });
// } catch (error) {
//   next(error);
// }
const Post = require("../models/postModel");
const errorResponse = require("../utils/errorResponse");
exports.createPost = async (req, res, next) => {
  const { title, content, imageUrl } = req.body;
  try {
    const post = await Post.create({
      title: title,
      content: content,
      imageUrl: imageUrl,
      postedBy: req.user._id,
    });
    console.log(post.postedBy);
    res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};
exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("postedBy", "name");
    res.status(200).json({ success: true, posts });
  } catch (error) {
    next(error);
  }
};
exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId).populate(
      "comments.postedBy",
      "name"
    );
    if (!post) {
      return next(new errorResponse("post not found", 404));
    }
    res.status(200).json({ success: true, post });
  } catch (error) {
    throw error;
  }
};
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.postId);
    if (!post) {
      return next(new errorResponse("post not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "successfully deleted",
    });
  } catch (error) {
    next(error);
  }
};
exports.addComment = async (req, res, next) => {
  const postId = req.params.postId;
  comment = req.body.comment;
  try {
    const postComment = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: { text: comment, postedBy: req.user._id } } },
      { new: true }
    );
    if (!postComment) {
      return next(new errorResponse("post not found", 404));
    }
    const post = await Post.findById(postId).populate(
      "comments.postedBy",
      "name email"
    );
    res.status(200).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};
exports.updatePost = async (req, res, next) => {
  const { title, content, imageUrl } = req.body;
  try {
    const post = await Post.findById(req.params.postId);
    if (post.postedBy.toString() !== req.user._id.toString()) {
      return next(
        new errorResponse("you are not authorized to update this post", 403)
      );
    }
    const updatedpost = await Post.findByIdAndUpdate(
      req.params.postId,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({ sucess: true, updatedpost });
  } catch (error) {
    next(error);
  }
};
