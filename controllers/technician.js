const technicianModel = require("../models/technician");
const mongoose = require("mongoose");

const createTechnician = async (req, res) => {
  try {
   const image = req.file?.filename || null;
  const workingDays = JSON.parse(req.body.workingDays);
    const technician = new technicianModel({...req.body, image:image});
    technician.workingDays = workingDays;
    const savedTechnician = await technician.save();

    res.status(200).json({ success: true, data: savedTechnician });
  } catch (error) {
    console.error("Create technician error:", error);
    res.status(400).json({ success: false, message: "Server Error", error: error.message });
  }
};

const updateTechnician = async (req, res) => {
  try {
    const { id } = req.body;
    const technicianData = req.body;
    if (req.file?.filename) {
      technicianData.image = req.file.filename;
    }

    const updated = await technicianModel.findByIdAndUpdate(
      id,
      { $set: technicianData },
      { new: true }
    );

    if (!updated) {
      return res.status(200).json({ success: false, message: "Technician not found" });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("Update technician error:", error);
    res.status(400).json({ success: false, message: "Server Error", error: error.message });
  }
};


const getTechnicianById = async (req, res) => {
  try {
    const { id } = req.query;
    const technician = await technicianModel.findById(id);
    if (!technician) {
      return res.status(200).json({ success: false, message: "Technician not found" });
    }

    res.status(200).json({ success: true, data: technician });
  } catch (error) {
    console.error("Get technician error:", error);
    res.status(400).json({ success: false, message: "Server Error", error: error.message });
  }
};

const getAllTechniciansBySalonId = async (req, res) => {

  try {
    const { salonId } = req.query;
    const technicians = await technicianModel.find({ salonId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: technicians });
  } catch (error) {
    console.error("Get all by salonId error:", error);
    res.status(400).json({ success: false, message: "Server Error", error: error.message });
  }
};

const updateTechnicianIsActive = async (req, res) => {
  try {
    const { workingDayId, isActive } = req.body;

    const day = await technicianModel.findOneAndUpdate(
      { "workingDays._id": workingDayId },
      { $set: { "workingDays.$.isActive": isActive } },
      { new: true }
    );

    if (!day) {
      return res.status(200).json({ success: false, message: "workingDay not found" });
    }else{

    return res.status(200).json({
      success: true,
      message: "workingDay updated",
      data: day
    });
  }
  } catch (error) {
    console.error("error:", error);
    res.status(400).json({ success: false, message: "Server Error", error: error.message });
  }
};


module.exports = {
  createTechnician,
  updateTechnician,
  getTechnicianById,
  getAllTechniciansBySalonId,
  updateTechnicianIsActive
};
