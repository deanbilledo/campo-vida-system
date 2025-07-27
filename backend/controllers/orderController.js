const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } = require('../utils/emailService');
const moment = require('moment');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const {
      items,
      deliveryInfo,
      payment,
      specialInstructions
    } = req.body;

    // Validate customer
    const customer = await User.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Check business hours and order cutoff
    const now = moment();
    const currentHour = now.hour();
    const currentDay = now.day();
    
    const storeOpenHour = parseInt(process.env.STORE_OPEN_HOUR) || 8;
    const storeCloseHour = parseInt(process.env.STORE_CLOSE_HOUR) || 17;
    const orderCutoffHour = parseInt(process.env.ORDER_CUTOFF_HOUR) || 15;

    // Check if it's Sunday
    if (currentDay === 0) {
      return res.status(400).json({
        success: false,
        message: 'Orders are not accepted on Sundays. Please place your order Monday-Saturday.'
      });
    }

    // Check business hours
    if (currentHour < storeOpenHour || currentHour >= storeCloseHour) {
      return res.status(400).json({
        success: false,
        message: `Orders can only be placed during business hours: ${storeOpenHour}AM-${storeCloseHour}PM`
      });
    }

    // Check daily order capacity
    const todayStart = moment().startOf('day').toDate();
    const todayEnd = moment().endOf('day').toDate();
    const todayOrderCount = await Order.countDocuments({
      'deliveryInfo.type': 'delivery',
      createdAt: { $gte: todayStart, $lte: todayEnd }
    });

    const maxDailyOrders = parseInt(process.env.MAX_DAILY_ORDERS) || 20;
    if (deliveryInfo.type === 'delivery' && todayOrderCount >= maxDailyOrders) {
      const nextAvailableDate = moment().add(1, 'day').format('MMMM DD, YYYY');
      return res.status(400).json({
        success: false,
        message: `Order slots full for today. Next available delivery date: ${nextAvailableDate}`
      });
    }

    // Validate and process order items
    let orderItems = [];
    let subtotal = 0;
    let hasFragileItems = false;
    let hasFrozenItems = false;
    let requiresManualApproval = false;
    let approvalReasons = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }

      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product is not available: ${product.name}`
        });
      }

      // Check stock availability
      if (product.availableStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.availableStock}, Requested: ${item.quantity}`
        });
      }

      // Check if manual approval is required
      if (product.stockStatus === 'low_stock') {
        requiresManualApproval = true;
        if (!approvalReasons.includes('low_stock')) {
          approvalReasons.push('low_stock');
        }
      }

      if (product.isSensitiveProduct) {
        requiresManualApproval = true;
        if (!approvalReasons.includes('sensitive_product')) {
          approvalReasons.push('sensitive_product');
        }
      }

      // Check for special handling requirements
      if (product.shippingInfo.isFragile) {
        hasFragileItems = true;
      }

      if (product.shippingInfo.requiresRefrigeration) {
        hasFrozenItems = true;
      }

      // Reserve stock temporarily
      await product.reserveStock(item.quantity);

      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal: itemSubtotal,
        flavor: item.flavor || '',
        specialInstructions: item.specialInstructions || ''
      });
    }

    // Check COD eligibility for first-time COD users
    if (payment.method === 'cod' && !customer.codEligible) {
      requiresManualApproval = true;
      if (!approvalReasons.includes('first_time_cod')) {
        approvalReasons.push('first_time_cod');
      }
    }

    // Calculate fees
    let deliveryFee = 0;
    let codSurcharge = 0;

    if (deliveryInfo.type === 'delivery') {
      deliveryFee = parseFloat(process.env.DELIVERY_FEE) || 50;
    }

    if (payment.method === 'cod') {
      codSurcharge = parseFloat(process.env.COD_SURCHARGE) || 30;
    }

    const totalAmount = subtotal + deliveryFee + codSurcharge;

    // Check for high-value orders
    if (totalAmount >= 3000) {
      requiresManualApproval = true;
      if (!approvalReasons.includes('high_value')) {
        approvalReasons.push('high_value');
      }
    }

    // Create order
    const order = new Order({
      customer: customer._id,
      items: orderItems,
      summary: {
        subtotal,
        deliveryFee,
        codSurcharge,
        totalAmount,
        totalItems: orderItems.reduce((sum, item) => sum + item.quantity, 0)
      },
      deliveryInfo: {
        ...deliveryInfo,
        // Use customer address if delivery and no address provided
        address: deliveryInfo.type === 'delivery' 
          ? deliveryInfo.address || customer.address 
          : undefined
      },
      payment: {
        method: payment.method,
        status: payment.method === 'gcash' ? 'pending' : 'pending',
        referenceNumber: payment.referenceNumber,
        gcashDetails: payment.method === 'gcash' ? {
          senderName: payment.senderName,
          senderNumber: payment.senderNumber,
          amount: totalAmount
        } : undefined
      },
      processing: {
        requiresManualApproval,
        approvalReasons
      },
      flags: {
        hasFragileItems,
        hasFrozenItems,
        isGift: req.body.isGift || false,
        giftMessage: req.body.giftMessage || ''
      },
      analytics: {
        orderSource: 'web',
        deviceType: req.get('User-Agent')?.includes('Mobile') ? 'mobile' : 'desktop',
        customerType: customer.totalOrders === 0 ? 'new' : 'returning'
      },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Set auto-confirmation time if not requiring manual approval
    if (!requiresManualApproval) {
      order.processing.autoConfirmAt = order.calculateAutoConfirmTime();
      
      // Auto-confirm pickup orders immediately
      if (deliveryInfo.type === 'pickup') {
        order.status = 'confirmed';
        order.processing.isAutoProcessed = true;
      }
    }

    await order.save();

    // Update customer statistics
    customer.totalOrders += 1;
    await customer.save();

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(order, customer);
    } catch (emailError) {
      console.error('Order confirmation email failed:', emailError);
    }

    // Populate order for response
    await order.populate([
      {
        path: 'items.product',
        select: 'name category images'
      },
      {
        path: 'customer',
        select: 'firstName lastName email phone'
      }
    ]);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });

  } catch (error) {
    // Release reserved stock if order creation fails
    if (req.body.items) {
      for (const item of req.body.items) {
        try {
          const product = await Product.findById(item.product);
          if (product) {
            await product.releaseStock(item.quantity);
          }
        } catch (releaseError) {
          console.error('Failed to release stock:', releaseError);
        }
      }
    }
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Build query
    let query = { customer: req.user.id };

    // Status filter
    if (req.query.status && req.query.status !== 'all') {
      query.status = req.query.status;
    }

    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      query.createdAt = {};
      if (req.query.startDate) {
        query.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        query.createdAt.$lte = new Date(req.query.endDate);
      }
    }

    const orders = await Order.find(query)
      .populate('items.product', 'name category images')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await Order.countDocuments(query);

    const pagination = {
      page,
      pages: Math.ceil(total / limit),
      total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    };

    res.status(200).json({
      success: true,
      count: orders.length,
      pagination,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name category images')
      .populate('customer', 'firstName lastName email phone')
      .populate('driver.assignedDriver', 'firstName lastName phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check ownership (customer can only see their own orders)
    if (req.user.role === 'customer' && order.customer._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check ownership
    if (order.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if order can be cancelled
    const cancellableStatuses = ['pending', 'confirmed'];
    if (!cancellableStatuses.includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Update order status
    order.status = 'cancelled';
    order.cancellation = {
      reason: 'customer_request',
      cancelledBy: req.user.id,
      cancelledAt: new Date(),
      notes: req.body.reason || 'Cancelled by customer'
    };

    await order.save();

    // Release reserved stock
    for (const item of order.items) {
      try {
        const product = await Product.findById(item.product);
        if (product) {
          await product.releaseStock(item.quantity);
        }
      } catch (stockError) {
        console.error('Failed to release stock:', stockError);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Track order
// @route   GET /api/orders/:id/track
// @access  Private
exports.trackOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .select('orderNumber status deliveryInfo statusHistory driver estimatedDelivery')
      .populate('driver.assignedDriver', 'firstName lastName phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check ownership
    if (order.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Create tracking timeline
    const timeline = order.statusHistory.map(history => ({
      status: history.status,
      timestamp: history.timestamp,
      notes: history.notes,
      isCompleted: true
    }));

    // Add current status if not in history
    const currentStatusInHistory = timeline.find(t => t.status === order.status);
    if (!currentStatusInHistory) {
      timeline.push({
        status: order.status,
        timestamp: new Date(),
        notes: '',
        isCompleted: true
      });
    }

    res.status(200).json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        currentStatus: order.status,
        deliveryStatus: order.deliveryStatus,
        estimatedDelivery: order.estimatedDelivery,
        deliveryType: order.deliveryInfo.type,
        driver: order.driver.assignedDriver,
        timeline: timeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit order feedback
// @route   POST /api/orders/:id/feedback
// @access  Private
exports.submitFeedback = async (req, res, next) => {
  try {
    const { rating, comment, productQuality, deliveryService, packaging, wouldRecommend } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check ownership
    if (order.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if order is completed
    if (!['delivered', 'completed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Feedback can only be submitted for completed orders'
      });
    }

    // Check if feedback already submitted
    if (order.feedback.rating) {
      return res.status(400).json({
        success: false,
        message: 'Feedback has already been submitted for this order'
      });
    }

    order.feedback = {
      rating,
      comment,
      productQuality,
      deliveryService,
      packaging,
      wouldRecommend,
      submittedAt: new Date()
    };

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: order.feedback
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order statistics for customer
// @route   GET /api/orders/stats
// @access  Private
exports.getOrderStats = async (req, res, next) => {
  try {
    const customerId = req.user.id;

    const stats = await Order.aggregate([
      { $match: { customer: customerId } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$summary.totalAmount' },
          averageOrderValue: { $avg: '$summary.totalAmount' },
          completedOrders: {
            $sum: { $cond: [{ $in: ['$status', ['delivered', 'completed']] }, 1, 0] }
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalOrders: 0,
      totalSpent: 0,
      averageOrderValue: 0,
      completedOrders: 0,
      cancelledOrders: 0
    };

    // Get recent orders
    const recentOrders = await Order.find({ customer: customerId })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber status summary.totalAmount createdAt deliveryInfo.type');

    res.status(200).json({
      success: true,
      data: {
        stats: {
          ...result,
          averageOrderValue: Math.round(result.averageOrderValue || 0),
          completionRate: result.totalOrders > 0 
            ? Math.round((result.completedOrders / result.totalOrders) * 100) 
            : 0
        },
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};
