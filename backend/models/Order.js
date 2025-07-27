const mongoose = require('mongoose');
const moment = require('moment');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer is required']
  },
  
  // Order Items
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative']
    },
    flavor: String,
    specialInstructions: String
  }],
  
  // Order Summary
  summary: {
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative']
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: [0, 'Delivery fee cannot be negative']
    },
    codSurcharge: {
      type: Number,
      default: 0,
      min: [0, 'COD surcharge cannot be negative']
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative']
    },
    totalItems: {
      type: Number,
      required: true,
      min: [1, 'Total items must be at least 1']
    }
  },
  
  // Delivery Information
  deliveryInfo: {
    type: {
      type: String,
      enum: ['pickup', 'delivery'],
      required: true
    },
    address: {
      street: String,
      barangay: String,
      city: String,
      province: String,
      zipCode: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      },
      deliveryInstructions: String
    },
    preferredDate: {
      type: Date,
      required: true
    },
    preferredTimeSlot: {
      type: String,
      enum: ['morning', 'afternoon', 'any'],
      default: 'any'
    },
    actualDeliveryDate: Date,
    estimatedDeliveryTime: String
  },
  
  // Payment Information
  payment: {
    method: {
      type: String,
      enum: ['gcash', 'cod'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    referenceNumber: String,
    receiptImage: String,
    paidAt: Date,
    gcashDetails: {
      senderName: String,
      senderNumber: String,
      amount: Number
    },
    codDetails: {
      amountCollected: Number,
      collectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      collectedAt: Date
    }
  },
  
  // Order Status & Workflow
  status: {
    type: String,
    enum: [
      'pending',           // Awaiting approval
      'confirmed',         // Auto or manually confirmed
      'preparing',         // Being prepared by staff
      'ready_for_pickup',  // Ready for customer pickup
      'out_for_delivery',  // Driver has the order
      'delivered',         // Successfully delivered
      'completed',         // Order fully completed
      'cancelled',         // Cancelled by customer or admin
      'failed',           // Delivery failed
      'returned'          // Returned to store
    ],
    default: 'pending'
  },
  
  // Status History for tracking
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String,
    automaticUpdate: {
      type: Boolean,
      default: false
    }
  }],
  
  // Auto-processing Logic
  processing: {
    isAutoProcessed: {
      type: Boolean,
      default: false
    },
    autoConfirmAt: Date,
    requiresManualApproval: {
      type: Boolean,
      default: false
    },
    approvalReasons: [{
      type: String,
      enum: ['low_stock', 'sensitive_product', 'first_time_cod', 'high_value', 'manual_review']
    }],
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date
  },
  
  // Driver Assignment
  driver: {
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    assignedAt: Date,
    deliveryAttempts: [{
      attemptNumber: Number,
      timestamp: Date,
      status: {
        type: String,
        enum: ['successful', 'failed_not_home', 'failed_refused', 'failed_other']
      },
      notes: String,
      proofOfDelivery: {
        photo: String,
        signature: String,
        recipientName: String
      }
    }],
    estimatedArrival: Date,
    actualArrival: Date
  },
  
  // Customer Communication
  notifications: {
    orderConfirmed: {
      sent: { type: Boolean, default: false },
      sentAt: Date
    },
    preparing: {
      sent: { type: Boolean, default: false },
      sentAt: Date
    },
    readyForPickup: {
      sent: { type: Boolean, default: false },
      sentAt: Date
    },
    outForDelivery: {
      sent: { type: Boolean, default: false },
      sentAt: Date
    },
    delivered: {
      sent: { type: Boolean, default: false },
      sentAt: Date
    },
    deliveryReminder: {
      sent: { type: Boolean, default: false },
      sentAt: Date
    }
  },
  
  // Customer Feedback
  feedback: {
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5']
    },
    comment: {
      type: String,
      maxlength: [500, 'Comment cannot be more than 500 characters']
    },
    submittedAt: Date,
    
    // Specific ratings
    productQuality: Number,
    deliveryService: Number,
    packaging: Number,
    wouldRecommend: Boolean
  },
  
  // Special Flags
  flags: {
    isUrgent: {
      type: Boolean,
      default: false
    },
    requiresSpecialHandling: {
      type: Boolean,
      default: false
    },
    hasFragileItems: {
      type: Boolean,
      default: false
    },
    hasFrozenItems: {
      type: Boolean,
      default: false
    },
    isGift: {
      type: Boolean,
      default: false
    },
    giftMessage: String
  },
  
  // Admin Notes
  adminNotes: [{
    note: {
      type: String,
      required: true,
      maxlength: [500, 'Note cannot be more than 500 characters']
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    isInternal: {
      type: Boolean,
      default: true
    }
  }],
  
  // Cancellation Details
  cancellation: {
    reason: {
      type: String,
      enum: [
        'customer_request',
        'payment_failed',
        'out_of_stock',
        'delivery_failed',
        'duplicate_order',
        'fraud_suspected',
        'other'
      ]
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledAt: Date,
    notes: String,
    refundAmount: Number,
    refundMethod: {
      type: String,
      enum: ['gcash', 'store_credit', 'cash']
    },
    refundProcessedAt: Date
  },
  
  // Business Analytics
  analytics: {
    orderSource: {
      type: String,
      enum: ['web', 'mobile', 'phone', 'walk_in'],
      default: 'web'
    },
    deviceType: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet'],
      default: 'desktop'
    },
    customerType: {
      type: String,
      enum: ['new', 'returning', 'vip'],
      default: 'new'
    },
    orderValue: {
      type: String,
      enum: ['low', 'medium', 'high', 'premium'],
      default: 'medium'
    },
    processingTime: {
      orderToConfirmation: Number, // minutes
      confirmationToPreparation: Number,
      preparationToDelivery: Number,
      deliveryToCompletion: Number,
      totalProcessingTime: Number
    }
  },
  
  // Metadata
  ipAddress: String,
  userAgent: String,
  sessionId: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for order age in hours
orderSchema.virtual('orderAge').get(function() {
  return moment().diff(moment(this.createdAt), 'hours');
});

// Virtual for delivery status
orderSchema.virtual('deliveryStatus').get(function() {
  if (this.deliveryInfo.type === 'pickup') {
    return this.status === 'ready_for_pickup' ? 'Ready for pickup' : 'Being prepared';
  }
  
  switch (this.status) {
    case 'pending':
    case 'confirmed':
    case 'preparing':
      return 'Preparing your order';
    case 'out_for_delivery':
      return 'On the way';
    case 'delivered':
    case 'completed':
      return 'Delivered';
    case 'failed':
      return 'Delivery failed';
    default:
      return 'Processing';
  }
});

// Virtual for estimated delivery time
orderSchema.virtual('estimatedDelivery').get(function() {
  if (this.deliveryInfo.type === 'pickup') {
    return 'Next business day 8AM-5PM';
  }
  
  const deliveryDate = moment(this.deliveryInfo.preferredDate);
  const timeSlot = this.deliveryInfo.preferredTimeSlot;
  
  switch (timeSlot) {
    case 'morning':
      return `${deliveryDate.format('MMM DD')} 9AM-12PM`;
    case 'afternoon':
      return `${deliveryDate.format('MMM DD')} 1PM-5PM`;
    default:
      return `${deliveryDate.format('MMM DD')} 9AM-5PM`;
  }
});

// Pre-save middleware to generate order number
orderSchema.pre('save', function(next) {
  if (this.isNew && !this.orderNumber) {
    const date = moment().format('YYYYMMDD');
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    this.orderNumber = `CV${date}${random}`;
  }
  
  // Update processing analytics
  if (this.isModified('status')) {
    const now = new Date();
    const created = this.createdAt;
    
    switch (this.status) {
      case 'confirmed':
        this.analytics.processingTime.orderToConfirmation = 
          moment(now).diff(moment(created), 'minutes');
        break;
      case 'preparing':
        const confirmedTime = this.statusHistory.find(h => h.status === 'confirmed')?.timestamp;
        if (confirmedTime) {
          this.analytics.processingTime.confirmationToPreparation = 
            moment(now).diff(moment(confirmedTime), 'minutes');
        }
        break;
      case 'out_for_delivery':
        const preparingTime = this.statusHistory.find(h => h.status === 'preparing')?.timestamp;
        if (preparingTime) {
          this.analytics.processingTime.preparationToDelivery = 
            moment(now).diff(moment(preparingTime), 'minutes');
        }
        break;
      case 'delivered':
      case 'completed':
        const deliveryTime = this.statusHistory.find(h => h.status === 'out_for_delivery')?.timestamp;
        if (deliveryTime) {
          this.analytics.processingTime.deliveryToCompletion = 
            moment(now).diff(moment(deliveryTime), 'minutes');
        }
        this.analytics.processingTime.totalProcessingTime = 
          moment(now).diff(moment(created), 'minutes');
        break;
    }
    
    // Add status to history
    this.statusHistory.push({
      status: this.status,
      timestamp: now,
      automaticUpdate: !this.processing.approvedBy
    });
  }
  
  // Set analytics order value based on total amount
  if (this.isNew || this.isModified('summary.totalAmount')) {
    const total = this.summary.totalAmount;
    if (total < 500) this.analytics.orderValue = 'low';
    else if (total < 1500) this.analytics.orderValue = 'medium';
    else if (total < 3000) this.analytics.orderValue = 'high';
    else this.analytics.orderValue = 'premium';
  }
  
  next();
});

// Indexes for performance
orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ 'deliveryInfo.preferredDate': 1, status: 1 });
orderSchema.index({ 'driver.assignedDriver': 1, status: 1 });
orderSchema.index({ createdAt: -1 });

