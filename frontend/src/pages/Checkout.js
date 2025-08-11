import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  CreditCardIcon,
  BanknotesIcon,
  TruckIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import apiClient from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';
import Input, { Textarea } from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

// Checkout validation schema
const checkoutSchema = yup.object({
  deliveryAddress: yup
    .string()
    .min(10, 'Please provide a complete address')
    .required('Delivery address is required'),
  deliveryNotes: yup.string(),
  contactPhone: yup
    .string()
    .matches(/^(\+63|0)[0-9]{10}$/, 'Please enter a valid Philippine phone number')
    .required('Contact phone is required'),
  paymentMethod: yup
    .string()
    .required('Please select a payment method'),
});

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState('');
  const [codEligible, setCodEligible] = useState(false);
  const [fromBuyNow, setFromBuyNow] = useState(false);

  // Redirect if not authenticated or cart is empty
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }
  }, [isAuthenticated, cartItems.length, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      deliveryAddress: user?.address || '',
      contactPhone: user?.phone || '',
      paymentMethod: '',
    },
  });

  const paymentMethod = watch('paymentMethod');

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 1500 ? 0 : 150;
  const total = subtotal + shipping;

  // Check COD eligibility (mock data - would come from API)
  const codEligible = user?.successfulGCashOrders >= 5;

  // Available payment methods
  const paymentMethods = [
    {
      id: 'gcash',
      name: 'GCash',
      description: 'Pay securely with your GCash wallet',
      icon: <CreditCardIcon className="w-6 h-6" />,
      available: true,
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: codEligible 
        ? 'Pay when your order arrives' 
        : `Requires ${5 - (user?.successfulGCashOrders || 0)} more successful GCash orders`,
      icon: <BanknotesIcon className="w-6 h-6" />,
      available: codEligible,
    },
  ];

  // Delivery time slots
  const deliveryTimeSlots = [
    { id: 'morning', label: 'Morning (8:00 AM - 12:00 PM)', available: true },
    { id: 'afternoon', label: 'Afternoon (1:00 PM - 5:00 PM)', available: true },
    { id: 'evening', label: 'Evening (6:00 PM - 8:00 PM)', available: false },
  ];

  const onSubmit = async (data) => {
    setIsProcessing(true);
    
    try {
      // Prepare order data
      const orderData = {
        items: cartItems,
        total,
        subtotal,
        shipping,
        paymentMethod: data.paymentMethod,
        deliveryAddress: data.deliveryAddress,
        deliveryNotes: data.deliveryNotes,
        contactPhone: data.contactPhone,
        deliveryTime: selectedDeliveryTime,
        userId: user.id,
      };

      // API call to create order
      const response = await apiClient.post('/api/orders', orderData);

      const order = response.data;
      
      // Handle different payment methods
      if (data.paymentMethod === 'gcash') {
        // Redirect to GCash payment
        window.location.href = `/payment/gcash?orderId=${order.id}`;
      } else if (data.paymentMethod === 'cod') {
        // Clear cart and redirect to success page
        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/order-success/${order.id}`);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto-fill address from user profile
  useEffect(() => {
    if (user?.address) {
      setValue('deliveryAddress', user.address);
    }
    if (user?.phone) {
      setValue('contactPhone', user.phone);
    }
  }, [user, setValue]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  if (!isAuthenticated || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="mb-8" variants={itemVariants}>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order details</p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Checkout Form */}
            <motion.div className="lg:col-span-8 space-y-8" variants={itemVariants}>
              {/* Delivery Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <TruckIcon className="w-6 h-6 text-primary-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Delivery Information</h2>
                </div>

                <div className="space-y-6">
                  <Textarea
                    label="Delivery Address"
                    rows={3}
                    placeholder="Enter your complete delivery address with landmarks"
                    error={errors.deliveryAddress?.message}
                    helperText="Please provide a detailed address for accurate delivery"
                    {...register('deliveryAddress')}
                  />

                  <Input
                    label="Contact Phone"
                    type="tel"
                    placeholder="+63 XXX XXX XXXX"
                    leftIcon={<PhoneIcon className="w-5 h-5" />}
                    error={errors.contactPhone?.message}
                    helperText="We'll call this number for delivery updates"
                    {...register('contactPhone')}
                  />

                  <Textarea
                    label="Delivery Notes (Optional)"
                    rows={2}
                    placeholder="Special instructions for delivery (e.g., gate code, landmarks)"
                    {...register('deliveryNotes')}
                  />
                </div>
              </div>

              {/* Delivery Time */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <ClockIcon className="w-6 h-6 text-primary-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Preferred Delivery Time</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {deliveryTimeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => slot.available && setSelectedDeliveryTime(slot.id)}
                      disabled={!slot.available}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        selectedDeliveryTime === slot.id
                          ? 'border-primary-500 bg-primary-50'
                          : slot.available
                          ? 'border-gray-300 hover:border-primary-300'
                          : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${
                          slot.available ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {slot.label}
                        </span>
                        {!slot.available && (
                          <span className="text-xs text-red-600">Unavailable</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <CreditCardIcon className="w-6 h-6 text-primary-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                </div>

                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        method.available
                          ? paymentMethod === method.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-300 hover:border-primary-300'
                          : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      }`}
                    >
                      <input
                        type="radio"
                        value={method.id}
                        disabled={!method.available}
                        className="sr-only"
                        {...register('paymentMethod')}
                      />
                      <div className={`mr-4 ${method.available ? 'text-primary-600' : 'text-gray-400'}`}>
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-medium ${
                            method.available ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            {method.name}
                          </h3>
                          {!method.available && (
                            <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />
                          )}
                        </div>
                        <p className={`text-sm ${
                          method.available ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {method.description}
                        </p>
                      </div>
                      {paymentMethod === method.id && (
                        <CheckCircleIcon className="w-6 h-6 text-primary-600" />
                      )}
                    </label>
                  ))}
                </div>

                {errors.paymentMethod && (
                  <p className="mt-2 text-sm text-red-600">{errors.paymentMethod.message}</p>
                )}

                {/* COD Notice */}
                {!codEligible && (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800">
                          COD Not Yet Available
                        </h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Complete {5 - (user?.successfulGCashOrders || 0)} more successful GCash orders to unlock Cash on Delivery.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div className="lg:col-span-4 mt-8 lg:mt-0" variants={itemVariants}>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-8">
                {/* Summary Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                </div>

                <div className="p-6">
                  {/* Items */}
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.quantity}x ₱{item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          ₱{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-3 border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">₱{subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900">
                        {shipping === 0 ? 'FREE' : `₱${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900">Total</span>
                        <span className="text-lg font-semibold text-primary-600">
                          ₱{total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isProcessing}
                    disabled={isProcessing || !paymentMethod}
                    className="mt-6"
                  >
                    {isProcessing ? 'Processing...' : `Place Order - ₱${total.toFixed(2)}`}
                  </Button>

                  {/* Security Notice */}
                  <div className="mt-6 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Secure & Fresh</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Your payment is secure and your produce will be fresh from our partner farms
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Checkout;
