const notificationModel = require("../models/notification");

const getNotificationsByUserId = async (req, res) => {
  try {
    const { userId, postId } = req.query;

    if (!userId && !postId) {
      return res.status(400).json({
        success: false,
        message: "At least userId or postId is required",
      });
    }

    const filter = {};
    if (userId) filter.userId = userId;
    if (postId) filter.postId = postId;

    const notifications = await notificationModel
      .find(filter)
      .sort({ createdAt: -1 })
      .populate("postId")
      .populate({path :"userId", select:"-password"})
      .populate({path :"commentBy", select:"-password"})
      .populate({path :"likeBy", select:"-password"})
      .populate({path :"shareBy", select:"-password"});

    if (notifications.length == 0) {
      res.status(200).json({
        success: false,
        message: "notification not found",
      });
    } else {
      return res.status(200).json({
        success: true,
        total: notifications.length,
        data: notifications,
      });
    }
  } catch (error) {
    console.error("Get Notifications Error:", error);
    res.status(400).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getNotificationsBySalonId = async (req, res) => {
  try {
    const { salonId } = req.query;

    if (!salonId) {
      return res.status(400).json({
        success: false,
        message: "salonId is required",
      });
    }

    const filter = {};
    if (salonId) filter.salonId = salonId;

    const notifications = await notificationModel
      .find(filter)
      .sort({ createdAt: -1 })
      .populate("technicianId")
      .populate({path:"salonId", select:"-password"})
      .populate("serviceId")
      .populate("bookingId")
      .populate({path :"userId", select:"-password"});

    if (notifications.length == 0) {
      res.status(200).json({
        success: false,
        message: "notification not found",
      });
    } else {
      return res.status(200).json({
        success: true,
        total: notifications.length,
        data: notifications,
      });
    }
  } catch (error) {
    console.error("Get Notifications Error:", error);
    res.status(400).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getNotificationsByUserId,
  getNotificationsBySalonId,
};
