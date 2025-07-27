import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  XMarkIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  TruckIcon,
  TagIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const Cart = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    cartTotal, 
    cartCount,
    calculateShipping 
  } = useCart();
  
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping - discount;

  // Mock promo codes
  const promoCodes = {
    'WELCOME10': { discount: 0.1, minOrder: 500, description: '10% off orders over ₱500' },
    'FRESH20': { discount: 0.2, minOrder: 1000, description: '20% off orders over ₱1000' },
    'ORGANIC15': { discount: 0.15, minOrder: 750, description: '15% off orders over ₱750' },
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    updateQuantity(itemId, newQuantity);
  };

  const handleApplyPromo = async () => {
    setIsApplyingPromo(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const promo = promoCodes[promoCode.toUpperCase()];
    
    if (!promo) {
      toast.error('Invalid promo code');
      setIsApplyingPromo(false);
      return;
    }
    
    if (subtotal < promo.minOrder) {
      toast.error(`Minimum order of ₱${promo.minOrder} required for this promo`);
      setIsApplyingPromo(false);
      return;
    }
    
    const discountAmount = subtotal * promo.discount;
    setDiscount(discountAmount);
    toast.success(`Promo applied! You saved ₱${discountAmount.toFixed(2)}`);
    setIsApplyingPromo(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.3 },
    },
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ShoppingBagIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any organic goodness to your cart yet!
            </p>
            <Link to="/products">
              <Button variant="primary" size="lg">
                Start Shopping
              </Button>
            </Link>
          </motion.div>
        </div>
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
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <motion.div className="lg:col-span-8" variants={itemVariants}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Clear Cart Button */}
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear your cart?')) {
                      clearCart();
                      toast.success('Cart cleared');
                    }
                  }}
                >
                  Clear Cart
                </Button>
              </div>

              {/* Items List */}
              <div className="divide-y divide-gray-200">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      className="p-6"
                      variants={itemVariants}
                      exit="exit"
                      layout
                    >
                      <div className="flex items-center space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600">{item.category}</p>
                          <div className="flex items-center mt-2">
                            <span className="text-lg font-semibold text-primary-600">
                              ₱{item.price.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 ml-2">per {item.unit}</span>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <MinusIcon className="w-4 h-4 text-gray-600" />
                          </button>
                          
                          <span className="text-lg font-medium text-gray-900 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <PlusIcon className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            ₱{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Stock Warning */}
                      {item.stock < 10 && (
                        <div className="mt-3 flex items-center text-amber-600">
                          <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                          <span className="text-sm">Only {item.stock} left in stock</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div className="lg:col-span-4 mt-8 lg:mt-0" variants={itemVariants}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-8">
              {/* Summary Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Promo Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promo Code
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyPromo}
                      loading={isApplyingPromo}
                      disabled={!promoCode.trim() || isApplyingPromo}
                    >
                      Apply
                    </Button>
                  </div>
                  
                  {/* Available Promo Codes */}
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium text-gray-600">Available codes:</p>
                    {Object.entries(promoCodes).map(([code, promo]) => (
                      <div key={code} className="flex items-center justify-between text-xs text-gray-500">
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">{code}</span>
                        <span>{promo.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">₱{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <TruckIcon className="w-4 h-4 mr-1" />
                      Shipping
                    </span>
                    <span className="text-gray-900">
                      {shipping === 0 ? 'FREE' : `₱${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600 flex items-center">
                        <TagIcon className="w-4 h-4 mr-1" />
                        Discount
                      </span>
                      <span className="text-green-600">-₱{discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-semibold text-primary-600">
                        ₱{total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Free Shipping Progress */}
                {shipping > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-blue-800 font-medium">Free shipping at ₱1,500</span>
                      <span className="text-blue-600">
                        ₱{(1500 - subtotal).toFixed(2)} to go
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((subtotal / 1500) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Checkout Button */}
                <Link to="/checkout" className="block">
                  <Button variant="primary" size="lg" fullWidth>
                    Proceed to Checkout
                  </Button>
                </Link>

                {/* Continue Shopping */}
                <Link to="/products">
                  <Button variant="outline" size="lg" fullWidth>
                    Continue Shopping
                  </Button>
                </Link>

                {/* Security Notice */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Secure Checkout</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Your payment information is encrypted and secure
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Cart;
