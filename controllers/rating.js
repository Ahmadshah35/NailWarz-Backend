const ratingModel = require("../models/rating");
const salonModel = require("../models/adminProfile");
const { default: mongoose } = require("mongoose");

async function giveRatingToSalon(req, res) {
  try {
    const { salonId, userId, stars,message } = req.body;

    if (!salonId || !userId || stars == null) {
      return res.status(400).json({
        success: false,
        message: "salonId, userId, and stars are required",
      });
    }

    const review = new ratingModel({
      salonId,
      userId,
      stars,
      message
    });

    await review.save();

    const result = await ratingModel.aggregate([
      { $match: { salonId: new mongoose.Types.ObjectId(salonId) } },
      {
        $group: {
          _id: "$salonId",
          averageRating: { $avg: "$stars" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const rating =
      result.length > 0 ? result[0] : { averageRating: 0, totalReviews: 0 };

    await salonModel.findByIdAndUpdate(
      salonId,
      {
        $set: {
          avgRating: rating.averageRating,
          totalReviews: rating.totalReviews,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Successfully submitted review",
      success: true,
      data: review,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
}

async function getRatingBySalonOrStar(req, res) {
  try {
    const { salonId, stars } = req.query;
    const filter = {};

    // Optional validation
    if (!salonId && !stars) {
      return res.status(200).json({
        success: false,
        message: "Please provide salonId or stars to filter ratings.",
      });
    }

    if (salonId) filter.salonId = salonId;
    if (stars) filter.stars = Number(stars);  

    const ratings = await ratingModel
      .find(filter)
      // .populate("salonId", "-password")
      .populate("userId", "-password")
      
    if (ratings.length == 0) {
      res.status(200).json({
        success: false,
        message: "Rating not found",
        total: ratings.length,
        data: ratings,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Ratings fetched successfully",
        total: ratings.length,
        data: ratings,
      });
    }
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return res.status(400).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
}

async function getRatingByRatingId(req, res) {
  try {
    const { ratingId } = req.query;

    // Optional validation
    if (!ratingId ) {
      return res.status(200).json({
        success: false,
        message: "Please provide salonId or stars to filter ratings.",
      });
    }

    const ratings = await ratingModel.findById({_id:ratingId}).populate("salonId", "salonName");
   
      res.status(200).json({
        success: true,
        message: "Ratings fetched successfully",
        total: ratings.length,
        data: ratings,
      });
  
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return res.status(400).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
}

module.exports = {
  giveRatingToSalon,
  getRatingBySalonOrStar,
  getRatingByRatingId
};
