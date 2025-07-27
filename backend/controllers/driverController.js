const Order = require('../models/Order');
const User = require('../models/User');
const { sendOrderStatusUpdateEmail } = require('../utils/emailService');

// @desc    Get driver dashboard
// @route   GET /api/driver/dashboard
// @access  Private (Driver)
exports.getDriverDashboard = async (req, res, next) => {
  try {
    const driverId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get driver's current deliveries
    const currentDeliveries = await Order.find({
      'driver.assignedDriver': driverId,
      status: { $in: ['confirmed', 'preparing', 'out_for_delivery'] }
    })
    .populate('customer', 'firstName lastName phone address')
    .populate('items.product', 'name category')
    .sort({ 'deliveryInfo.preferredDate': 1 });

    // Get today's deliveries
    const todayDeliveries = await Order.find({
      'driver.assignedDriver': driverId,
      'deliveryInfo.preferredDate': { $gte: today, $lt: tomorrow },
      status: { $ne: 'cancelled' }
    })
    .populate('customer', 'firstName lastName phone address')
    .populate('items.product', 'name')
    .sort({ 'deliveryInfo.preferredDate': 1 });

    // Driver statistics
    const stats = await Order.aggregate([
      { $match: { 'driver.assignedDriver': driverId } },
      {
        $group: {
          _id: null,
          totalDeliveries: { $sum: 1 },
          completedDeliveries: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
          },
          failedDeliveries: {
            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
          },
          totalRevenue: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, '$summary.totalAmount', 0] }
          }
        }
      }
    ]);

    const driverStats = stats[0] || {
      totalDeliveries: 0,
      completedDeliveries: 0,
      failedDeliveries: 0,
      totalRevenue: 0
    };

    // Calculate success rate
    driverStats.successRate = driverStats.totalDeliveries > 0
      ? Math.round((driverStats.completedDeliveries / driverStats.totalDeliveries) * 100)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        currentDeliveries,
        todayDeliveries,
        stats: driverStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get delivery orders for driver
