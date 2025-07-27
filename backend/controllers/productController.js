const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    // Build query
    let query = { isActive: true };

    // Search functionality
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Category filter
    if (req.query.category && req.query.category !== 'all') {
      query.category = req.query.category;
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) {
        query.price.$gte = parseFloat(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query.price.$lte = parseFloat(req.query.maxPrice);
      }
    }

    // Stock filter
    if (req.query.inStock === 'true') {
      query['stock.quantity'] = { $gt: 0 };
    }

    // Featured filter
    if (req.query.featured === 'true') {
      query.isFeatured = true;
    }

    // On sale filter
    if (req.query.onSale === 'true') {
      query.isOnSale = true;
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;

    // Sort options
    let sort = {};
    switch (req.query.sort) {
      case 'name':
        sort = { name: 1 };
        break;
      case '-name':
        sort = { name: -1 };
        break;
      case 'price':
        sort = { price: 1 };
        break;
      case '-price':
        sort = { price: -1 };
        break;
      case 'popularity':
        sort = { 'analytics.popularityScore': -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'rating':
        sort = { 'analytics.averageRating': -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    // Execute query
    const products = await Product.find(query)
      .sort(sort)
      .skip(startIndex)
      .limit(limit)
      .select('-adminNotes -supplier');

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    // Pagination info
    const pagination = {
      page,
      pages: Math.ceil(total / limit),
      total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    };

    // Get categories for filters
    const categories = await Product.distinct('category', { isActive: true });

    res.status(200).json({
      success: true,
      count: products.length,
      pagination,
      filters: {
        categories: categories.sort()
      },
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .select('-adminNotes -supplier');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product is not available'
      });
    }

    // Increment view count
    await product.incrementViews();

    // Get related products (same category, excluding current product)
    const relatedProducts = await Product.find({
      category: product.category,
      isActive: true,
      _id: { $ne: product._id }
    })
    .select('name price images category stockStatus')
    .limit(4);

    res.status(200).json({
      success: true,
      data: product,
      relatedProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 3;
    
    const products = await Product.findFeatured(limit);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;

    const products = await Product.find({
      category,
      isActive: true
    })
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit)
    .select('-adminNotes -supplier');

    const total = await Product.countDocuments({ category, isActive: true });

    const pagination = {
      page,
      pages: Math.ceil(total / limit),
      total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    };

    res.status(200).json({
      success: true,
      category,
      count: products.length,
      pagination,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
exports.searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;

    // Text search with scoring
    const products = await Product.find(
      {
        $text: { $search: q },
        isActive: true
      },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .skip(startIndex)
    .limit(limit)
    .select('-adminNotes -supplier');

    const total = await Product.countDocuments({
      $text: { $search: q },
      isActive: true
    });

    const pagination = {
      page,
      pages: Math.ceil(total / limit),
      total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    };

    res.status(200).json({
      success: true,
      query: q,
      count: products.length,
      pagination,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product stock status
// @route   GET /api/products/:id/stock
// @access  Public
exports.getProductStock = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .select('stock stockStatus availableStock');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        stockStatus: product.stockStatus,
        availableStock: product.availableStock,
        totalStock: product.stock.quantity,
        reserved: product.stock.reserved,
        lowStockThreshold: product.stock.lowStockThreshold
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check product availability for order
// @route   POST /api/products/check-availability
// @access  Public
exports.checkAvailability = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required'
      });
    }

    const availability = [];
    let allAvailable = true;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        availability.push({
          productId: item.productId,
          available: false,
          reason: 'Product not found'
        });
        allAvailable = false;
        continue;
      }

      if (!product.isActive) {
        availability.push({
          productId: item.productId,
          available: false,
          reason: 'Product not available'
        });
        allAvailable = false;
        continue;
      }

      const requestedQuantity = parseInt(item.quantity);
      const availableStock = product.availableStock;

      if (availableStock < requestedQuantity) {
        availability.push({
          productId: item.productId,
          available: false,
          reason: 'Insufficient stock',
          requestedQuantity,
          availableStock,
          stockStatus: product.stockStatus
        });
        allAvailable = false;
      } else {
        availability.push({
          productId: item.productId,
          available: true,
          requestedQuantity,
          availableStock,
          stockStatus: product.stockStatus
        });
      }
    }

    res.status(200).json({
      success: true,
      allAvailable,
      items: availability
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          averagePrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories.map(cat => ({
        name: cat._id,
        count: cat.count,
        priceRange: {
          min: cat.minPrice,
          max: cat.maxPrice,
          average: Math.round(cat.averagePrice)
        }
      }))
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get price range for filtering
// @route   GET /api/products/price-range
// @access  Public
exports.getPriceRange = async (req, res, next) => {
  try {
    const priceRange = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          averagePrice: { $avg: '$price' }
        }
      }
    ]);

    if (priceRange.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          min: 0,
          max: 1000,
          average: 500
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        min: Math.floor(priceRange[0].minPrice),
        max: Math.ceil(priceRange[0].maxPrice),
        average: Math.round(priceRange[0].averagePrice)
      }
    });
  } catch (error) {
    next(error);
  }
};
