const express = require("express");
const uploads = require("../middleware/upload");

const AuthController = require("../controllers/AuthController");
const PostingController = require("../controllers/PostingController");
const VotingController = require("../controllers/VotingController");
const adminController = require("../controllers/adminProfile");
const technicianController = require("../controllers/technician");
const serviceController = require("../controllers/service");
const bookingController= require("../controllers/booking");
const favouriteController = require("../controllers/favourite");
const notificationController = require("../controllers/notification");
const ratingController = require("../controllers/rating");
const superAdminController = require("../controllers/superAdmin")
const categoryController = require("../controllers/category")
const routes = express.Router();

// User auth
routes.post("/SignupWithEmailOrPhoneandPassword",AuthController.SignupWithEmailOrPhoneandPassword);
routes.post("/VerifyOtpAndCreate", AuthController.VerifyOtpAndCreate);
routes.post("/loginWitheEmailAndPassword", AuthController.loginWitheEmailAndPassword);
routes.post("/updateUserById",uploads.userUpload.fields([{ name: "image", maxCount: 1 }]),AuthController.updateUserById);

//notification
routes.get("/getNotificationsByUserId", notificationController.getNotificationsByUserId);
routes.get("/getNotificationsBySalonId", notificationController.getNotificationsBySalonId);

//Favourites
routes.post("/addFavouriteSalon", favouriteController.addFavouriteSalon);
routes.get("/getUserById", favouriteController.getUserById);

//Post and voting routes
routes.post("/CreatePost", uploads.postUpload.single("Post_Image"), PostingController.CreatePost);
routes.post("/LikePost", PostingController.LikePost);
routes.post("/CommentPost", PostingController.CommentPost);
routes.post("/SharePost", PostingController.SharePost);
routes.get("/getAllPost", PostingController.getAllPost);
routes.get("/getPostById", PostingController.getPostById);

//Voting
routes.post("/VotePost", VotingController.VotePost);
routes.get("/getPollPosts", VotingController.getPollPosts);

//Admin
routes.post("/signUpAdmin", adminController.signUpAdmin);
routes.post("/loginAdmin", adminController.loginAdmin);
routes.post("/updateAdminProfile",uploads.adminUpload.fields([{ name: "image", maxCount: 4 }]), adminController.updateAdminProfile);
routes.post("/getSalonByServiceNameOrLocation",adminController.getSalonByServiceNameOrLocation);
routes.post("/updateSalonIsActive", adminController.updateSalonIsActive);
routes.post("/addOrRemoveCategoryId", adminController.addOrRemoveCategoryId);
routes.get("/getAdminById", adminController.getAdminById);

// Technician
routes.post("/createTechnician",uploads.technicianUpload.single("image"), technicianController.createTechnician);
routes.post("/updateTechnician",uploads.technicianUpload.single("image"),technicianController.updateTechnician);
routes.post("/updateTechnicianIsActive", technicianController.updateTechnicianIsActive);
routes.get("/getTechnicianById", technicianController.getTechnicianById);
routes.get("/getAllTechniciansBySalonId", technicianController.getAllTechniciansBySalonId);

// services
routes.post("/createService",uploads.serviceUpload.fields([{ name: "images", maxCount: 4 }]),serviceController.createService);
routes.post("/updateService",uploads.serviceUpload.fields([{ name: "images", maxCount: 4 }]),serviceController.updateService);
routes.post("/deleteService", serviceController.deleteService);
routes.get("/getServiceById", serviceController.getServiceById);
routes.get("/getAllServicesBySalonId", serviceController.getAllServicesBySalonId);

//Appointments
routes.post("/createBooking", bookingController.createBooking);
routes.post("/updateBooking", bookingController.updateBooking);
routes.get("/getBookingById", bookingController.getBookingById);
routes.get("/getBookingsByUserIdAndStatus", bookingController.getBookingsByUserIdAndStatus);
routes.get("/getBookingsBySalonIdAndStatus", bookingController.getBookingsBySalonIdAndStatus);
routes.get("/getBookingsBySalonId", bookingController.getBookingsBySalonId);

//Rating
routes.post("/giveRatingToSalon", ratingController.giveRatingToSalon);
routes.get("/getRatingBySalonOrStar", ratingController.getRatingBySalonOrStar);
routes.get("/getRatingByRatingId", ratingController.getRatingByRatingId);

//superAdmin
routes.post("/signUpSuperAdmin", superAdminController.signUpSuperAdmin);
routes.post("/loginSuperAdmin", superAdminController.loginSuperAdmin);

//category
routes.post("/createCategory", categoryController.createCategory);
routes.post("/updateCategory", categoryController.updateCategory);
routes.post("/deleteCategory", categoryController.deleteCategory);
routes.get("/getAllCategories", categoryController.getAllCategories);

module.exports = routes;
