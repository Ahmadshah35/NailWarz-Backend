const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    salonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "adminProfile",
    },
    Post_Image: {
      type: String,
    },
    Post_Caption: {
      type: String,
    },
    Post_Type: {
      type: String,
      enum: ["Poll", "Post"],
      require: true,
    },
    Voting: [
      {
        voter_id: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        vote: {
          type: String,
          enum: ["Yes", "No"],
        },
      },
    ],
    Like: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    Comment: [
      {
        userId: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        message: String,
        commentedAt: { type: Date, default: Date.now },
      },
    ],
    Share: [
      {
        userId: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        message: String,
        sharedAt: { type: Date, default: Date.now },
      },
    ],
    totalLikes: {
      type: Number,
    },
    totalComments: {
      type: Number,
    },
    totalShares: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model("Post", PostSchema);
module.exports = PostModel;
