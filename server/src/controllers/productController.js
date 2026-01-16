const Product = require("../models/Product");
const Category = require("../models/Category");
const fs = require("fs");
const path = require("path");

// ============================================
// HELPER: Find or Create Category by Name
// ============================================
const getCategoryId = async (categoryInput) => {
  // If it's already a valid ObjectId (24 hex chars), return it
  if (/^[0-9a-fA-F]{24}$/.test(categoryInput)) {
    const categoryExists = await Category.findById(categoryInput);
    if (categoryExists) {
      return categoryInput;
    }
    throw new Error(`Category ID ${categoryInput} not found`);
  }

  // Otherwise, treat it as a category name
  // Search case-insensitive
  let category = await Category.findOne({ 
    name: { $regex: new RegExp(`^${categoryInput}$`, 'i') } 
  });

  // If category doesn't exist, create it automatically
  if (!category) {
    category = await Category.create({ name: categoryInput });
    console.log(`✅ Auto-created category: ${categoryInput}`);
  }

  return category._id;
};

// ============================================
// GET ALL PRODUCTS
// ============================================
exports.getproducts = async (req, res) => {
  try {
    const { category, isAvailable, search } = req.query;
    let filter = {};

    // Support filtering by category name OR ID
    if (category) {
      try {
        filter.category = await getCategoryId(category);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
    }

    if (isAvailable !== undefined) {
      filter.isAvailable = isAvailable === 'true';
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// ============================================
// GET SINGLE PRODUCT BY ID
// ============================================
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name');

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// ============================================
// CREATE NEW PRODUCT
// ============================================
exports.createProduct = async (req, res) => {
  try {
    const { name, category, price, description, modifiers, stock } = req.body;
    
    // ✅ Convert category name to ID (or use ID if provided)
    let categoryId;
    try {
      categoryId = await getCategoryId(category);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    let parsedModifiers = [];
    if (modifiers) {
      parsedModifiers =
        typeof modifiers === "string" ? JSON.parse(modifiers) : modifiers;
    }
    
    const productData = {
      name,
      category: categoryId, // ✅ Use the converted ID
      price,
      description,
      modifiers: parsedModifiers,
      stock: stock || 0,
    };

    if (req.file) {
      productData.image = `/uploads/products/${req.file.filename}`;
    }
    
    const product = await Product.create(productData);
    
    // Populate category before sending response
    await product.populate('category', 'name');

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error("Error creating product:", error);

    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

// ============================================
// UPDATE PRODUCT
// ============================================
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }
    
    const { name, category, price, description, modifiers, isAvailable, stock } = req.body;

    // ✅ Convert category name to ID if category is being updated
    let categoryId = product.category;
    if (category) {
      try {
        categoryId = await getCategoryId(category);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    }

    let parsedModifiers = modifiers;
    if (modifiers && typeof modifiers === "string") {
      parsedModifiers = JSON.parse(modifiers);
    }

    const updateData = {
      name: name || product.name,
      category: categoryId,
      price: price !== undefined ? price : product.price,
      description: description !== undefined ? description : product.description,
      modifiers: parsedModifiers || product.modifiers,
      isAvailable: isAvailable !== undefined ? isAvailable : product.isAvailable,
      stock: stock !== undefined ? stock : product.stock,
    };
    
    if (req.file) {
      if (product.image) {
        const oldImagePath = path.join(__dirname, "..", product.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = `/uploads/products/${req.file.filename}`;
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('category', 'name');

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ 
      message: "Server error", 
      success: false,
      error: error.message
    });
  }
};

// ============================================
// DELETE PRODUCT
// ============================================
exports.deleteProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found", success: false });
    }

    if (product.image) {
      const imagePath = path.join(__dirname, "..", product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};