// Static methods for business logic
orderSchema.statics.getTodaysOrders = function() {
  const today = moment().startOf('day').toDate();
  const tomorrow = moment().add(1, 'day').startOf('day').toDate();
  
  return this.find({
    createdAt: { $gte: today, $lt: tomorrow }
  }).populate('customer', 'firstName lastName phone')
    .populate('items.product', 'name category')
    .sort({ createdAt: -1 });
};

orderSchema.statics.getPendingOrders = function() {
  return this.find({ 
    status: { $in: ['pending', 'confirmed'] }
  }).populate('customer', 'firstName lastName phone email')
    .populate('items.product', 'name category stock')
    .sort({ createdAt: 1 });
};

orderSchema.statics.getOrdersForDelivery = function(date) {
  const startDate = moment(date).startOf('day').toDate();
  const endDate = moment(date).endOf('day').toDate();
  
  return this.find({
    'deliveryInfo.preferredDate': { $gte: startDate, $lte: endDate },
    'deliveryInfo.type': 'delivery',
    status: { $in: ['confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery'] }
  }).populate('customer', 'firstName lastName phone address')
    .populate('driver.assignedDriver', 'firstName lastName phone')
    .sort({ 'deliveryInfo.preferredDate': 1 });
};

// Method to check if order can be auto-confirmed
orderSchema.methods.canAutoConfirm = function() {
  // Check if it's a pickup order with available stock
  if (this.deliveryInfo.type === 'pickup') {
    return !this.processing.requiresManualApproval;
  }
  
  // Check if it's a delivery order without sensitive items
  if (this.deliveryInfo.type === 'delivery') {
    return !this.processing.requiresManualApproval && 
           !this.flags.hasFragileItems && 
           !this.flags.hasFrozenItems &&
           this.summary.totalAmount < 1000;
  }
  
  return false;
};

// Method to calculate auto-confirm time
orderSchema.methods.calculateAutoConfirmTime = function() {
  const now = moment();
  const businessHours = {
    start: parseInt(process.env.STORE_OPEN_HOUR) || 8,
    end: parseInt(process.env.STORE_CLOSE_HOUR) || 17
  };
  
  // If outside business hours, schedule for next business day
  if (now.hour() < businessHours.start || now.hour() >= businessHours.end || now.day() === 0) {
    const nextBusinessDay = now.day() === 6 ? now.add(2, 'days') : now.add(1, 'day');
    return nextBusinessDay.hour(businessHours.start + 4).minute(0).second(0).toDate();
  }
  
  // During business hours, add 4 hours for admin review + 2 hours auto-confirm
  return now.add(6, 'hours').toDate();
};

// Method to update status with history
orderSchema.methods.updateStatus = function(newStatus, updatedBy = null, notes = '') {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    updatedBy,
    notes,
    automaticUpdate: !updatedBy
  });
  
  return this.save();
};

module.exports = mongoose.model('Order', orderSchema);
