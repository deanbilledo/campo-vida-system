const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send email
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const message = {
      from: `${process.env.FROM_NAME || 'Campo Vida'} <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html || options.message,
      text: options.text
    };

    const info = await transporter.sendMail(message);
    console.log('Email sent: ', info.messageId);
    return info;
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
};

// Email templates
const emailTemplates = {
  // Welcome email for new users
  welcome: (user) => ({
    subject: 'Welcome to Campo Vida! 🌿',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #10B981; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to Campo Vida! 🌿</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2>Hello ${user.firstName}!</h2>
          <p>Thank you for joining Campo Vida, your trusted source for healthy and organic products!</p>
          <p>Your account has been successfully created. Here's what you can do now:</p>
          <ul>
            <li>🛒 Browse our collection of organic products</li>
            <li>📱 Place orders for pickup or delivery</li>
            <li>📅 Stay updated with our events and workshops</li>
            <li>💚 Enjoy fresh, healthy products delivered to your door</li>
          </ul>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.FRONTEND_URL}" style="background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Start Shopping</a>
          </div>
          <p><strong>COD Eligibility:</strong> Complete 5 successful GCash orders to unlock Cash on Delivery option!</p>
          <p>If you have any questions, feel free to contact us at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a></p>
          <p>Best regards,<br>The Campo Vida Team</p>
        </div>
        <div style="background-color: #e5e5e5; padding: 10px; text-align: center; font-size: 12px;">
          <p>© 2025 Campo Vida. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  // Order confirmation email
  orderConfirmation: (order, customer) => ({
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #10B981; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Order Confirmed! ✅</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2>Hello ${customer.firstName}!</h2>
          <p>Your order has been confirmed and is being prepared.</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Delivery Type:</strong> ${order.deliveryInfo.type === 'pickup' ? 'Pickup' : 'Home Delivery'}</p>
            <p><strong>Preferred Date:</strong> ${new Date(order.deliveryInfo.preferredDate).toLocaleDateString()}</p>
          </div>

          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Items Ordered</h3>
            ${order.items.map(item => `
              <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <p><strong>${item.name}</strong></p>
                <p>Quantity: ${item.quantity} × ₱${item.price} = ₱${item.subtotal}</p>
              </div>
            `).join('')}
            <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #10B981;">
              <p><strong>Total: ₱${order.summary.totalAmount}</strong></p>
            </div>
          </div>

          ${order.deliveryInfo.type === 'pickup' ? `
            <div style="background-color: #FEF3C7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>📍 Pickup Information</h3>
              <p><strong>Location:</strong> Campo Vida Center</p>
              <p><strong>Hours:</strong> 8AM - 5PM (Monday to Saturday)</p>
              <p><strong>Ready:</strong> Tomorrow</p>
              <p>Please bring a valid ID and your order number when picking up.</p>
            </div>
          ` : `
            <div style="background-color: #DBEAFE; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>🚚 Delivery Information</h3>
              <p><strong>Address:</strong> ${order.deliveryInfo.address.street}, ${order.deliveryInfo.address.barangay}, ${order.deliveryInfo.address.city}</p>
              <p><strong>Delivery Window:</strong> 9AM - 5PM</p>
              <p><strong>Delivery Fee:</strong> ₱${order.summary.deliveryFee}</p>
              <p>Please ensure someone is available to receive the order.</p>
            </div>
          `}

          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>💳 Payment Information</h3>
            <p><strong>Method:</strong> ${order.payment.method.toUpperCase()}</p>
            ${order.payment.method === 'gcash' ? `
              <p><strong>Reference Number:</strong> ${order.payment.referenceNumber}</p>
              <p style="color: #059669;">✅ Payment confirmed</p>
            ` : `
              <p><strong>Amount to Pay:</strong> ₱${order.summary.totalAmount}</p>
              <p style="color: #DC2626;">💰 Cash on Delivery</p>
            `}
          </div>

          <p>You can track your order status by logging into your account on our website.</p>
          <p>If you have any questions, contact us at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a></p>
          
          <p>Best regards,<br>The Campo Vida Team</p>
        </div>
        <div style="background-color: #e5e5e5; padding: 10px; text-align: center; font-size: 12px;">
          <p>© 2025 Campo Vida. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  // Order status update email
  orderStatusUpdate: (order, customer, newStatus) => {
    const statusMessages = {
      preparing: 'Your order is being prepared! 👩‍🍳',
      ready_for_pickup: 'Your order is ready for pickup! 📦',
      out_for_delivery: 'Your order is on the way! 🚚',
      delivered: 'Your order has been delivered! ✅',
      cancelled: 'Your order has been cancelled 😞'
    };

    return {
      subject: `Order Update - ${order.orderNumber}: ${statusMessages[newStatus] || 'Status Updated'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #10B981; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">${statusMessages[newStatus] || 'Order Update'}</h1>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <h2>Hello ${customer.firstName}!</h2>
            <p>Your order <strong>${order.orderNumber}</strong> status has been updated.</p>
            
            <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
              <h3>Current Status</h3>
              <p style="font-size: 24px; margin: 10px 0;">${statusMessages[newStatus] || newStatus.toUpperCase()}</p>
            </div>

            ${newStatus === 'ready_for_pickup' ? `
              <div style="background-color: #FEF3C7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3>📍 Pickup Details</h3>
                <p><strong>Location:</strong> Campo Vida Center</p>
                <p><strong>Hours:</strong> 8AM - 5PM (Monday to Saturday)</p>
                <p>Please bring a valid ID and your order number.</p>
              </div>
            ` : ''}

            ${newStatus === 'out_for_delivery' ? `
              <div style="background-color: #DBEAFE; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3>🚚 Delivery in Progress</h3>
                <p>Our driver is on the way to your location!</p>
                <p><strong>Estimated Arrival:</strong> ${order.estimatedDelivery || 'Within delivery window'}</p>
                <p>Please ensure someone is available to receive the order.</p>
              </div>
            ` : ''}

            <div style="margin: 30px 0; text-align: center;">
              <a href="${process.env.FRONTEND_URL}/orders/${order._id}" style="background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Track Order</a>
            </div>

            <p>Thank you for choosing Campo Vida!</p>
            <p>Best regards,<br>The Campo Vida Team</p>
          </div>
          <div style="background-color: #e5e5e5; padding: 10px; text-align: center; font-size: 12px;">
            <p>© 2025 Campo Vida. All rights reserved.</p>
          </div>
        </div>
      `
    };
  },

  // Password reset email
  passwordReset: (user, resetToken) => ({
    subject: 'Password Reset Request - Campo Vida',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #DC2626; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Password Reset Request 🔐</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2>Hello ${user.firstName}!</h2>
          <p>You have requested to reset your password for your Campo Vida account.</p>
          <p>Click the button below to reset your password. This link will expire in 10 minutes.</p>
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}" style="background-color: #DC2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>

          <p><strong>If you didn't request this password reset, please ignore this email.</strong></p>
          <p>For security reasons, this link will expire in 10 minutes.</p>
          
          <p>If you have any questions, contact us at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a></p>
          <p>Best regards,<br>The Campo Vida Team</p>
        </div>
        <div style="background-color: #e5e5e5; padding: 10px; text-align: center; font-size: 12px;">
          <p>© 2025 Campo Vida. All rights reserved.</p>
        </div>
      </div>
    `
  })
};

// Send specific email types
const sendWelcomeEmail = async (user) => {
  const template = emailTemplates.welcome(user);
  return await sendEmail({
    email: user.email,
    ...template
  });
};

const sendOrderConfirmationEmail = async (order, customer) => {
  const template = emailTemplates.orderConfirmation(order, customer);
  return await sendEmail({
    email: customer.email,
    ...template
  });
};

const sendOrderStatusUpdateEmail = async (order, customer, newStatus) => {
  const template = emailTemplates.orderStatusUpdate(order, customer, newStatus);
  return await sendEmail({
    email: customer.email,
    ...template
  });
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const template = emailTemplates.passwordReset(user, resetToken);
  return await sendEmail({
    email: user.email,
    ...template
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
  sendPasswordResetEmail,
  emailTemplates
};
