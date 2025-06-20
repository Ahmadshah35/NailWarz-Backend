const { JsonWebTokenError } = require("jsonwebtoken");
const PostModal = require("../models/PostModal");
const JWT = require("jsonwebtoken");
const PostModel = require("../models/PostModal");
const notificationModel = require("../models/notification");
const UserModel = require("../models/UserModal");

async function CreatePost(req, res) {
  const userData = req.user;
  try {
    const Post_Image = req.file.filename;

    const CreatePost = new PostModal({
      ...req.body,
      Post_Image: Post_Image,
    });

    await CreatePost.save()
      .then(() => [
        res.send({
          message: "Post Created Successfully",
          success: true,
          data: CreatePost,
        }),
      ])
      .catch((error) => {
        res.send({
          message: "Error",
          success: false,
          error: error,
        });
      });
  } catch (error) {
    res.send({
      message: "Error",
      success: false,
      error: error,
    });
  }
}

async function LikePost(req, res) {
  try {
    const { likeId, post_id } = req.body;

    const post = await PostModel.findById(post_id);

    const alreadyLiked = post.Like.some(
      (like) => like.toString() === likeId.toString()
    );

    let updatedPost;
    let Message;

    if (alreadyLiked) {
      updatedPost = await PostModel.findByIdAndUpdate(
        post_id,
        { $pull: { Like: likeId } },
        { new: true }
      );
      Message = "Post unliked";
    } else {
      updatedPost = await PostModel.findByIdAndUpdate(
        post_id,
        { $addToSet: { Like: likeId } },
        { new: true }
      );
      Message = "Post liked";
      const likedByUser = await UserModel.findById(likeId);

      const message = `${likedByUser.username} liked your post.`;
      const notification = new notificationModel({
        userId: updatedPost.userId,
        likeBy: likeId,
        postId: post_id,
        message: message,
      });
      await notification.save();
    }
    updatedPost.totalLikes = updatedPost.Like.length;
    const result = await updatedPost.save();
    // await updatedPost.populate("Like", "-password");
    return res.status(200).json({
      success: true,
      Message,
      data: updatedPost,
    });
  } catch (error) {
    console.error("Like post error:", error);
    res.status(400).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

async function CommentPost(req, res) {
  try {
    const { userId, post_id, message } = req.body;

    if (!post_id || !message || !userId) {
      return res.status(200).json({
        success: false,
        message: "post_id, message, and userId are required",
      });
    }

    const comment = {
      message,
      commentedAt: new Date(),
      userId,
    };

    const updatedPost = await PostModal.findByIdAndUpdate(
      post_id,
      { $push: { Comment: comment } },
      { new: true }
    );

    if (!updatedPost) {
      return res
        .status(200)
        .json({ success: false, message: "Comment is not added" });
    }

    updatedPost.totalComments = updatedPost.Comment.length;
    const result = await updatedPost.save();

    const commentByUser = await UserModel.findById(userId);

    const notificationMessage = `${commentByUser.username} commented on your post.`;

    const notification = new notificationModel({
      userId: updatedPost.userId,
      commentBy: userId,
      postId: post_id,
      message: notificationMessage,
    });

    await notification.save();

    return res.status(200).json({
      success: true,
      message: "Comment added successfully",
      data: result,
    });
  } catch (error) {
    console.error("CommentPost error:", error);
    return res.status(400).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

async function SharePost(req, res) {
  try {
    const { userId, post_id, message } = req.body;

    if (!post_id || !userId) {
      return res.status(200).json({
        success: false,
        message: "post_id and userId are required",
      });
    }

    const share = {
      userId,
      sharedAt: new Date(),
    };

    if (message) share.message = message;

    const updatedPost = await PostModel.findByIdAndUpdate(
      post_id,
      { $push: { Share: share } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(200).json({
        success: false,
        message: "Post not found",
      });
    }

    updatedPost.totalShares = updatedPost.Share.length;
    const result = await updatedPost.save();

    const user = await UserModel.findById(userId);
    const notificationMessage = `${user.username} shared your post.`;

    const notification = new notificationModel({
      userId: updatedPost.userId,
      sharedBy: userId,
      postId: post_id,
      message: notificationMessage,
    });

    await notification.save();

    return res.status(200).json({
      success: true,
      message: "Post shared successfully",
      data: result,
    });
  } catch (error) {
    console.error("SharePost error:", error);
    res.status(400).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

async function getAllPost(req, res) {
  try {
    const post = await PostModal.find().sort({ createdAt: -1 }).populate({path: "userId" ,select:"-password"}).populate({path: "salonId" ,select:"-password"});
    return res
      .status(200)
      .json({ message: "post found", success: true, data: post });
  } catch (error) {
    console.error("Share post error:", error);
    res.status(400).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

async function getPostById(req, res) {
  try {
    const { post_id } = req.query;

    if (!post_id) {
      return res.status(200).json({
        success: false,
        message: "Post ID is required",
      });
    }

    const post = await PostModal.findById(post_id)
      .populate("Like", "-password")
      .populate("Comment.userId", "-password")
      .populate("Share.userId", "-password")
    if (!post) {
      return res.status(200).json({
        success: false,
        message: "Post not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Post found",
      data: post,
    });
  } catch (error) {
    console.error("Get post error:", error);
    res.status(400).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

module.exports = {
  CreatePost,
  LikePost,
  CommentPost,
  SharePost,
  getAllPost,
  getPostById,
};
