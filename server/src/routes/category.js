const express = require('express');
const router = express.Router();

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getProductsByCategory,
} = require('../controllers/categoryController');

const { protect, adminOnly } = require('../middleware/auth');

// ============================================
// PUBLIC ROUTES
// ============================================
// Get all categories (anyone can view)
router.get('/', getCategories);

// Get single category
router.get('/:id', getCategory);

// Get products in a category
router.get('/:id/products', getProductsByCategory);

// ============================================
// ADMIN ONLY ROUTES
// ============================================
// Create category
router.post('/', protect, adminOnly, createCategory);

// Update category
router.put('/:id', protect, adminOnly, updateCategory);

// Delete category
router.delete('/:id', protect, adminOnly, deleteCategory);

module.exports = router;