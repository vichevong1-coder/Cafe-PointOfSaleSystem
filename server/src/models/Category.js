const mongoose = require("mongoose");

// ============================================
// CATEGORY SCHEMA
// ============================================
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Can't have duplicate category names
      trim: true,
      // Example: "Beverages", "Food", "Desserts"
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Category", categorySchema);