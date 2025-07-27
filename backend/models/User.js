const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^(\+63|0)?9\d{9}$/, 'Please enter a valid Philippine phone number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'driver', 'super_admin'],
    default: 'customer'
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      maxlength: [200, 'Street address cannot be more than 200 characters']
    },
    barangay: {
      type: String,
      required: [true, 'Barangay is required'],
      maxlength: [100, 'Barangay cannot be more than 100 characters']
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      maxlength: [100, 'City cannot be more than 100 characters']
    },
    province: {
      type: String,
      required: [true, 'Province is required'],
      maxlength: [100, 'Province cannot be more than 100 characters']
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required'],
      match: [/^\d{4}$/, 'Please enter a valid 4-digit ZIP code']
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    deliveryInstructions: {
      type: String,
      maxlength: [500, 'Delivery instructions cannot be more than 500 characters']
    }
  },
  profileImage: {
    type: String,
    default: null
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // COD Eligibility System
  codEligible: {
    type: Boolean,
    default: false
  },
  successfulGCashOrders: {
    type: Number,
    default: 0
  },
  
  // Account Security
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  lastLogin: Date,
  
  // Preferences
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      orderUpdates: { type: Boolean, default: true },
      promotions: { type: Boolean, default: false }
    },
    deliveryPreference: {
      type: String,
      enum: ['pickup', 'delivery'],
      default: 'delivery'
    }
  },
  
  // Customer Statistics
  totalOrders: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  averageOrderValue: {
    type: Number,
    default: 0
  },
  lastOrderDate: Date,
  customerSince: {
    type: Date,
    default: Date.now
  },
  
  // Driver-specific fields
  driverInfo: {
    licenseNumber: String,
    vehicleType: String,
    vehiclePlateNumber: String,
    isAvailable: {
      type: Boolean,
      default: false
    },
    currentDeliveries: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }],
    deliveryRadius: {
      type: Number,
      default: 10 // km
    },
    totalDeliveries: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5
    }
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Metadata
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to update COD eligibility
userSchema.pre('save', function(next) {
  if (this.isModified('successfulGCashOrders')) {
    const minOrders = parseInt(process.env.MIN_GCASH_ORDERS_FOR_COD) || 5;
    this.codEligible = this.successfulGCashOrders >= minOrders;
  }
  
  // Update last updated timestamp
  this.lastUpdated = new Date();
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: {
        loginAttempts: 1
      },
      $unset: {
        lockUntil: 1
      }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: {
      loginAttempts: 1,
      lockUntil: 1
    },
    $set: {
      lastLogin: new Date()
    }
  });
};

// Method to check if user is within delivery radius
userSchema.methods.isWithinDeliveryRadius = function() {
  if (!this.address.coordinates || !this.address.coordinates.latitude || !this.address.coordinates.longitude) {
    return false;
  }
  
  const storeLatitude = parseFloat(process.env.STORE_LATITUDE) || 14.5995;
  const storeLongitude = parseFloat(process.env.STORE_LONGITUDE) || 120.9842;
  const deliveryRadius = parseFloat(process.env.DELIVERY_RADIUS_KM) || 10;
  
  const distance = calculateDistance(
    storeLatitude,
    storeLongitude,
    this.address.coordinates.latitude,
    this.address.coordinates.longitude
  );
  
  return distance <= deliveryRadius;
};

// Static method to find available drivers
userSchema.statics.findAvailableDrivers = function() {
  return this.find({
    role: 'driver',
    isActive: true,
    'driverInfo.isAvailable': true
  }).select('firstName lastName phone driverInfo');
};

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

module.exports = mongoose.model('User', userSchema);
