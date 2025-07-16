const UserModel = require("../models/UserModal");
const JWT = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const OtpModel = require("../models/OtpModal");
const bcrypt = require("bcryptjs");
function loginWithPhoneOtp(req, res) {}

function loginWitheEmailOtp(req, res) {}

async function loginWitheEmailAndPassword(req, res) {
  const { email, password } = req.body;
  const IsUserExist = await UserModel.findOne({ email: email });

  if (IsUserExist) {
    const comparePassword = await bcrypt.compare(
      password,
      IsUserExist.password
    );

    if (!comparePassword) {
      return res.send({
        success: false,
        message: "Your password is wrong",
        data: comparePassword,
      });
    }

    const payload = {
      _id: IsUserExist?._id,
      username: IsUserExist?.username,
      email: IsUserExist?.email,
    };

    const signJwt = JWT.sign(payload, process.env.secretKey, {
      expiresIn: "5y",
    });

    res.send({
      success: true,
      message: "User data",
      Data: IsUserExist,
      token: signJwt,
    });
  } else {
    res.send({
      success: false,
      message: "User not exist",
    });
  }
}

async function SignupWithEmailOrPhoneandPassword(req, res) {
  const { email, phone } = req.body;

  try {
    const userData = await UserModel.findOne({ email: email });

    if (userData) {
      return res.send({
        message: "User already exist",
        success: false,
      });
    }

    const signJwt = JWT.sign(req.body, process.env.secretKey, {
      expiresIn: "5y",
    });

    const otp = Math.floor(1000 + Math.random() * 9000);

    if (email) {
      const getOtp = await OtpModel.findOne({ EmailOrPhone: email });

      if (getOtp) {
        getOtp.Otp = otp;
        await getOtp.save();
      } else {
        await OtpModel.create({
          Otp: otp,
          EmailOrPhone: email,
        });
      }

      const OtpSentEmail = await sendOtpOnMail(email, otp);
      if (OtpSentEmail.messageId) {
        res.send({
          success: true,
          message: "Otp sent to your email",
          token: signJwt,
          otp: otp,
        });
      } else {
        res.send({
          success: false,
          message: "Otp not send",
        });
      }
    } else if (phone) {
      await OtpModel.create({
        Otp: otp,
        EmailOrPhone: phone,
      });

      res.send({
        success: true,
        message: "Otp sent to your phone number",
        token: signJwt,
        otp: otp,
      });
    } else {
      res.send({
        success: false,
        message: "Please signup with email or phone number",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      message: "something went wrong",
      error: error,
    });
  }
}

async function VerifyOtpAndCreate(req, res) {
  const { token, otp } = req.body;

  const getData = JWT.verify(token, process.env.secretKey); 

  const VerifyOtpNow = await OtpModel.findOne({ EmailOrPhone: getData.email });
  // console.log("first:",VerifyOtpNow)
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(getData.password, salt);


  if (VerifyOtpNow.Otp == otp) {
    // console.log("first:",VerifyOtpNow)
    const createUser = new UserModel({
      email: getData.email,
      username: getData.username,
      password: hash,
    });

    const result = await createUser.save();
    // console.log("first:",VerifyOtpNow)
 const userById = await UserModel.findById(result._id).select("-password")
    res.send({
      success: true,
      message: "User created successfully",
      data: userById,
    });
  } else {
    res.send({

     success: false,
      message: "Invalid otp ",
    });
  }
}

async function sendOtpOnMail(email, otp) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.appEmail,
        pass: process.env.appPassword,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.appEmail,
      to: email,
      subject: "Your OTP for Account Verification - Nail Warz",
      text: `Your One-Time Password (OTP) is ${otp}. Please use this code to verify your account. It will expire in 10 minutes.`,
      html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Welcome to Nail Warz!</h2>
                <p>Your One-Time Password (OTP) is:</p>
                <h1 style="color: #2e86de;">${otp}</h1>
                <p>Please enter this code in the app to verify your account.</p>
                <p><strong>Note:</strong> This OTP is valid for 10 minutes. Do not share it with anyone.</p>
                <br/>
                <p>Thank you,<br/>The Nail Warz Team</p>
              </div>
            `,
    });
    return info;
  } catch (error) {
    success: false,
    console.log("error", error);
    return error;
  }
}

async function updateUserById(req, res) {
  try {
    const { userId, ...updateFields } = req.body;

    let image = null;
    if (req.files && req.files.image && req.files.image[0]) {
      image = req.files.image[0].filename;
    }

    if (image) {
      updateFields.image = image;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(200).json({ success: false, message: "User not found" });
    }
     
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(400).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

module.exports = {
  loginWithPhoneOtp,
  loginWitheEmailOtp,
  loginWitheEmailAndPassword,
  SignupWithEmailOrPhoneandPassword,
  VerifyOtpAndCreate,
  updateUserById
};
