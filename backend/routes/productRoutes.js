const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  }
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Initialize upload
const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

const router = express.Router();

// Add this new route for image uploads with MongoDB storage
router.post('/upload', protect, authorize('admin'), upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }
    
    // Read the file as binary data
    const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    const imageBuffer = fs.readFileSync(filePath);
    
    // Convert to base64
    const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;
    
    // Remove the file from the filesystem since we now have it in memory
    fs.unlinkSync(filePath);
    
    res.status(200).json({
      success: true,
      imageUrl: req.file.filename, // For backward compatibility
      imageData: base64Image // The actual base64 data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

router
  .route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), upload.single('image'), createProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin'), upload.single('image'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

module.exports = router;