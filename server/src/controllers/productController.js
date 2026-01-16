const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

// ============================================
// GET ALL PRODUCTS
// ============================================
exports.getproducts = async (req, res) => {
  try {
    const { category, isAvailable, search } = req.query;  // ✅ Fixed typo
    let filter = {};

    if (category) {  // ✅ Fixed: was "catrgory"
      filter.category = category;
    }

  
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // ✅ Fixed: use .sort() not .toSorted()
    // ✅ Fixed: "createdAt" not "createAt"
    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,  // ✅ Fixed: was "succsess"
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
    const product = await Product.findById(req.params.id);

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
    
    let parsedModifiers = [];
    if (modifiers) {
      parsedModifiers =
        typeof modifiers === "string" ? JSON.parse(modifiers) : modifiers;
    }
    
    const productData = {
      name,
      category,
      price,
      description,
      modifiers: parsedModifiers,
      stock: stock || 0,
    };

    if (req.file) {
      productData.image = `/uploads/products/${req.file.filename}`;
    }
    
    const product = await Product.create(productData);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error("Error creating product:", error);

    if (req.file) {
      fs.unlinkSync(req.file.path);  // ✅ Fixed: was "unlinkeSync"
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
exports.updateProduct = async (req, res) => {  // ✅ Fixed: was "updateproduct"
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }
    
    const { name, category, price, description, modifiers, isAvailable, stock } = req.body;

    let parsedModifiers = modifiers;
    if (modifiers && typeof modifiers === "string") {
      parsedModifiers = JSON.parse(modifiers);
    }

    const updateData = {
      name: name || product.name,
      category: category || product.category,
      price: price || product.price,
      description: description !== undefined ? description : product.description,
      modifiers: parsedModifiers || product.modifiers,
     
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
    });

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: "Server error", success: false });
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