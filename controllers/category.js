const categoryModel = require("../models/category");

// Create Category
const createCategory = async (req, res) => {
  try {
    const {superAdminId, categoryName } = req.body;

    const existing = await categoryModel.findOne({ categoryName: categoryName });
    if (existing) {
      return res.status(200).json({ success: false, message: "Category already exists" });
    }

    const category = await categoryModel({ superAdminId : superAdminId,categoryName: categoryName });
    await category.save()
    res.status(200).json({ success: true, message: "Category created", data: category });
  } catch (error) {
    console.error("Create Category Error:", error);
    res.status(400).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Get All Categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error("Get All Categories Error:", error);
    res.status(400).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Update Category
const updateCategory = async (req, res) => {
  try {
    const {categoryId, categoryName } = req.body;

    const updated = await categoryModel.findByIdAndUpdate(
      categoryId,
      { categoryName: categoryName },
      { new: true }
    );

    if (!updated) {
      return res.status(200).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({ success: true, message: "Category updated", data: updated });
  } catch (error) {
    console.error("Update Category Error:", error);
    res.status(400).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Delete Category
const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;

    const deleted = await categoryModel.findByIdAndDelete(categoryId);

    if (!deleted) {
      return res.status(200).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    console.error("Delete Category Error:", error);
    res.status(400).json({ success: false, message: "Server Error", error: error.message });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
