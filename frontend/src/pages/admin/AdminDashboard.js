import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StatsCard, Card, LoadingSpinner, DataTable, Badge } from '../../components/ui/Components';
import apiClient from '../../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, ordersResponse] = await Promise.all([
        apiClient.get('/api/admin/dashboard'),
        apiClient.get('/api/admin/orders?page=1&limit=5')
      ]);

      setStats(statsResponse.data.data);
      setRecentOrders(ordersResponse.data.data.orders || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const orderTableHeaders = ['Order ID', 'Customer', 'Total', 'Status', 'Date'];
  const orderTableData = recentOrders.map(order => ({
    id: order._id,
    orderId: `#${order._id.slice(-6)}`,
    customer: `${order.customer?.firstName} ${order.customer?.lastName}`,
    total: formatCurrency(order.summary?.totalAmount || 0),
    status: getStatusBadge(order.status),
    date: new Date(order.createdAt).toLocaleDateString()
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening at Campo Vida today.</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatsCard
            title="Today's Orders"
            value={stats?.today?.orders || 0}
            change={`+${stats?.today?.orders || 0} today`}
            trend="up"
            icon="📦"
          />
          <StatsCard
            title="Today's Revenue"
            value={formatCurrency(stats?.today?.revenue || 0)}
            change={`+${formatCurrency(stats?.today?.revenue || 0)} today`}
            trend="up"
            icon="💰"
          />
          <StatsCard
            title="Weekly Orders"
            value={stats?.week?.orders || 0}
            change={`${stats?.week?.orders || 0} this week`}
            trend="up"
            icon="📈"
          />
          <StatsCard
            title="Total Customers"
            value={stats?.general?.totalCustomers || 0}
            change={`${stats?.general?.totalCustomers || 0} registered`}
            trend="neutral"
            icon="👥"
          />
        </motion.div>

        {/* Charts and Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Chart Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h3>
              <div className="h-64 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <p className="text-gray-600">Sales chart coming soon</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Products</span>
                  <span className="font-semibold">{stats?.general?.totalProducts || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending Orders</span>
                  <span className="font-semibold text-orange-600">{stats?.today?.pendingOrders || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">This Month Revenue</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(stats?.month?.revenue || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Low Stock Products</span>
                  <span className="font-semibold text-red-600">{stats?.general?.lowStockProducts || 0}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <motion.a
                href="/admin/orders"
                className="text-green-600 hover:text-green-700 font-medium"
                whileHover={{ scale: 1.05 }}
              >
                View all →
              </motion.a>
            </div>
            <DataTable
              headers={orderTableHeaders}
              data={orderTableData}
              onRowClick={(order) => window.location.href = `/admin/orders`}
            />
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.a
                href="/admin/products"
                className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-2xl mr-3">🛍️</div>
                <div>
                  <p className="font-medium text-gray-900">Manage Products</p>
                  <p className="text-sm text-gray-600">Add, edit or remove products</p>
                </div>
              </motion.a>
              
              <motion.a
                href="/admin/orders"
                className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-2xl mr-3">📦</div>
                <div>
                  <p className="font-medium text-gray-900">Process Orders</p>
                  <p className="text-sm text-gray-600">View and manage orders</p>
                </div>
              </motion.a>
              
              <motion.a
                href="/admin/events"
                className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-2xl mr-3">🎉</div>
                <div>
                  <p className="font-medium text-gray-900">Manage Events</p>
                  <p className="text-sm text-gray-600">Create and manage events</p>
                </div>
              </motion.a>

              <motion.a
                href="/admin/posts"
                className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-2xl mr-3">📝</div>
                <div>
                  <p className="font-medium text-gray-900">Manage Posts</p>
                  <p className="text-sm text-gray-600">Create and publish blog posts</p>
                </div>
              </motion.a>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
