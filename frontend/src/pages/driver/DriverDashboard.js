import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TruckIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhoneIcon,
  EyeIcon,
  ChevronRightIcon,
  BanknotesIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

const DriverDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedDate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/driver/dashboard');
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (orderId, status, notes = '') => {
    try {
      await apiClient.put(`/api/driver/deliveries/${orderId}/status`, {
        status,
        notes,
        timestamp: new Date().toISOString()
      });
      
      // Refresh dashboard data
      fetchDashboardData();
      
      // Show success message
      alert(`Order status updated to ${status.replace('_', ' ')}`);
    } catch (error) {
      console.error('Error updating delivery status:', error);
      alert('Failed to update delivery status');
    }
  };

  const startDelivery = async (orderId) => {
    try {
      await apiClient.put(`/api/driver/deliveries/${orderId}/start`);
      fetchDashboardData();
      alert('Delivery started successfully!');
    } catch (error) {
      console.error('Error starting delivery:', error);
      alert('Failed to start delivery');
    }
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
      transition: { duration: 0.6 },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircleIcon className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-red-600">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { currentDeliveries, todayDeliveries, stats } = dashboardData || {};

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-yellow-100 text-yellow-800',
      out_for_delivery: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.confirmed;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <ClockIcon className="h-4 w-4" />;
      case 'preparing':
        return <ChartBarIcon className="h-4 w-4" />;
      case 'out_for_delivery':
        return <TruckIcon className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'failed':
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.firstName}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <TruckIcon className="h-8 w-8 text-primary-600" />
            </div>
          </div>
        </div>
      </div>

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          variants={itemVariants}
        >
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TruckIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Deliveries</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalDeliveries || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.completedDeliveries || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.successRate || 0}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BanknotesIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.totalRevenue || 0)}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Current Deliveries */}
        <motion.div className="mb-8" variants={itemVariants}>
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <TruckIcon className="h-5 w-5 mr-2 text-primary-600" />
                Active Deliveries
              </h2>
            </div>
            <div className="p-6">
              {currentDeliveries && currentDeliveries.length > 0 ? (
                <div className="space-y-4">
                  {currentDeliveries.map((order) => (
                    <div
                      key={order._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold text-gray-900">#{order.orderNumber}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status.replace('_', ' ')}</span>
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatCurrency(order.summary.totalAmount)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Customer</p>
                          <div className="flex items-center space-x-2">
                            <UserIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">
                              {order.customer.firstName} {order.customer.lastName}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <PhoneIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{order.customer.phone}</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Delivery Address</p>
                          <div className="flex items-start space-x-2">
                            <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                            <span className="text-sm text-gray-600">
                              {order.deliveryInfo.address.street}, {order.deliveryInfo.address.city}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <CalendarDaysIcon className="h-4 w-4" />
                          <span>
                            {formatDate(order.deliveryInfo.preferredDate)} at {order.deliveryInfo.preferredTime}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {order.status === 'confirmed' && (
                            <button
                              onClick={() => updateDeliveryStatus(order._id, 'preparing')}
                              className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                            >
                              Start Preparing
                            </button>
                          )}
                          {order.status === 'preparing' && (
                            <button
                              onClick={() => startDelivery(order._id)}
                              className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                            >
                              Start Delivery
                            </button>
                          )}
                          {order.status === 'out_for_delivery' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => updateDeliveryStatus(order._id, 'delivered')}
                                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                              >
                                Mark Delivered
                              </button>
                              <button
                                onClick={() => {
                                  const notes = prompt('Please provide failure reason:');
                                  if (notes) updateDeliveryStatus(order._id, 'failed', notes);
                                }}
                                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                              >
                                Mark Failed
                              </button>
                            </div>
                          )}
                          <button
                            onClick={() => window.location.href = `/driver/deliveries/${order._id}`}
                            className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 flex items-center space-x-1"
                          >
                            <EyeIcon className="h-4 w-4" />
                            <span>View</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No active deliveries at the moment</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Today's Deliveries */}
        <motion.div variants={itemVariants}>
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <CalendarDaysIcon className="h-5 w-5 mr-2 text-primary-600" />
                  Today's Schedule
                </h2>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
            <div className="p-6">
              {todayDeliveries && todayDeliveries.length > 0 ? (
                <div className="space-y-3">
                  {todayDeliveries.map((order) => (
                    <div
                      key={order._id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          order.status === 'delivered' ? 'bg-green-500' :
                          order.status === 'failed' ? 'bg-red-500' :
                          order.status === 'out_for_delivery' ? 'bg-purple-500' :
                          'bg-gray-400'
                        }`} />
                        <div>
                          <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                          <p className="text-sm text-gray-600">
                            {order.customer.firstName} {order.customer.lastName}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {order.deliveryInfo.preferredTime}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatCurrency(order.summary.totalAmount)}
                          </p>
                        </div>
                        <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No deliveries scheduled for this date</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DriverDashboard;
