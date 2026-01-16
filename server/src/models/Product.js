const mongoose = require("mongoose");

// ============================================
// MODIFIER SUB-SCHEMA
// ============================================
const modifierOptionSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    // Example: "Small", "Oat Milk", "Extra Shot"
  },
  price: {
    type: Number,
    required: true,
    default: 0,
    // Additional price for this option
    // Example: Small = $0, Medium = $0.50, Large = $1.00
  },
});
const modifierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  options: {
    type: [modifierOptionSchema],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Modifier must have at least one option'
    }
  },
  type: {
    type: String,
    required: true,
    enum: ["radio", "checkbox"],
  },
  required: {
    type: Boolean,
    default: false,
  },
}, { _id: true });


// ============================================
// PRODUCT SCHEMA
// ============================================
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,          // ✅ Fixed: was "trype"
      required: true,
      enum: ["beverage", "food", "dessert", "other"],
    },
    price: {                 // ✅ Added missing price field!
      type: Number,
      required: true,
      min: 0,
    },
   
    image: {
      type: String,
      default: "",
    },
     modifiers: {
      type: [modifierSchema],
      default: [],
      // Array of modifier groups
      // Example: [Size group, Milk group, Extras group]
    },  // ✅ Fixed: was "modifers"
    
  },
  {
    timestamps: true,        
  }
);

module.exports = mongoose.model("Product", productSchema);