const mongoose = require("mongoose");

const adminProfileSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    salonName: {
      type: String,
    },
    phoneNumber: {
      type: Number,
    },
    bussinessAddress: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: [String],
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
      locationName: {
        type: String,
      },
    },
    longitude: {
      type: Number,
    },
    latitude: {
      type: Number,
    },
    locationName: {
      type: String,
    },
    avgRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
    },
    categoryId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
      },
    ],
    workingDays: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
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
    isUpdated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
adminProfileSchema.index({ location: "2dsphere" });

const adminProfileModel = mongoose.model("adminProfile", adminProfileSchema);

module.exports = adminProfileModel;
