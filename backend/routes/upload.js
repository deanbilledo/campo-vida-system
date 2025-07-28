const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/products');
const postsUploadsDir = path.join(__dirname, '../uploads/posts');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(postsUploadsDir)) {
  fs.mkdirSync(postsUploadsDir, { recursive: true });
}

// Configure multer for product uploads
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `product-${uniqueSuffix}${extension}`);
  }
});

// Configure multer for post uploads
const postStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, postsUploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `post-${uniqueSuffix}${extension}`);
  }
});

// Enhanced file filter for images with better validation
const imageFileFilter = (req, file, cb) => {
  // Check file extension
  const allowedExtensions = /\.(jpeg|jpg|png|gif|webp)$/i;
  const hasValidExtension = allowedExtensions.test(file.originalname);
  
  // Check MIME type
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ];
  const hasValidMimeType = allowedMimeTypes.includes(file.mimetype.toLowerCase());

  if (hasValidExtension && hasValidMimeType) {
    return cb(null, true);
  } else {
    const error = new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.');
    error.code = 'INVALID_FILE_TYPE';
    cb(error);
  }
};

// Multer configuration for products
const uploadProduct = multer({
  storage: productStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1
  },
  fileFilter: imageFileFilter
});

// Multer configuration for posts
const uploadPost = multer({
  storage: postStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for posts (can be larger for featured images)
    files: 1
  },
  fileFilter: imageFileFilter
});

// Error handling middleware for multer
const handleMulterErrors = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size allowed is 5MB for products and 10MB for posts.',
          code: 'FILE_TOO_LARGE'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          message: 'Too many files. Only one file allowed per upload.',
          code: 'TOO_MANY_FILES'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          message: 'Unexpected field name. Use "image" as the field name.',
          code: 'UNEXPECTED_FIELD'
        });
      default:
        return res.status(400).json({
          success: false,
          message: 'File upload error: ' + error.message,
          code: 'UPLOAD_ERROR'
        });
    }
  } else if (error.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({
      success: false,
      message: error.message,
      code: 'INVALID_FILE_TYPE'
    });
  }
  
  next(error);
};

// Upload single product image
router.post('/product', protect, uploadProduct.single('image'), handleMulterErrors, (req, res) => {
  try {
    console.log('Upload Route: Product upload request received');
    console.log('Upload Route: File info:', req.file);
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please select an image file.',
        code: 'NO_FILE'
      });
    }

    // Validate file size after upload
    if (req.file.size > 5 * 1024 * 1024) {
      // Delete the uploaded file if it's too large
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size allowed is 5MB.',
        code: 'FILE_TOO_LARGE'
      });
    }

    // Generate the URL path for the uploaded image
    const imageUrl = `/uploads/products/${req.file.filename}`;

    console.log('Upload Route: Generated image URL:', imageUrl);

    res.json({
      success: true,
      message: 'Product image uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: imageUrl,
        path: req.file.path,
        type: 'product'
      }
    });

    console.log('Upload Route: Product upload successful, sent response');
  } catch (error) {
    console.error('Product upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Product image upload failed',
      error: error.message,
      code: 'UPLOAD_FAILED'
    });
  }
});

// Upload single post image
router.post('/post', protect, uploadPost.single('image'), handleMulterErrors, (req, res) => {
  try {
    console.log('Upload Route: Post upload request received');
    console.log('Upload Route: File info:', req.file);
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please select an image file.',
        code: 'NO_FILE'
      });
    }

    // Validate file size after upload
    if (req.file.size > 10 * 1024 * 1024) {
      // Delete the uploaded file if it's too large
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size allowed is 10MB.',
        code: 'FILE_TOO_LARGE'
      });
    }

    // Generate the URL path for the uploaded image
    const imageUrl = `/uploads/posts/${req.file.filename}`;

    console.log('Upload Route: Generated post image URL:', imageUrl);

    res.json({
      success: true,
      message: 'Post image uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: imageUrl,
        path: req.file.path,
        type: 'post'
      }
    });

    console.log('Upload Route: Post upload successful, sent response');
  } catch (error) {
    console.error('Post upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Post image upload failed',
      error: error.message,
      code: 'UPLOAD_FAILED'
    });
  }
});

// Delete uploaded product image
router.delete('/product/:filename', protect, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({
        success: true,
        message: 'Product image deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Product image not found',
        code: 'FILE_NOT_FOUND'
      });
    }
  } catch (error) {
    console.error('Product delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Product image deletion failed',
      error: error.message,
      code: 'DELETE_FAILED'
    });
  }
});

// Delete uploaded post image
router.delete('/post/:filename', protect, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(postsUploadsDir, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({
        success: true,
        message: 'Post image deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Post image not found',
        code: 'FILE_NOT_FOUND'
      });
    }
  } catch (error) {
    console.error('Post delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Post image deletion failed',
      error: error.message,
      code: 'DELETE_FAILED'
    });
  }
});

module.exports = router;
