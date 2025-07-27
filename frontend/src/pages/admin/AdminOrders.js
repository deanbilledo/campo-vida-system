import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Button, 
  Card, 
  LoadingSpinner, 
  DataTable, 
  Modal, 
  Select,
  Badge 
} from '../../components/ui/Components';
import apiClient from '../../services/api';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [submitting, setSubmitting] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const nextStatusMap = {
    pending: 'confirmed',
    confirmed: 'preparing',
    preparing: 'out_for_delivery',
    out_for_delivery: 'delivered'
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await apiClient.get('/api/admin/orders', { params });
      setOrders(response.data.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setSubmitting(true);
    try {
      await apiClient.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated successfully!');
      fetchOrders();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      confirmed: 'info',
      preparing: 'info',
      out_for_delivery: 'info',
      delivered: 'success',
      cancelled: 'danger'
    };
    return <Badge variant={variants[status] || 'default'}>{status.replace('_', ' ')}</Badge>;
  };

  const getPaymentMethodBadge = (method) => {
    const variants = {
      gcash: 'success',
      cod: 'warning'
    };
    return <Badge variant={variants[method] || 'default'}>{method.toUpperCase()}</Badge>;
  };

  const tableHeaders = ['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date'];
  const tableData = orders.map(order => ({
    id: order._id,
    orderId: `#${order._id.slice(-6)}`,
    customer: (
      <div>
        <p className="font-medium">{order.customer?.firstName} {order.customer?.lastName}</p>
        <p className="text-sm text-gray-500">{order.customer?.email}</p>
      </div>
    ),
    items: (
      <div>
        <p className="font-medium">{order.items?.length || 0} items</p>
        <p className="text-sm text-gray-500">
          {order.items?.slice(0, 2).map(item => item.product?.name).join(', ')}
          {order.items?.length > 2 && '...'}
        </p>
      </div>
    ),
    total: formatCurrency(order.summary?.totalAmount || 0),
    payment: getPaymentMethodBadge(order.payment?.method || 'cod'),
    status: getStatusBadge(order.status),
    date: new Date(order.createdAt).toLocaleDateString()
  }));

  const tableActions = (order) => [
    <Button
      key="view"
      size="sm"
      variant="outline"
      onClick={(e) => {
        e.stopPropagation();
        const fullOrder = orders.find(o => o._id === order.id);
        setSelectedOrder(fullOrder);
        setIsModalOpen(true);
      }}
    >
      👁️ View
    </Button>,
    nextStatusMap[orders.find(o => o._id === order.id)?.status] && (
      <Button
        key="update"
        size="sm"
        variant="primary"
        onClick={(e) => {
          e.stopPropagation();
          const fullOrder = orders.find(o => o._id === order.id);
          const nextStatus = nextStatusMap[fullOrder.status];
          if (nextStatus) {
            handleStatusUpdate(order.id, nextStatus);
          }
        }}
      >
        ⏩ {nextStatusMap[orders.find(o => o._id === order.id)?.status]?.replace('_', ' ')}
      </Button>
    )
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Management</h1>
            <p className="text-gray-600">Track and manage customer orders</p>
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusOptions}
            className="w-48"
          />
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-blue-600 text-xl">📦</span>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-orange-600">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <span className="text-orange-600 text-xl">⏳</span>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-3xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-green-600 text-xl">✅</span>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(orders.reduce((sum, order) => sum + (order.summary?.totalAmount || 0), 0))}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-purple-600 text-xl">💰</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DataTable
            headers={tableHeaders}
            data={tableData}
            loading={loading}
            actions={tableActions}
          />
        </motion.div>

        {/* Order Detail Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOrder(null);
          }}
          title={`Order #${selectedOrder?._id.slice(-6)}`}
          size="xl"
        >
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.customer?.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedOrder.customer?.phone}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Order Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Status:</span> {getStatusBadge(selectedOrder.status)}</p>
                    <p><span className="font-medium">Payment:</span> {getPaymentMethodBadge(selectedOrder.payment?.method)}</p>
                    <p><span className="font-medium">Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Delivery Address</h4>
                <div className="bg-gray-50 p-4 rounded-lg text-sm">
                  <p>{selectedOrder.delivery?.address?.street}</p>
                  <p>{selectedOrder.delivery?.address?.barangay}, {selectedOrder.delivery?.address?.city}</p>
                  <p>{selectedOrder.delivery?.address?.province} {selectedOrder.delivery?.address?.zipCode}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Items Ordered</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.items?.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">
                            {item.product?.name || 'Unknown Product'}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500 text-center">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500 text-right">
                            {formatCurrency(item.price)}
                          </td>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                            {formatCurrency(item.quantity * item.price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan="3" className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                          Total:
                        </td>
                        <td className="px-4 py-2 text-sm font-bold text-gray-900 text-right">
                          {formatCurrency(selectedOrder.summary?.totalAmount || 0)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Status Update */}
              <div className="flex justify-between items-center pt-6 border-t">
                <div>
                  <p className="text-sm text-gray-600">Current Status: {getStatusBadge(selectedOrder.status)}</p>
                </div>
                <div className="flex space-x-4">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedOrder(null);
                    }}
                  >
                    Close
                  </Button>
                  {nextStatusMap[selectedOrder.status] && (
                    <Button
                      loading={submitting}
                      onClick={() => handleStatusUpdate(selectedOrder._id, nextStatusMap[selectedOrder.status])}
                    >
                      Mark as {nextStatusMap[selectedOrder.status].replace('_', ' ')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default AdminOrders;
