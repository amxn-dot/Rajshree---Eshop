const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// Import user controller (you'll need to create this)
const { 
  getUsers,
  getUser,
  updateUser,
  deleteUser 
} = require('../controllers/userController');

// Routes
router.route('/')
  .get(protect, authorize('admin'), getUsers);

router.route('/:id')
  .get(protect, getUser)
  .put(protect, updateUser)
  .delete(protect, authorize('admin'), deleteUser);

module.exports = router;