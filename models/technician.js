const mongoose = require("mongoose");

const technicianSchema = new mongoose.Schema(
  {
    salonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "adminProfile",
    },
    email: {
      type: String,
    },
    fullName: {
      type: String,
    },
    phoneNumber: {
      type: Number,
    },
    description: {
      type: String,
    },
    designation: {
      type: String,
    },
    workingDays: [
      {
        day: {
          type: String,
          enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        },
        startTime: {
          type: String,
        },
        endTime: {
          type: String,
        },
        isActive: {
          type: Boolean,
          default: false,
        },
      },
    ],
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const technicianModel = mongoose.model("technician", technicianSchema);

module.exports = technicianModel;
