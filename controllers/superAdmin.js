const superAdminProfile = require("../models/superAdmin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function signUpSuperAdmin(req, res) {
  try {
    const { email, password } = req.body;
    const validate = await superAdminProfile.findOne({ email: email });
    if (validate) {
      return res
        .status(200)
        .json({ message: "email already exist", success: false });
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const signUp = new superAdminProfile({
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
        const data = await superAdminProfile
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

async function loginSuperAdmin(req, res) {
  try {
    const { email, password } = req.body;

    const user = await superAdminProfile.findOne({ email });
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
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.secretKey, {
      expiresIn: "5y",
    });

    const safeUser = await superAdminProfile
      .findByIdAndUpdate({_id:user._id}, {$set:{isVerified:true}},{new:true})
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

module.exports ={
  signUpSuperAdmin,
  loginSuperAdmin
}
