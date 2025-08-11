const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price must be positive']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price must be positive']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  image: {
    type: String,
    required: [true, 'Please add an image']
  },
  // Add this new field for storing Base64 image data
  imageData: {
    type: String,
    // Not required as we'll keep the image field for backward compatibility
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Dress Materials', 'Lehengas', 'Kurtis', 'Suits Pieces']
  },
  inventory: {
    type: Number,
    required: [true, 'Please add inventory count'],
    min: [0, 'Inventory cannot be negative'],
    default: 0
  },
  sizes: {
    type: [String],
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'],
    default: ['Free Size']
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  isSale: {
    type: Boolean,
    default: false
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be below 0'],
    max: [5, 'Rating cannot exceed 5'],
    default: 0
  },
  reviews: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema);