import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  CalendarIcon,
  MapPinIcon,
  CreditCardIcon,
  ShoppingBagIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrder();
    }
  }, [id, isAuthenticated]); // fetchOrder is stable, no need to include

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/orders/${id}`);
      
      if (response.data.success) {
        setOrder(response.data.data);
      } else {
        throw new Error('Order not found');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-6 h-6 text-yellow-500" />;
      case 'confirmed':
      case 'processing':
        return <ClockIcon className="w-6 h-6 text-blue-500" />;
      case 'shipped':
        return <TruckIcon className="w-6 h-6 text-blue-600" />;
      case 'delivered':
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      case 'cancelled':
        return <XCircleIcon className="w-6 h-6 text-red-500" />;
      default:
        return <ClockIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const getOrderProgress = (status) => {
    const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(status);
    return statuses.map((s, index) => ({
      status: s,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Please Login</h1>
            <p className="text-gray-600 mt-2">You need to be logged in to view order details</p>
            <Link to="/login" className="mt-4 inline-block">
              <Button>Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Order Not Found</h1>
            <p className="text-gray-600 mt-2">The order you're looking for doesn't exist</p>
            <Link to="/orders" className="mt-4 inline-block">
              <Button>Back to Orders</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/orders" className="inline-flex items-center text-primary-600 hover:text-primary-500 mb-4">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order #{order.orderNumber || order._id.slice(-8)}
              </h1>
              <div className="flex items-center text-gray-500 mt-2">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Placed on {formatDate(order.createdAt)}
              </div>
            </div>
            
            <div className={`flex items-center px-4 py-2 rounded-full border ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span className="ml-2 font-medium capitalize">{order.status}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Progress */}
            {order.status !== 'cancelled' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Progress</h2>
                <div className="flex items-center justify-between">
                  {getOrderProgress(order.status).map((step, index) => (
                    <div key={step.status} className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        step.completed 
                          ? 'bg-primary-500 border-primary-500 text-white' 
                          : 'bg-gray-100 border-gray-300 text-gray-400'
                      }`}>
                        {step.completed ? (
                          <CheckCircleIcon className="w-6 h-6" />
                        ) : (
                          <ClockIcon className="w-6 h-6" />
                        )}
                      </div>
                      <span className={`text-sm mt-2 capitalize ${
                        step.completed ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.status}
                      </span>
                      {index < getOrderProgress(order.status).length - 1 && (
                        <div className={`absolute w-full h-0.5 top-5 left-1/2 ${
                          step.completed ? 'bg-primary-500' : 'bg-gray-300'
                        }`} style={{zIndex: -1}} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ShoppingBagIcon className="w-5 h-5 mr-2" />
                  Order Items ({order.items?.length || 0})
                </h2>
              </div>
              
              <div className="p-6">
                {order.items?.map((item, index) => (
                  <div key={index} className={`flex items-center py-4 ${
                    index < order.items.length - 1 ? 'border-b border-gray-200' : ''
                  }`}>
                    <img
                      src={item.image || '/img/placeholder.jpg'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/img/placeholder.jpg';
                      }}
                    />
                    <div className="flex-1 ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-gray-600">Unit Price: {formatCurrency(item.price)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatCurrency(order.totalAmount - (order.shippingFee || 0))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">{formatCurrency(order.shippingFee || 0)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPinIcon className="w-5 h-5 mr-2" />
                Shipping Address
              </h2>
              {order.shippingAddress ? (
                <div className="text-gray-600">
                  <p className="font-medium">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  <p>{order.shippingAddress.zipCode}</p>
                  {order.shippingAddress.phone && (
                    <p className="flex items-center mt-2">
                      <PhoneIcon className="w-4 h-4 mr-2" />
                      {order.shippingAddress.phone}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No shipping address provided</p>
              )}
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCardIcon className="w-5 h-5 mr-2" />
                Payment Information
              </h2>
              <div className="text-gray-600">
                <p><strong>Method:</strong> {order.paymentMethod || 'Cash on Delivery'}</p>
                <p><strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    order.paymentStatus === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.paymentStatus || 'Pending'}
                  </span>
                </p>
              </div>
            </div>

            {/* Actions */}
            {order.status === 'pending' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    // TODO: Implement order cancellation
                    toast.error('Order cancellation coming soon');
                  }}
                >
                  Cancel Order
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
