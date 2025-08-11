const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');

    if (!wishlist) {
      // If no wishlist, create one
      const newWishlist = await Wishlist.create({ user: req.user.id, products: [] });
      return res.status(200).json({ success: true, data: newWishlist });
    }

    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Add a product to the wishlist
// @route   POST /api/wishlist
// @access  Private
exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [productId] });
    } else {
      if (wishlist.products.includes(productId)) {
        return res.status(400).json({ success: false, message: 'Product already in wishlist' });
      }
      wishlist.products.push(productId);
      await wishlist.save();
    }
    
    const populatedWishlist = await wishlist.populate('products');

    res.status(200).json({ success: true, data: populatedWishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Remove a product from the wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params;

  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    await wishlist.save();
    const populatedWishlist = await wishlist.populate('products');

    res.status(200).json({ success: true, data: populatedWishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
