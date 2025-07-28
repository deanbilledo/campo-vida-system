const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  bulkUpdateStatus,
  getAnalytics
} = require('../controllers/postController');

// Admin routes - all require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Analytics route
router.get('/analytics', getAnalytics);

// Bulk operations
router.patch('/bulk-status', bulkUpdateStatus);

// CRUD routes
router.route('/')
  .get(getAllPosts)
  .post(createPost);

router.route('/:id')
  .get(getPost)
  .put(updatePost)
  .delete(deletePost);

module.exports = router;
