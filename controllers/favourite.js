const UserModel = require("../models/UserModal");

async function addFavouriteSalon(req, res) {
  try {
    const { salonId, userId } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(200)
        .json({ message: "User not found", success: false });
    } else {
      const alreadyAdded = user.favourite.some(
        (favourite) =>
          favourite.salonId &&
          favourite.salonId.toString() === salonId.toString()
      );

      if (alreadyAdded) {
        const updatedUser = await UserModel.findByIdAndUpdate(
          userId,
          { $pull: { favourite: { salonId } } },
          { new: true }
        ).select("-password");

        return res.status(200).json({
          message: "Salon removed from favourites",
          success: true,
          user: updatedUser,
        });
      } else {
        const updatedUser = await UserModel.findByIdAndUpdate(
          userId,
          { $addToSet: { favourite: { salonId } } },
          { new: true }
        ).select("-password");

        return res.status(200).json({
          message: "Salon added to favourites",
          success: true,
          user: updatedUser,
        });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
}

async function getUserById(req, res) {
  try {
    const { userId } = req.query;

    const user = await UserModel.findById(userId).select("-password").populate({
      path: "favourite.salonId",
      select: "-password",
    });

    if (!user) {
      return res.status(200).json({
        message: "User not found",
        success: false,
      });
    } else {
      return res.status(200).json({
        message: "User found",
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
}

module.exports = {
  addFavouriteSalon,
  getUserById,
};
