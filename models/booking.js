const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    salonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "adminProfile",
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "service",
    },
    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "technician",
    },
    time: {
      type: String,
    },
    date: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Accepted", "Completed", "Canceled"],
      default: "Accepted",
    },
  },
  { timestamps: true }
);

const bookingModel = mongoose.model("appointments", appointmentSchema);
module.exports = bookingModel;
