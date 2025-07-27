const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  
  // Pricing
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  codSurcharge: {
    type: Number,
    default: function() {
      return parseFloat(process.env.COD_SURCHARGE) || 30;
    }
  },
  
  // Product Details
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['Chips', 'Juices', 'Milk', 'Supplements', 'Fruits', 'Vegetables', 'Herbs', 'Nuts', 'Other']
  },
  subcategory: {
    type: String,
    maxlength: [50, 'Subcategory cannot be more than 50 characters']
  },
  
  // Product Specifications
  specifications: {
    weight: {
      value: Number,
      unit: {
        type: String,
        enum: ['grams', 'kg', 'ml', 'liters', 'pieces'],
        default: 'grams'
      }
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        enum: ['cm', 'inches'],
        default: 'cm'
      }
    },
    flavors: [{
      type: String,
      maxlength: [50, 'Flavor name cannot be more than 50 characters']
    }],
    ingredients: [{
      type: String,
      maxlength: [100, 'Ingredient cannot be more than 100 characters']
    }],
    nutritionalInfo: {
      calories: Number,
      protein: String,
      carbohydrates: String,
      fat: String,
      fiber: String,
      sodium: String,
      servingSize: String
    },
    allergens: [{
      type: String,
      enum: ['Nuts', 'Dairy', 'Gluten', 'Soy', 'Eggs', 'Fish', 'Shellfish']
    }]
  },
  
  // Health Benefits
  benefits: [{
    type: String,
    maxlength: [200, 'Benefit description cannot be more than 200 characters']
  }],
  organicCertified: {
    type: Boolean,
    default: false
  },
  
  // Images
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
  // Inventory Management
  stock: {
    quantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    reserved: {
      type: Number,
      default: 0,
      min: [0, 'Reserved stock cannot be negative']
    },
    lowStockThreshold: {
      type: Number,
      default: function() {
        return parseInt(process.env.LOW_STOCK_THRESHOLD) || 3;
      }
    },
    safetyBuffer: {
      type: Number,
      default: function() {
        return parseInt(process.env.SAFETY_BUFFER) || 2;
      }
    }
  },
  
  // Product Sensitivity Flags
  isSensitive: {
    type: Boolean,
    default: false
  },
  sensitivityReasons: [{
    type: String,
    enum: ['fragile', 'frozen', 'bulk', 'high_value', 'perishable']
  }],
  
  // Shipping & Handling
  shippingInfo: {
    isFragile: {
      type: Boolean,
      default: false
    },
    requiresRefrigeration: {
      type: Boolean,
      default: false
    },
    specialHandling: {
      type: String,
      maxlength: [200, 'Special handling instructions cannot be more than 200 characters']
    },
    estimatedDeliveryDays: {
      type: Number,
      default: 1,
      min: [1, 'Delivery days must be at least 1']
    }
  },
  
  // SEO & Marketing
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    slug: {
      type: String,
      unique: true,
      sparse: true
    }
  },
  tags: [String],
  
  // Status & Visibility
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  
  // Analytics
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    purchases: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot be more than 5']
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    lastPurchaseDate: Date,
    popularityScore: {
      type: Number,
      default: 0
    }
  },
  
  // Supplier Information
  supplier: {
    name: String,
    contact: String,
    email: String,
    address: String
  },
  
  // Compliance & Certifications
  certifications: [{
    name: String,
    issuedBy: String,
    validUntil: Date,
    certificateNumber: String
  }],
  
  // Dates
  manufacturingDate: Date,
  expiryDate: Date,
  dateAdded: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  
  // Admin Notes
  adminNotes: {
    type: String,
    maxlength: [500, 'Admin notes cannot be more than 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for available stock (total - reserved - safety buffer)
productSchema.virtual('availableStock').get(function() {
  return Math.max(0, this.stock.quantity - this.stock.reserved - this.stock.safetyBuffer);
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  const available = this.availableStock;
  const threshold = this.stock.lowStockThreshold;
  
  if (available === 0) return 'out_of_stock';
  if (available <= threshold) return 'low_stock';
  return 'in_stock';
});

// Virtual for final price with COD surcharge
productSchema.virtual('finalPrice').get(function() {
  return this.price + (this.codSurcharge || 0);
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (!this.originalPrice || this.originalPrice <= this.price) return 0;
  return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
});

// Virtual for sensitivity check
productSchema.virtual('isSensitiveProduct').get(function() {
  const sensitiveThreshold = parseFloat(process.env.SENSITIVE_PRODUCT_PRICE_THRESHOLD) || 300;
  return this.price >= sensitiveThreshold || 
         this.isSensitive || 
         this.sensitivityReasons.length > 0 ||
         this.shippingInfo.isFragile ||
         this.shippingInfo.requiresRefrigeration;
});

// Pre-save middleware to update timestamps and calculate sensitivity
productSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  
  // Auto-set sensitivity based on price and characteristics
  const sensitiveThreshold = parseFloat(process.env.SENSITIVE_PRODUCT_PRICE_THRESHOLD) || 300;
  if (this.price >= sensitiveThreshold && !this.sensitivityReasons.includes('high_value')) {
    this.sensitivityReasons.push('high_value');
  }
  
  if (this.shippingInfo.isFragile && !this.sensitivityReasons.includes('fragile')) {
    this.sensitivityReasons.push('fragile');
  }
  
  if (this.shippingInfo.requiresRefrigeration && !this.sensitivityReasons.includes('frozen')) {
    this.sensitivityReasons.push('frozen');
  }
  
  // Generate slug if not provided
  if (!this.seo.slug) {
    this.seo.slug = this.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  
  next();
});

// Index for text search
productSchema.index({ 
  name: 'text', 
  description: 'text', 
  'specifications.ingredients': 'text',
  benefits: 'text'
});

// Compound indexes for common queries
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ 'stock.quantity': 1, isActive: 1 });
productSchema.index({ createdAt: -1 });

// Static method to find products by category
productSchema.statics.findByCategory = function(category, options = {}) {
  const query = { category, isActive: true };
  return this.find(query)
    .sort(options.sort || { createdAt: -1 })
    .limit(options.limit || 20);
};

// Static method to find featured products
productSchema.statics.findFeatured = function(limit = 3) {
  return this.find({ isFeatured: true, isActive: true })
    .sort({ 'analytics.popularityScore': -1 })
    .limit(limit);
};

// Static method to find low stock products
productSchema.statics.findLowStock = function() {
  return this.find({ isActive: true })
    .where('stock.quantity').lte(this.schema.paths.stock.schema.paths.lowStockThreshold.default());
};

// Method to reserve stock
productSchema.methods.reserveStock = function(quantity) {
  if (this.availableStock < quantity) {
    throw new Error('Insufficient stock available');
  }
  
  this.stock.reserved += quantity;
  return this.save();
};

// Method to release reserved stock
productSchema.methods.releaseStock = function(quantity) {
  this.stock.reserved = Math.max(0, this.stock.reserved - quantity);
  return this.save();
};

// Method to reduce actual stock (after order completion)
productSchema.methods.reduceStock = function(quantity) {
  if (this.stock.quantity < quantity) {
    throw new Error('Insufficient stock to reduce');
  }
  
  this.stock.quantity -= quantity;
  this.stock.reserved = Math.max(0, this.stock.reserved - quantity);
  this.analytics.purchases += 1;
  this.analytics.lastPurchaseDate = new Date();
  
  return this.save();
};

// Method to increment view count
productSchema.methods.incrementViews = function() {
  this.analytics.views += 1;
  return this.save();
};

module.exports = mongoose.model('Product', productSchema);
