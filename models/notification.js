const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "appointments",
    },
    salonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "adminProfile",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "technician",
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "service",
    },
    likeBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    shareBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    commentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const notificationModel = mongoose.model("notification", notificationSchema);
module.exports = notificationModel;
