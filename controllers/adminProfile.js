const adminProfileModel = require("../models/adminProfile");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function signUpAdmin(req, res) {
  try {
    const { email, password } = req.body;
    const validate = await adminProfileModel.findOne({ email: email });
    if (validate) {
      return res
        .status(200)
        .json({ message: "email already exist", success: false });
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const signUp = new adminProfileModel({
        email: email,
        password: hashPassword,
      });
      if (!signUp) {
        return res.status(200).json({
          message: "signUp failed",
          success: false,
        });
      } else {
        const result = await signUp.save();
        const data = await adminProfileModel
          .findById(result._id)
          .select("-password");

        const token = jwt.sign(
          {
            _id: signUp._id,
            email: signUp.email,
          },
          process.env.secretKey,
          { expiresIn: "5y" }
        );
        res.status(200).json({
          message: "sucessfully SignUp ",
          data: data,
          token,
          success: true,
        });
      }
    }
  } catch (error) {
    console.error("signUp failed:", error);
    return res.status(400).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
}

async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;

    const user = await adminProfileModel.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User does not exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).json({
        message: "Incorrect password",
        success: false,
      });
    }

    const payload = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.secretKey, {
      expiresIn: "5y",
    });

    const safeUser = await adminProfileModel
      .findById(user._id)
      .select("-password");

    res.status(200).json({
      message: "Login successful",
      success: true,
      data: safeUser,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
}

async function updateAdminProfile(req, res) {
  try {
    const { id, ...userData } = req.body;
    const files = req.files;
    if (req.body.location) {
      userData.location = {
        type: "Point",
        coordinates: [
          parseFloat(req.body.longitude),
          parseFloat(req.body.latitude),
        ],
        locationName: req.body.locationName,
      };
    }
    if (req.body.workingDays) {
      userData.workingDays = JSON.parse(req.body.workingDays);
    }
    const existingProfile = await adminProfileModel.findById(id);
    if (!existingProfile) {
      return res.status(200).json({
        message: "Admin profile not found",
        success: false,
      });
    }
    const existingImages = existingProfile.image || [];
    const newImageNames = files?.image?.map((file) => file.filename) || [];

    const retainedImages = existingImages.filter((img) =>
      newImageNames.includes(img)
    );
    const addedImages = newImageNames.filter(
      (img) => !existingImages.includes(img)
    );

    userData.image = [...retainedImages, ...addedImages];
    userData.isUpdated = true;

    if (userData.categoryId) {
      userData.categoryId = JSON.parse(userData.categoryId);
    }

    const updatedProfile = await adminProfileModel
      .findByIdAndUpdate(id, { $set: userData }, { new: true })
      .select("-password");

    if (!updatedProfile) {
      return res.status(200).json({
        message: "Admin profile is not updated",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Admin profile updated",
      success: true,
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(400).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
}

async function getSalonByServiceNameOrLocation(req, res) {
  try {
    const { latitude, longitude, categoryId, locationName } = req.body || {};

    const filter = {};

    if (categoryId) {
      filter.categoryId = categoryId;
    }

    if (locationName) {
      filter.$or = [
        { "location.locationName": { $regex: locationName, $options: "i" } },
        { locationName: { $regex: locationName, $options: "i" } },
      ];
    }

    if (latitude && longitude) {
      filter.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: 10000, // 10 km
        },
      };
    }

    const result = await adminProfileModel
      .find(filter)
      .select("-password")
      .sort({ avgRating: -1 }).populate("categoryId");

    if (!result || result.length === 0) {
      return res.status(200).json({
        message: "Salon not found",
        success: false,
        data: [],
      });
    }

    return res.status(200).json({
      message: "Salon(s) found",
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error in getSalonByServiceNameOrLocation:", error);
    return res.status(400).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
}

async function getAdminById(req, res) {
  try {
    const { salonId } = req.query;
    const salon = await adminProfileModel
      .findById({ _id: salonId })
      .select("-password").populate("categoryId");

    if (!salon) {
      return res
        .status(200)
        .json({ success: false, message: "salon not found" });
    } else {
      return res.status(200).json({ success: true, data: salon });
    }
  } catch (error) {
    console.error("Get salon Error:", error);
    res
      .status(400)
      .json({ success: false, message: "Server Error", error: error.message });
  }
}

async function updateSalonIsActive(req, res) {
  try {
    const { workingDayId, isActive } = req.body;

    const day = await adminProfileModel.findOneAndUpdate(
      { "workingDays._id": workingDayId },
      { $set: { "workingDays.$.isActive": isActive } },
      { new: true }
    );

    if (!day) {
      return res
        .status(200)
        .json({ success: false, message: "workingDay not found" });
    } else {
      return res.status(200).json({
        success: true,
        message: "workingDay updated",
        data: day,
      });
    }
  } catch (error) {
    console.error("error:", error);
    res
      .status(400)
      .json({ success: false, message: "Server Error", error: error.message });
  }
}

async function addOrRemoveCategoryId(req, res) {
  try {
    const { salonId, categoryId } = req.body;

    if (!salonId || !categoryId) {
      return res.status(200).json({
        success: false,
        message: "adminId and categoryId are required",
      });
    }

    const admin = await adminProfileModel.findById(salonId);
    if (!admin) {
      return res.status(200).json({
        success: false,
        message: "Admin not found",
      });
    }

    const exists = admin.categoryId.some(
      (catId) => catId.toString() === categoryId.toString()
    );

    let updatedAdmin;

    if (exists) {
      // console.log("first", exists)
      updatedAdmin = await adminProfileModel.findByIdAndUpdate(
        salonId,
        { $pull: { categoryId: categoryId } },
        { new: true }
      );
    } else {
      updatedAdmin = await adminProfileModel.findByIdAndUpdate(
        salonId,
        { $addToSet: { categoryId: categoryId } },
        { new: true }
      );
    }

    await updatedAdmin.populate("categoryId");

    return res.status(200).json({
      success: true,
      message: exists ? "Category removed" : "Category added",
      data: updatedAdmin,
    });
  } catch (error) {
    console.error("Category toggle error:", error);
    return res.status(400).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}


module.exports = {
  signUpAdmin,
  loginAdmin,
  updateAdminProfile,
  getSalonByServiceNameOrLocation,
  getAdminById,
  updateSalonIsActive,
  addOrRemoveCategoryId
};
