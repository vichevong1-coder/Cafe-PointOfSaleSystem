const Category = require("../models/Category");
const Product = require("../models/Product");

// ============================================
// GET ALL CATEGORIES
// ============================================
exports.getCategories = async (req, res) => {
  try {
    // Get all categories sorted by name
    const categories = await Category.find().sort({ name: 1 });

    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// ============================================
// GET SINGLE CATEGORY BY ID
// ============================================
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found", success: false });
    }

    res.json({ success: true, data: category });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// ============================================
// CREATE CATEGORY
// ============================================
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } // Case-insensitive check
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    // Create new category
    const category = await Category.create({ name });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

// ============================================
// UPDATE CATEGORY
// ============================================
// ============================================
// UPDATE CATEGORY
// ============================================
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // ✅ Better validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required"
      });
    }

    let category = await Category.findById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found", success: false });
    }

    // Check if new name already exists (excluding current category)
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      _id: { $ne: req.params.id },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category name already exists",
      });
    }

    // Update category
    category = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    
    // ✅ Send actual error message
    res.status(500).json({ 
      message: "Server error", 
      success: false,
      error: error.message // ⬅️ This shows the actual error!
    });
  }
};
// ============================================
// DELETE CATEGORY
// ============================================
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found", success: false });
    }

    // Check if any products use this category
    const productsCount = await Product.countDocuments({ category: req.params.id });

    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. ${productsCount} product(s) are using this category.`,
      });
    }

    // Delete category
    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// ============================================
// GET PRODUCTS BY CATEGORY
// ============================================
exports.getProductsByCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found", success: false });
    }

    // Find all products in this category
    const products = await Product.find({ category: req.params.id })
      .sort({ name: 1 });

    res.json({
      success: true,
      category: category.name,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};