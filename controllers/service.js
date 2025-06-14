const serviceModel = require("../models/service");
const adminModel = require("../models/adminProfile");
const mongoose = require("mongoose");

const createService = async (req, res) => {
  try {
    const { salonId, serviceName, price, description,categoryId } = req.body;
    let technicianId = req.body.technicianId;

    if (typeof technicianId === "string") {
      try {
        const parsed = JSON.parse(technicianId);
        if (Array.isArray(parsed)) {
          technicianId = parsed;
        }
      } catch (e) {
        return res
          .status(200)
          .json({ success: false, message: "Invalid technicianId format" });
      }
    }


    const images = req.files?.images?.map((file) => file.filename) || [];

    const newService = new serviceModel({
      salonId,
      serviceName,
      images,
      price,
      description,
      technicianId,
      categoryId
    });

    const savedService = await newService.save();
    // const admin = await adminModel.findByIdAndUpdate(
    //   {
    //     _id: salonId,
    //   },
    //   { $push: { serviceName: serviceName } },
    //   { new: true }
    // );
    res.status(200).json({ success: true, data: savedService });
  } catch (error) {
    console.error("Create Service Error:", error);
    res
      .status(400)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const { id } = req.body;
    let updateData = { ...req.body };

    const existingService = await serviceModel.findById(id);
    if (!existingService) {
      return res
        .status(200)
        .json({ success: false, message: "Service not found" });
    }

    let technicianIds = [];

    if (updateData.technicianId) {
      technicianIds = JSON.parse(updateData.technicianId);
    }

   const existingImages = existingService.images || [];
    const newImageNames = files?.images?.map((file) => file.filename) || [];

    const retainedImages = existingImages.filter((img) =>
      newImageNames.includes(img)
    );
    const addedImages = newImageNames.filter(
      (img) => !existingImages.includes(img)
    );

    updateData.images = [...retainedImages, ...addedImages];


    delete updateData.technicianId;

    let updatedService = await serviceModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (technicianIds.length > 0) {
      for (const technicianId of technicianIds) {
        const exists = updatedService.technicianId.includes(technicianId);
        if (exists) {
          updatedService = await serviceModel.findByIdAndUpdate(
            id,
            { $pull: { technicianId: technicianId } },
            { new: true }
          );
        } else {
          updatedService = await serviceModel.findByIdAndUpdate(
            id,
            { $addToSet: { technicianId: technicianId } },
            { new: true }
          );
        }
      }
    }

    return res.status(200).json({ success: true, data: updatedService });
  } catch (error) {
    console.error("Update Service Error:", error);
    return res.status(400).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const deleteService = async (req, res) => {
  try {
    const { id } = req.body;
    const salon = await serviceModel.findById(id);
    const salonId = salon.salonId;

    const admin = await adminModel.findByIdAndUpdate(
      {
        _id: salonId,
      },
      { $pull: { serviceName: salon.serviceName } },
      { new: true }
    );
    if (!admin) {
      return res
        .status(200)
        .json({ success: false, message: "salon not found" });
    }
    const deleted = await serviceModel.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(200)
        .json({ success: false, message: "Service not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    console.error("Delete Service Error:", error);
    res
      .status(400)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

const getServiceById = async (req, res) => {
  try {
    const { id } = req.query;
    const service = await serviceModel.findById(id).populate("technicianId");

    if (!service) {
      return res
        .status(200)
        .json({ success: false, message: "Service not found" });
    } else {
      return res.status(200).json({ success: true, data: service }).populate({
        path: "technicianId",
      });
    }
  } catch (error) {
    console.error("Get Service Error:", error);
    res
      .status(400)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

const getAllServicesBySalonId = async (req, res) => {
  try {
    const { salonId, categoryId } = req.query;
    const filter = {};

    if (salonId) {
      filter.salonId = salonId;
    }
    if (categoryId) {
      filter.categoryId = categoryId
    }
    const services = await serviceModel
      .find(filter)
      .populate("technicianId categoryId")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: services });
  } catch (error) {
    console.error("Get All Services Error:", error);
    res
      .status(400)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

module.exports = {
  createService,
  updateService,
  deleteService,
  getServiceById,
  getAllServicesBySalonId,
};
