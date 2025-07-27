import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Button, 
  Card, 
  LoadingSpinner, 
  DataTable, 
  Modal, 
  Input,
  Badge 
} from '../../components/ui/Components';
import apiClient from '../../services/api';
import toast from 'react-hot-toast';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await apiClient.get('/api/admin/customers');
      setCustomers(response.data.data.customers || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const getStatusBadge = (isActive) => {
    return isActive ? 
      <Badge variant="success">Active</Badge> : 
      <Badge variant="danger">Inactive</Badge>;
  };

  const getCODBadge = (codEligible) => {
    return codEligible ? 
      <Badge variant="success">Eligible</Badge> : 
      <Badge variant="warning">Not Eligible</Badge>;
  };

  const getRoleBadge = (role) => {
    const variants = {
      customer: 'default',
      admin: 'danger',
      driver: 'info'
    };
    return <Badge variant={variants[role] || 'default'}>{role}</Badge>;
  };

  const tableHeaders = ['Customer', 'Contact', 'Role', 'Orders', 'COD Status', 'Status', 'Joined'];
  const tableData = filteredCustomers.map(customer => ({
    id: customer._id,
    customer: (
      <div className="flex items-center">
        <div className="w-10 h-10 bg-green-100 rounded-full mr-3 flex items-center justify-center">
          <span className="text-green-600 font-semibold">
            {customer.firstName?.charAt(0)}{customer.lastName?.charAt(0)}
          </span>
        </div>
        <div>
          <p className="font-medium text-gray-900">{customer.firstName} {customer.lastName}</p>
          <p className="text-sm text-gray-500">{customer.email}</p>
        </div>
      </div>
    ),
    contact: (
      <div>
        <p className="text-sm">{customer.phone}</p>
        <p className="text-sm text-gray-500">
          {customer.address?.city}, {customer.address?.province}
        </p>
      </div>
    ),
    role: getRoleBadge(customer.role),
    orders: (
      <div className="text-center">
        <p className="font-medium">{customer.totalOrders || 0}</p>
        <p className="text-sm text-gray-500">GCash: {customer.successfulGCashOrders || 0}</p>
      </div>
    ),
    codStatus: getCODBadge(customer.codEligible),
    status: getStatusBadge(customer.isActive),
    joined: new Date(customer.createdAt).toLocaleDateString()
  }));

  const tableActions = (customer) => [
    <Button
      key="view"
      size="sm"
      variant="outline"
      onClick={(e) => {
        e.stopPropagation();
        const fullCustomer = customers.find(c => c._id === customer.id);
        setSelectedCustomer(fullCustomer);
        setIsModalOpen(true);
      }}
    >
      👁️ View
    </Button>
  ];

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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Customer Management</h1>
            <p className="text-gray-600">View and manage customer accounts</p>
          </div>
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
            icon="🔍"
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
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-3xl font-bold text-gray-900">{customers.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-blue-600 text-xl">👥</span>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-3xl font-bold text-green-600">
                  {customers.filter(c => c.isActive).length}
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
                <p className="text-sm font-medium text-gray-600">COD Eligible</p>
                <p className="text-3xl font-bold text-purple-600">
                  {customers.filter(c => c.codEligible).length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-purple-600 text-xl">💳</span>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-3xl font-bold text-orange-600">
                  {customers.filter(c => {
                    const customerDate = new Date(c.createdAt);
                    const now = new Date();
                    return customerDate.getMonth() === now.getMonth() && customerDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <span className="text-orange-600 text-xl">📅</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Customers Table */}
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

        {/* Customer Detail Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCustomer(null);
          }}
          title={`${selectedCustomer?.firstName} ${selectedCustomer?.lastName}`}
          size="lg"
        >
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedCustomer.firstName} {selectedCustomer.lastName}</p>
                    <p><span className="font-medium">Email:</span> {selectedCustomer.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedCustomer.phone}</p>
                    <p><span className="font-medium">Role:</span> {getRoleBadge(selectedCustomer.role)}</p>
                    <p><span className="font-medium">Status:</span> {getStatusBadge(selectedCustomer.isActive)}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Account Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Joined:</span> {new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
                    <p><span className="font-medium">Email Verified:</span> {selectedCustomer.isEmailVerified ? '✅' : '❌'}</p>
                    <p><span className="font-medium">COD Eligible:</span> {getCODBadge(selectedCustomer.codEligible)}</p>
                    <p><span className="font-medium">GCash Orders:</span> {selectedCustomer.successfulGCashOrders || 0}</p>
                    <p><span className="font-medium">Total Orders:</span> {selectedCustomer.totalOrders || 0}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Address</h4>
                <div className="bg-gray-50 p-4 rounded-lg text-sm">
                  <p>{selectedCustomer.address?.street}</p>
                  <p>{selectedCustomer.address?.barangay}</p>
                  <p>{selectedCustomer.address?.city}, {selectedCustomer.address?.province}</p>
                  <p>{selectedCustomer.address?.zipCode}</p>
                </div>
              </div>

              {/* Preferences */}
              {selectedCustomer.preferences && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Preferences</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium mb-1">Notifications:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>Email: {selectedCustomer.preferences.notifications?.email ? '✅' : '❌'}</li>
                        <li>SMS: {selectedCustomer.preferences.notifications?.sms ? '✅' : '❌'}</li>
                        <li>Order Updates: {selectedCustomer.preferences.notifications?.orderUpdates ? '✅' : '❌'}</li>
                        <li>Promotions: {selectedCustomer.preferences.notifications?.promotions ? '✅' : '❌'}</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Delivery:</p>
                      <p className="text-gray-600 capitalize">{selectedCustomer.preferences.deliveryPreference}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end pt-6 border-t">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedCustomer(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default AdminCustomers;
