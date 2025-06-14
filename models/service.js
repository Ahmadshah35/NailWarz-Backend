const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    salonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "adminProfile",
    },
    serviceName: {
      type: String,
    },
    images: {
      type: [String],
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    technicianId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "technician",
      },
    ],
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    status: {
      type: String,
      enum: ["Available", "UnAvailable"],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

const serviceModel = mongoose.model("service", serviceSchema);

module.exports = serviceModel;
