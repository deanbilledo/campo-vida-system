const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Event = require('../models/Event');
const { sendOrderStatusUpdateEmail } = require('../utils/emailService');
const moment = require('moment');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const today = moment().startOf('day').toDate();
    const tomorrow = moment().add(1, 'day').startOf('day').toDate();
    const thisWeek = moment().startOf('week').toDate();
    const thisMonth = moment().startOf('month').toDate();

    // Today's stats
    const todayStats = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: today, $lt: tomorrow } } },
        { $group: { _id: null, total: { $sum: '$summary.totalAmount' } } }
      ]),
      Order.countDocuments({ 
        createdAt: { $gte: today, $lt: tomorrow },
        status: 'pending'
      })
    ]);

    // Weekly stats
    const weeklyStats = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: thisWeek } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: thisWeek } } },
        { $group: { _id: null, total: { $sum: '$summary.totalAmount' } } }
      ])
    ]);

    // Monthly stats
    const monthlyStats = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: thisMonth } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: thisMonth } } },
        { $group: { _id: null, total: { $sum: '$summary.totalAmount' } } }
      ])
    ]);

    // General stats
    const generalStats = await Promise.all([
      User.countDocuments({ role: 'customer', isActive: true }),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ 'stock.quantity': { $lte: 3 }, isActive: true }),
      Order.countDocuments({ status: 'pending' })
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('customer', 'firstName lastName')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('orderNumber customer status summary.totalAmount createdAt deliveryInfo.type');

    // Low stock products
    const lowStockProducts = await Product.find({
      'stock.quantity': { $lte: 3 },
      isActive: true
    })
    .select('name stock category')
    .sort({ 'stock.quantity': 1 })
    .limit(10);

    res.status(200).json({
      success: true,
      data: {
        today: {
          orders: todayStats[0],
          revenue: todayStats[1][0]?.total || 0,
          pendingOrders: todayStats[2]
        },
        week: {
          orders: weeklyStats[0],
          revenue: weeklyStats[1][0]?.total || 0
        },
        month: {
          orders: monthlyStats[0],
          revenue: monthlyStats[1][0]?.total || 0
        },
        general: {
          totalCustomers: generalStats[0],
          totalProducts: generalStats[1],
          lowStockProducts: generalStats[2],
          pendingOrders: generalStats[3]
        },
        recentOrders,
        lowStockProducts
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders for admin
// @route   GET /api/admin/orders
// @access  Private (Admin)
exports.getAllOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    // Build query
    let query = {};

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

    // Delivery type filter
    if (req.query.deliveryType && req.query.deliveryType !== 'all') {
      query['deliveryInfo.type'] = req.query.deliveryType;
    }

    // Payment method filter
    if (req.query.paymentMethod && req.query.paymentMethod !== 'all') {
      query['payment.method'] = req.query.paymentMethod;
    }

    // Search by order number or customer name
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      // This requires a more complex aggregation for customer name search
      query.$or = [
        { orderNumber: searchRegex }
      ];
    }

    const orders = await Order.find(query)
      .populate('customer', 'firstName lastName email phone')
      .populate('items.product', 'name category')
      .populate('driver.assignedDriver', 'firstName lastName')
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

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private (Admin)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    const order = await Order.findById(req.params.id)
      .populate('customer', 'firstName lastName email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Validate status transition
    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['preparing', 'cancelled'],
      preparing: ['ready_for_pickup', 'out_for_delivery', 'cancelled'],
      ready_for_pickup: ['completed', 'cancelled'],
      out_for_delivery: ['delivered', 'failed', 'cancelled'],
      delivered: ['completed'],
      failed: ['out_for_delivery', 'returned'],
      returned: ['completed']
    };

    if (!validTransitions[order.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${order.status} to ${status}`
      });
    }

    // Update order status
    const oldStatus = order.status;
    await order.updateStatus(status, req.user.id, notes);

    // Handle status-specific logic
    if (status === 'confirmed') {
      // Release any temporary stock reservations and deduct actual stock
      for (const item of order.items) {
        try {
          const product = await Product.findById(item.product);
          if (product) {
            await product.reduceStock(item.quantity);
          }
        } catch (stockError) {
          console.error('Failed to reduce stock:', stockError);
        }
      }

      // Update customer COD eligibility if GCash payment
      if (order.payment.method === 'gcash') {
        const customer = await User.findById(order.customer._id);
        customer.successfulGCashOrders += 1;
        await customer.save();
      }
    }

    if (status === 'cancelled') {
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
    }

    // Send notification email
    try {
      await sendOrderStatusUpdateEmail(order, order.customer, status);
    } catch (emailError) {
      console.error('Status update email failed:', emailError);
    }

    res.status(200).json({
      success: true,
      message: `Order status updated from ${oldStatus} to ${status}`,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign driver to order
// @route   PUT /api/admin/orders/:id/assign-driver
// @access  Private (Admin)
exports.assignDriver = async (req, res, next) => {
  try {
    const { driverId } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const driver = await User.findById(driverId);
    if (!driver || driver.role !== 'driver') {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    // Check if driver is available
    if (!driver.driverInfo.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Driver is not available'
      });
    }

    order.driver.assignedDriver = driverId;
    order.driver.assignedAt = new Date();
    await order.save();

    // Update driver's current deliveries
    driver.driverInfo.currentDeliveries.push(order._id);
    await driver.save();

    res.status(200).json({
      success: true,
      message: 'Driver assigned successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products for admin
// @route   GET /api/admin/products
// @access  Private (Admin)
exports.getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    // Build query
    let query = {};

    // Category filter
    if (req.query.category && req.query.category !== 'all') {
      query.category = req.query.category;
    }

    // Active/inactive filter
    if (req.query.active !== undefined) {
      query.isActive = req.query.active === 'true';
    }

    // Stock status filter
    if (req.query.stockStatus) {
      switch (req.query.stockStatus) {
        case 'out_of_stock':
          query['stock.quantity'] = 0;
          break;
        case 'low_stock':
          query['stock.quantity'] = { $gt: 0, $lte: 3 };
          break;
        case 'in_stock':
          query['stock.quantity'] = { $gt: 3 };
          break;
      }
    }

    // Search
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await Product.countDocuments(query);

    const pagination = {
      page,
      pages: Math.ceil(total / limit),
      total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    };

    res.status(200).json({
      success: true,
      count: products.length,
      pagination,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/admin/products
// @access  Private (Admin)
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private (Admin)
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdatedBy: req.user.id },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product stock
// @route   PUT /api/admin/products/:id/stock
// @access  Private (Admin)
exports.updateProductStock = async (req, res, next) => {
  try {
    const { quantity, operation, reason } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    let newQuantity;
    switch (operation) {
      case 'set':
        newQuantity = quantity;
        break;
      case 'add':
        newQuantity = product.stock.quantity + quantity;
        break;
      case 'subtract':
        newQuantity = product.stock.quantity - quantity;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid operation. Use set, add, or subtract'
        });
    }

    if (newQuantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock quantity cannot be negative'
      });
    }

    const oldQuantity = product.stock.quantity;
    product.stock.quantity = newQuantity;
    product.adminNotes = `${product.adminNotes || ''}\n${new Date().toISOString()}: Stock ${operation} by ${req.user.firstName} ${req.user.lastName}. ${oldQuantity} -> ${newQuantity}. Reason: ${reason || 'Not specified'}`.trim();
    
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: {
        productId: product._id,
        productName: product.name,
        oldQuantity,
        newQuantity,
        operation,
        reason
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all customers
// @route   GET /api/admin/customers
// @access  Private (Admin)
exports.getAllCustomers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    // Build query
    let query = { role: 'customer' };

    // Active/inactive filter
    if (req.query.active !== undefined) {
      query.isActive = req.query.active === 'true';
    }

    // COD eligibility filter
    if (req.query.codEligible !== undefined) {
      query.codEligible = req.query.codEligible === 'true';
    }

    // Search
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex }
      ];
    }

    const customers = await User.find(query)
      .select('-password -passwordResetToken -emailVerificationToken')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await User.countDocuments(query);

    const pagination = {
      page,
      pages: Math.ceil(total / limit),
      total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    };

    res.status(200).json({
      success: true,
      count: customers.length,
      pagination,
      data: customers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sales analytics
// @route   GET /api/admin/analytics/sales
// @access  Private (Admin)
exports.getSalesAnalytics = async (req, res, next) => {
  try {
    const { period = 'month', startDate, endDate } = req.query;

    let dateFilter = {};
    
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    } else {
      // Default period filters
      switch (period) {
        case 'week':
          dateFilter.createdAt = { $gte: moment().startOf('week').toDate() };
          break;
        case 'month':
          dateFilter.createdAt = { $gte: moment().startOf('month').toDate() };
          break;
        case 'year':
          dateFilter.createdAt = { $gte: moment().startOf('year').toDate() };
          break;
      }
    }

    // Sales by day
    const salesByDay = await Order.aggregate([
      { $match: { ...dateFilter, status: { $in: ['delivered', 'completed'] } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$summary.totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top products
    const topProducts = await Order.aggregate([
      { $match: { ...dateFilter, status: { $in: ['delivered', 'completed'] } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.subtotal' },
          name: { $first: '$items.name' }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);

    // Payment method breakdown
    const paymentMethods = await Order.aggregate([
      { $match: { ...dateFilter, status: { $in: ['delivered', 'completed'] } } },
      {
        $group: {
          _id: '$payment.method',
          count: { $sum: 1 },
          revenue: { $sum: '$summary.totalAmount' }
        }
      }
    ]);

    // Delivery type breakdown
    const deliveryTypes = await Order.aggregate([
      { $match: { ...dateFilter, status: { $in: ['delivered', 'completed'] } } },
      {
        $group: {
          _id: '$deliveryInfo.type',
          count: { $sum: 1 },
          revenue: { $sum: '$summary.totalAmount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      period,
      data: {
        salesByDay,
        topProducts,
        paymentMethods,
        deliveryTypes
      }
    });
  } catch (error) {
    next(error);
  }
};
