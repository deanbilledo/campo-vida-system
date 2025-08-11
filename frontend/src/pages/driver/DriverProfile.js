import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  TruckIcon,
  ChartBarIcon,
  StarIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  CogIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../services/api';
import { formatCurrency, formatPercentage, formatDate } from '../../utils/formatters';

const DriverProfile = () => {
  const { user } = useAuth();
  const [driverData, setDriverData] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    fetchDriverData();
  }, [selectedPeriod]);

  const fetchDriverData = async () => {
    try {
      setLoading(true);
      const [profileRes, performanceRes, earningsRes] = await Promise.all([
        apiClient.get('/api/auth/profile'),
        apiClient.get(`/api/driver/performance?period=${selectedPeriod}`),
        apiClient.get(`/api/driver/earnings?period=${selectedPeriod}`)
      ]);

      setDriverData(profileRes.data.data);
      setPerformance(performanceRes.data.data);
      setEarnings(earningsRes.data.data);
      setIsAvailable(profileRes.data.data?.driverProfile?.isAvailable || false);
    } catch (error) {
      console.error('Error fetching driver data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAvailability = async (available) => {
    try {
      await apiClient.put('/api/driver/availability', {
        isAvailable: available,
        location: {
          latitude: 16.4023, // Baguio coordinates as default
          longitude: 120.5960,
          address: 'Baguio City, Philippines'
        }
      });
      
      setIsAvailable(available);
      alert(`You are now ${available ? 'available' : 'unavailable'} for deliveries`);
    } catch (error) {
      console.error('Error updating availability:', error);
      alert('Failed to update availability');
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
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Driver Profile</h1>
              <p className="text-gray-600">Manage your profile and view performance</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Status:</span>
                <button
                  onClick={() => updateAvailability(!isAvailable)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    isAvailable
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}
                >
                  {isAvailable ? 'Available' : 'Unavailable'}
                </button>
              </div>
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
        {/* Profile Information */}
        <motion.div className="bg-white rounded-lg shadow p-6 mb-8" variants={itemVariants}>
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <UserIcon className="h-10 w-10 text-primary-600" />
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-600">Delivery Driver</p>
              
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <PhoneIcon className="h-4 w-4" />
                  <span className="text-sm">{user?.phone || 'No phone number'}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPinIcon className="h-4 w-4" />
                  <span className="text-sm">{user?.address?.city || 'No address'}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <CalendarDaysIcon className="h-4 w-4" />
                  <span className="text-sm">
                    Joined {formatDate(user?.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              <CogIcon className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </motion.div>

        {/* Performance Stats */}
        <motion.div className="mb-8" variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Performance Overview</h2>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TruckIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Deliveries</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {performance?.totalDeliveries || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPercentage(performance?.successRate || 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <StarIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {performance?.averageRating || 0}/5
                  </p>
                  <p className="text-xs text-gray-500">
                    {performance?.totalRatings || 0} ratings
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BanknotesIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(earnings?.commission || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Details */}
          <motion.div className="bg-white rounded-lg shadow p-6" variants={itemVariants}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Performance Details
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Completed Deliveries</span>
                <span className="font-medium text-gray-900">
                  {performance?.deliveredCount || 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Failed Deliveries</span>
                <span className="font-medium text-gray-900">
                  {performance?.failedCount || 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">On-Time Rate</span>
                <span className="font-medium text-gray-900">
                  {formatPercentage(performance?.onTimePercentage || 0)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Revenue Delivered</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(performance?.totalRevenue || 0)}
                </span>
              </div>
            </div>

            {/* Performance Chart Placeholder */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
              <ChartBarIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Performance chart coming soon</p>
            </div>
          </motion.div>

          {/* Earnings Details */}
          <motion.div className="bg-white rounded-lg shadow p-6" variants={itemVariants}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Earnings Breakdown
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Delivery Fees Collected</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(earnings?.totalDeliveryFees || 0)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Commission (10%)</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(earnings?.commission || 0)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">COD Collected</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(earnings?.totalCODCollected || 0)}
                </span>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">Net Earnings</span>
                  <span className="text-lg font-bold text-primary-600">
                    {formatCurrency(earnings?.commission || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payout Info */}
            <div className="mt-6 p-4 bg-primary-50 rounded-lg">
              <h4 className="font-medium text-primary-900 mb-2">Next Payout</h4>
              <p className="text-sm text-primary-700">
                Earnings are paid weekly every Friday. Next payout: {
                  (() => {
                    const now = new Date();
                    const friday = new Date(now);
                    friday.setDate(now.getDate() + (5 - now.getDay()));
                    return formatDate(friday);
                  })()
                }
              </p>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div className="mt-8 bg-white rounded-lg shadow p-6" variants={itemVariants}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => window.location.href = '/driver/deliveries'}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <TruckIcon className="h-6 w-6 text-primary-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">View Deliveries</p>
                <p className="text-sm text-gray-600">Manage your delivery queue</p>
              </div>
            </button>
            
            <button
              onClick={() => updateAvailability(!isAvailable)}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              {isAvailable ? (
                <XCircleIcon className="h-6 w-6 text-red-600" />
              ) : (
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              )}
              <div className="text-left">
                <p className="font-medium text-gray-900">
                  {isAvailable ? 'Go Offline' : 'Go Online'}
                </p>
                <p className="text-sm text-gray-600">
                  {isAvailable ? 'Stop receiving deliveries' : 'Start receiving deliveries'}
                </p>
              </div>
            </button>
            
            <button
              onClick={() => window.location.href = '/driver/dashboard'}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <EyeIcon className="h-6 w-6 text-primary-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Dashboard</p>
                <p className="text-sm text-gray-600">View today's overview</p>
              </div>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DriverProfile;