// @route   GET /api/driver/deliveries
// @access  Private (Driver)
exports.getDeliveries = async (req, res, next) => {
  try {
    const driverId = req.user.id;
    const { date, status } = req.query;

    let query = { 'driver.assignedDriver': driverId };

    // Filter by date
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      query['deliveryInfo.preferredDate'] = {
        $gte: startDate,
        $lt: endDate
      };
    }

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    const deliveries = await Order.find(query)
      .populate('customer', 'firstName lastName phone address')
      .populate('items.product', 'name category')
      .sort({ 'deliveryInfo.preferredDate': 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: deliveries.length,
      data: deliveries
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single delivery details
// @route   GET /api/driver/deliveries/:id
// @access  Private (Driver)
exports.getDelivery = async (req, res, next) => {
  try {
    const driverId = req.user.id;
    const delivery = await Order.findOne({
      _id: req.params.id,
      'driver.assignedDriver': driverId
    })
    .populate('customer', 'firstName lastName phone address')
    .populate('items.product', 'name category price');

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found or not assigned to you'
      });
    }

    res.status(200).json({
      success: true,
      data: delivery
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update delivery status
// @route   PUT /api/driver/deliveries/:id/status
// @access  Private (Driver)
exports.updateDeliveryStatus = async (req, res, next) => {
  try {
    const driverId = req.user.id;
    const { status, notes, location } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      'driver.assignedDriver': driverId
    }).populate('customer', 'firstName lastName email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found or not assigned to you'
      });
    }

    // Validate status transition for drivers
    const driverAllowedStatuses = ['out_for_delivery', 'delivered', 'failed'];
    if (!driverAllowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status for driver update'
      });
    }

    const oldStatus = order.status;
    
    // Update order status
    await order.updateStatus(status, driverId, notes);

    // Handle specific status updates
    if (status === 'out_for_delivery') {
      order.driver.estimatedArrival = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    }

    if (status === 'delivered') {
      order.driver.actualArrival = new Date();
      
      // If COD, mark payment as collected
      if (order.payment.method === 'cod') {
        order.payment.status = 'paid';
        order.payment.codDetails = {
          amountCollected: order.summary.totalAmount,
          collectedBy: driverId,
          collectedAt: new Date()
        };
      }

      // Update customer statistics
      const customer = await User.findById(order.customer);
      if (customer) {
        customer.totalSpent += order.summary.totalAmount;
        customer.lastOrderDate = new Date();
        customer.averageOrderValue = customer.totalSpent / customer.totalOrders;
        await customer.save();
      }
    }

    if (status === 'failed') {
      // Add delivery attempt
      const attemptNumber = order.driver.deliveryAttempts.length + 1;
      order.driver.deliveryAttempts.push({
        attemptNumber,
        timestamp: new Date(),
        status: 'failed_not_home',
        notes: notes || 'Customer not available'
      });

      // If second failed attempt, mark as returned
      if (attemptNumber >= 2) {
        order.status = 'returned';
        
        // Release stock back to inventory
        for (const item of order.items) {
          try {
            const Product = require('../models/Product');
            const product = await Product.findById(item.product);
            if (product) {
              product.stock.quantity += item.quantity;
              await product.save();
            }
          } catch (stockError) {
            console.error('Failed to return stock:', stockError);
          }
        }
      }
    }

    await order.save();

    // Send notification email
    try {
      await sendOrderStatusUpdateEmail(order, order.customer, status);
    } catch (emailError) {
      console.error('Status update email failed:', emailError);
    }

    res.status(200).json({
      success: true,
      message: `Delivery status updated from ${oldStatus} to ${status}`,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add delivery proof
// @route   POST /api/driver/deliveries/:id/proof
// @access  Private (Driver)
exports.addDeliveryProof = async (req, res, next) => {
  try {
    const driverId = req.user.id;
    const { photo, signature, recipientName, notes } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      'driver.assignedDriver': driverId
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found or not assigned to you'
      });
    }

    // Find the current delivery attempt or create a new one
    let currentAttempt = order.driver.deliveryAttempts.find(
      attempt => attempt.status === 'successful' || !attempt.status
    );

    if (!currentAttempt) {
      currentAttempt = {
        attemptNumber: order.driver.deliveryAttempts.length + 1,
        timestamp: new Date(),
        status: 'successful'
      };
      order.driver.deliveryAttempts.push(currentAttempt);
    }

    // Add proof of delivery
    currentAttempt.proofOfDelivery = {
      photo,
      signature,
      recipientName,
      notes
    };
    currentAttempt.status = 'successful';

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Delivery proof added successfully',
      data: currentAttempt
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update driver availability
// @route   PUT /api/driver/availability
// @access  Private (Driver)
exports.updateAvailability = async (req, res, next) => {
  try {
    const { isAvailable } = req.body;
    
    const driver = await User.findById(req.user.id);
    
    if (!driver || driver.role !== 'driver') {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    driver.driverInfo.isAvailable = isAvailable;
    await driver.save();

    res.status(200).json({
      success: true,
      message: `Driver availability updated to ${isAvailable ? 'available' : 'unavailable'}`,
      data: {
        isAvailable: driver.driverInfo.isAvailable
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get driver performance stats
// @route   GET /api/driver/performance
// @access  Private (Driver)
exports.getPerformanceStats = async (req, res, next) => {
  try {
    const driverId = req.user.id;
    const { period = 'month' } = req.query;

    let dateFilter = {};
    switch (period) {
      case 'week':
        dateFilter.createdAt = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
        break;
      case 'month':
        dateFilter.createdAt = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
        break;
      case 'year':
        dateFilter.createdAt = { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) };
        break;
    }

    const stats = await Order.aggregate([
      { 
        $match: { 
          'driver.assignedDriver': driverId,
          ...dateFilter
        }
      },
      {
        $group: {
          _id: null,
          totalDeliveries: { $sum: 1 },
          successfulDeliveries: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
          },
          failedDeliveries: {
            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
          },
          totalCODCollected: {
            $sum: { 
              $cond: [
                { $and: [{ $eq: ['$payment.method', 'cod'] }, { $eq: ['$status', 'delivered'] }] },
                '$summary.totalAmount',
                0
              ]
            }
          },
          averageDeliveryTime: {
            $avg: {
              $subtract: ['$driver.actualArrival', '$driver.assignedAt']
            }
          }
        }
      }
    ]);

    const performanceData = stats[0] || {
      totalDeliveries: 0,
      successfulDeliveries: 0,
      failedDeliveries: 0,
      totalCODCollected: 0,
      averageDeliveryTime: 0
    };

    // Calculate success rate
    performanceData.successRate = performanceData.totalDeliveries > 0
      ? Math.round((performanceData.successfulDeliveries / performanceData.totalDeliveries) * 100)
      : 0;

    // Convert average delivery time to minutes
    performanceData.averageDeliveryTime = performanceData.averageDeliveryTime
      ? Math.round(performanceData.averageDeliveryTime / (1000 * 60))
      : 0;

    res.status(200).json({
      success: true,
      period,
      data: performanceData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get earnings summary
// @route   GET /api/driver/earnings
// @access  Private (Driver)
exports.getEarnings = async (req, res, next) => {
  try {
    const driverId = req.user.id;
    const { period = 'month' } = req.query;

    let dateFilter = {};
    switch (period) {
      case 'day':
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateFilter.createdAt = { $gte: today, $lt: tomorrow };
        break;
      case 'week':
        dateFilter.createdAt = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
        break;
      case 'month':
        dateFilter.createdAt = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
        break;
    }

    const earnings = await Order.aggregate([
      { 
        $match: { 
          'driver.assignedDriver': driverId,
          status: 'delivered',
          ...dateFilter
        }
      },
      {
        $group: {
          _id: null,
          totalDeliveries: { $sum: 1 },
          totalDeliveryFees: { $sum: '$summary.deliveryFee' },
          totalCODCollected: {
            $sum: { 
              $cond: [
                { $eq: ['$payment.method', 'cod'] },
                '$summary.totalAmount',
                0
              ]
            }
          }
        }
      }
    ]);

    const earningsData = earnings[0] || {
      totalDeliveries: 0,
      totalDeliveryFees: 0,
      totalCODCollected: 0
    };

    // Calculate commission (assuming 10% of delivery fees)
    earningsData.commission = Math.round(earningsData.totalDeliveryFees * 0.1);

    res.status(200).json({
      success: true,
      period,
      data: earningsData
    });
  } catch (error) {
    next(error);
  }
};
