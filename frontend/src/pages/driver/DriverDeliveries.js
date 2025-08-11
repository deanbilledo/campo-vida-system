import React, { useState, useEffect } from 'react';
import {
  TruckIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhoneIcon,
  EyeIcon,
  CalendarDaysIcon,
  UserIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  CameraIcon
} from '@heroicons/react/24/outline';
import apiClient from '../../services/api';
import { formatCurrency, formatDate, formatAddress, formatStatus } from '../../utils/formatters';

const DriverDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    date: new Date().toISOString().split('T')[0],
    status: '',
    search: ''
  });
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showProofModal, setShowProofModal] = useState(false);
  const [proofData, setProofData] = useState({
    photo: null,
    signature: '',
    recipientName: '',
    notes: ''
  });

  useEffect(() => {
    fetchDeliveries();
  }, [filters]);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.date) params.append('date', filters.date);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      
      const response = await apiClient.get(`/api/driver/deliveries?${params.toString()}`);
      setDeliveries(response.data.data);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      setError('Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (orderId, status, proofOfDelivery = null) => {
    try {
      const payload = {
        status,
        timestamp: new Date().toISOString(),
        proofOfDelivery
      };

      await apiClient.put(`/api/driver/deliveries/${orderId}/status`, payload);
      
      // Refresh deliveries
      fetchDeliveries();
      setShowProofModal(false);
      setProofData({ photo: null, signature: '', recipientName: '', notes: '' });
      
      alert(`Delivery status updated to ${formatStatus(status)}`);
    } catch (error) {
      console.error('Error updating delivery status:', error);
      alert('Failed to update delivery status');
    }
  };

  const handleProofSubmission = (orderId) => {
    updateDeliveryStatus(orderId, 'delivered', proofData);
  };

  const handlePhotoCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProofData({ ...proofData, photo: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

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
        return <DocumentTextIcon className="h-4 w-4" />;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading deliveries...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Delivery Management</h1>
              <p className="text-gray-600">Manage your delivery assignments</p>
            </div>
            <TruckIcon className="h-8 w-8 text-primary-600" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Order number or customer name"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({ date: '', status: '', search: '' })}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Deliveries List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Deliveries ({deliveries.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {deliveries.length > 0 ? (
              deliveries.map((delivery) => (
                <div key={delivery._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-gray-900">
                        #{delivery.orderNumber}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                        {getStatusIcon(delivery.status)}
                        <span className="ml-1">{formatStatus(delivery.status)}</span>
                      </span>
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(delivery.summary.totalAmount)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    {/* Customer Info */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Customer</h4>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <UserIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {delivery.customer.firstName} {delivery.customer.lastName}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <PhoneIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {delivery.customer.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Delivery Details</h4>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <CalendarDaysIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {formatDate(delivery.deliveryInfo.preferredDate)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ClockIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {delivery.deliveryInfo.preferredTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Address</h4>
                      <div className="flex items-start space-x-2">
                        <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                        <span className="text-sm text-gray-600">
                          {formatAddress(delivery.deliveryInfo.address)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Items Summary */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Items</h4>
                    <div className="text-sm text-gray-600">
                      {delivery.items.map((item, index) => (
                        <span key={item._id}>
                          {item.quantity}x {item.name}
                          {index < delivery.items.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Payment: {delivery.paymentMethod.method === 'cod' ? 'Cash on Delivery' : 'Online'}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {delivery.status === 'confirmed' && (
                        <button
                          onClick={() => updateDeliveryStatus(delivery._id, 'preparing')}
                          className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                        >
                          Start Preparing
                        </button>
                      )}
                      
                      {delivery.status === 'preparing' && (
                        <button
                          onClick={() => updateDeliveryStatus(delivery._id, 'out_for_delivery')}
                          className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                        >
                          Start Delivery
                        </button>
                      )}
                      
                      {delivery.status === 'out_for_delivery' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedDelivery(delivery);
                              setShowProofModal(true);
                            }}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center space-x-1"
                          >
                            <CameraIcon className="h-4 w-4" />
                            <span>Complete Delivery</span>
                          </button>
                          <button
                            onClick={() => {
                              const notes = prompt('Please provide failure reason:');
                              if (notes) updateDeliveryStatus(delivery._id, 'failed', { notes });
                            }}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                          >
                            Mark Failed
                          </button>
                        </div>
                      )}
                      
                      <button
                        onClick={() => setSelectedDelivery(delivery)}
                        className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 flex items-center space-x-1"
                      >
                        <EyeIcon className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No deliveries found</p>
                <p className="text-gray-400 text-sm">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Proof of Delivery Modal */}
      {showProofModal && selectedDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Complete Delivery - #{selectedDelivery.orderNumber}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={proofData.recipientName}
                  onChange={(e) => setProofData({ ...proofData, recipientName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Who received the order?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo Proof
                </label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoCapture}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {proofData.photo && (
                  <img
                    src={proofData.photo}
                    alt="Proof of delivery"
                    className="mt-2 w-full h-32 object-cover rounded-md"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Notes (Optional)
                </label>
                <textarea
                  value={proofData.notes}
                  onChange={(e) => setProofData({ ...proofData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Any additional notes..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowProofModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleProofSubmission(selectedDelivery._id)}
                disabled={!proofData.recipientName.trim()}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
              >
                Complete Delivery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDeliveries;
