const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate({
      path: 'items.product',
      select: 'name image price inventory'
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [],
        totalPrice: 0
      });
    }

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, size } = req.body;

    // Validate request
    if (!productId || !quantity || !size) {
      return res.status(400).json({
        success: false,
        message: 'Please provide productId, quantity and size'
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if product is in stock
    if (product.inventory < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough items in stock'
      });
    }

    // Check if size is available
    if (!product.sizes.includes(size)) {
      return res.status(400).json({
        success: false,
        message: 'Selected size is not available'
      });
    }

    // Find user's cart
    let cart = await Cart.findOne({ user: req.user.id });

    // If cart doesn't exist, create one
    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [],
        totalPrice: 0
      });
    }

    // Check if item already exists in cart
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId && item.size === size
    );

    if (itemIndex > -1) {
      // Item exists, update quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Item doesn't exist, add new item
      cart.items.push({
        product: productId,
        quantity,
        size,
        price: product.price
      });
    }

    // Calculate total price
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Save cart
    await cart.save();

    // Populate product details
    await cart.populate({
      path: 'items.product',
      select: 'name image price inventory'
    });

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: cart
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Update cart item
// @route   PUT /api/cart/:itemId
// @access  Private
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    // Validate request
    if (!quantity) {
      return res.status(400).json({
        success: false,
        message: 'Please provide quantity'
      });
    }

    // Find user's cart
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Find item in cart
    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Get product to check inventory
    const product = await Product.findById(cart.items[itemIndex].product);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if product is in stock
    if (product.inventory < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough items in stock'
      });
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;

    // Calculate total price
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Save cart
    await cart.save();

    // Populate product details
    await cart.populate({
      path: 'items.product',
      select: 'name image price inventory'
    });

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      data: cart
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    // Find user's cart
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Find item in cart
    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Remove item
    cart.items.splice(itemIndex, 1);

    // Calculate total price
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Save cart
    await cart.save();

    // Populate product details
    await cart.populate({
      path: 'items.product',
      select: 'name image price inventory'
    });

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: cart
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    // Find user's cart
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Clear items and reset total
    cart.items = [];
    cart.totalPrice = 0;

    // Save cart
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: cart
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};