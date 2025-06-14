const bookingModel = require("../models/booking");
const notificationModel = require("../models/notification");

async function createBooking(req, res) {
  try {
    let { userId, salonId, serviceId, technicianId, date, time } = req.body;

    const alreadyExist = await bookingModel.findOne({
      technicianId,
      date,
      time,
      status: "Accepted",
    });
    // console.log("first",alreadyExist)
    // return
    const alreadyBooked = await bookingModel.findOne({
      userId,
      date,
      time,
      status: "Accepted",
    });
    // console.log("first",alreadyBooked)
    // return

    if (alreadyExist || alreadyBooked) {
      return res.status(200).json({
        message: "Appointment already booked at this time",
        success: false,
      });
    } else {
      const booking = new bookingModel({
        userId,
        salonId,
        serviceId,
        technicianId,
        date,
        time,
      });

      const result = await booking.save();

      if (!result) {
        return res
          .status(200)
          .json({ message: "Error in booking appointment", success: false });
      }

      return res.status(200).json({
        message: "Successfully booked appointment",
        success: true,
        data: result,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
}

async function updateBooking(req, res) {
  try {
    const { bookingId, status } = req.body;

    if (!bookingId || !status) {
      return res.status(200).json({
        message: "bookingId and status are required",
        success: false,
      });
    }

    const updatedBooking = await bookingModel.findByIdAndUpdate(
      bookingId,
      { $set: { status } },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(200).json({
        message: "Booking not found",
        success: false,
      });
    } else {
      let message;
      switch (updatedBooking.status) {
        case "Completed":
          message = "Your appointment was completed successfully.";
          break;
        case "Canceled":
          message = "Your appointment has been canceled.";
          break;
      }
      const notification = new notificationModel({
        userId: updatedBooking.userId,
        bookingId: updatedBooking._id,
        salonId: updatedBooking.salonId,
        technicianId: updatedBooking.technicianId,
        serviceId: updatedBooking.serviceId,
        message,
      });
      await notification.save();
      return res.status(200).json({
        message: "Booking updated successfully",
        success: true,
        data: updatedBooking,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
}

async function getBookingById(req, res) {
  try {
    const { bookingId } = req.query;

    const booking = await bookingModel
      .findById(bookingId)
      .populate({
        path: "salonId",
        select: "-password",
      })
      .populate({
        path: "userId",
        select: "-password",
      })
      .populate("serviceId technicianId");

    if (!booking) {
      return res
        .status(200)
        .json({ message: "Booking not found", success: false });
    }

    return res.status(200).json({
      message: "Booking fetched successfully",
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(400)
      .json({ success: false, message: "Server Error", error: error.message });
  }
}

async function getBookingsByUserId(req, res) {
  try {
    const { userId } = req.query;

    const bookings = await bookingModel
      .find({ userId })
      .populate({
        path: "salonId",
        select: "-password",
      })
      .populate("serviceId technicianId");
    return res.status(200).json({
      message: "Bookings fetched successfully",
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(400)
      .json({ success: false, message: "Server Error", error: error.message });
  }
}

async function getBookingsByUserIdAndStatus(req, res) {
  try {
    const { userId, status } = req.query;

    const bookings = await bookingModel
      .find({ userId, status })
      .populate({
        path: "salonId",
        select: "-password",
      })
      .populate("serviceId");

    if (bookings.length == 0) {
      return res.status(200).json({
        message: "Bookings not found",
        success: false,
        data: bookings,
      });
    } else {
      return res.status(200).json({
        message: "Bookings fetched successfully",
        success: true,
        data: bookings,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(400)
      .json({ success: false, message: "Server Error", error: error.message });
  }
}

async function getBookingsBySalonIdAndStatus(req, res) {
  try {
    const { salonId, status } = req.query;

    const bookings = await bookingModel
      .find({ salonId, status })
      .populate({
        path: "userId",
        select: "-password",
      })
      .populate("serviceId");

    if (bookings.length == 0) {
      return res.status(200).json({
        message: "Bookings not found",
        success: false,
        data: bookings,
      });
    } else {
      return res.status(200).json({
        message: "Bookings fetched successfully",
        success: true,
        data: bookings,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(400)
      .json({ success: false, message: "Server Error", error: error.message });
  }
}

async function getBookingsBySalonId(req, res) {
  try {
    const { salonId } = req.query;

    if (!salonId) {
      return res.status(200).json({
        success: false,
        message: "salonId is required",
      });
    }

    const bookings = await bookingModel
      .find({ salonId })
      .sort({ createdAt: -1 })
      .populate({
        path: "userId",
        select: "-password",
      })
      .populate("serviceId technicianId");

    if (!bookings || bookings.length === 0) {
      return res.status(200).json({
        message: "No bookings found for this salon",
        success: false,
        data: [],
      });
    }

    return res.status(200).json({
      message: "Bookings fetched successfully",
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(400).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
}

module.exports = {
  createBooking,
  updateBooking,
  getBookingById,
  getBookingsByUserId,
  getBookingsByUserIdAndStatus,
  getBookingsBySalonIdAndStatus,
  getBookingsBySalonId,
};
