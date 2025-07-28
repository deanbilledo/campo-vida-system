const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getPostBySlug,
  getFeaturedPosts,
  getPostsByCategory,
  getRecentPosts,
  getCategories,
  searchPosts,
  trackView,
  likePost
} = require('../controllers/publicPostController');

// Special routes (must come before parameterized routes)
router.get('/featured', getFeaturedPosts);
router.get('/recent', getRecentPosts);
router.get('/categories', getCategories);
router.get('/search', searchPosts);
router.get('/category/:category', getPostsByCategory);

// Post interaction routes
router.post('/:slug/view', trackView);
router.post('/:id/like', likePost);

// General routes
router.get('/', getAllPosts);
router.get('/:identifier', getPostBySlug);

module.exports = router;
