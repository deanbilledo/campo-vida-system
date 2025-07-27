import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  KeyIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CameraIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input, { Textarea } from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

// Profile update validation schema
const profileSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .required('Full name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  phone: yup
    .string()
    .matches(/^(\+63|0)[0-9]{10}$/, 'Please enter a valid Philippine phone number')
    .required('Phone number is required'),
  address: yup
    .string()
    .min(10, 'Please provide a complete address')
    .required('Address is required for delivery'),
});

// Password change validation schema
const passwordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your new password'),
});

const Profile = () => {
  const { user, updateProfile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  // Profile form
  const profileForm = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    },
  });

  // Password form
  const passwordForm = useForm({
    resolver: yupResolver(passwordSchema),
  });

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      });
    }
  }, [user, profileForm]);

  const onProfileSubmit = async (data) => {
    setIsUpdating(true);
    try {
      const result = await updateProfile(data);
      if (result.success) {
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setIsChangingPassword(true);
    try {
      // API call to change password
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      if (response.ok) {
        toast.success('Password changed successfully!');
        passwordForm.reset();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to change password');
      }
    } catch (error) {
      toast.error('Failed to change password. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Mock COD eligibility data (would come from API)
  const codStatus = {
    isEligible: user?.successfulGCashOrders >= 5,
    successfulOrders: user?.successfulGCashOrders || 0,
    requiredOrders: 5,
  };

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: UserIcon },
    { id: 'security', label: 'Security', icon: KeyIcon },
    { id: 'payment', label: 'Payment & COD', icon: CreditCardIcon },
    { id: 'orders', label: 'Order History', icon: ClockIcon },
  ];

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="mb-8" variants={itemVariants}>
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-2">Manage your profile and preferences</p>
        </motion.div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar */}
          <motion.div className="lg:col-span-1" variants={itemVariants}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Profile Summary */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl font-bold mb-3">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      user?.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <button
                    onClick={() => document.getElementById('profileImageInput').click()}
                    className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md border border-gray-200 hover:bg-gray-50"
                  >
                    <CameraIcon className="w-4 h-4 text-gray-600" />
                  </button>
                  <input
                    id="profileImageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <h3 className="font-semibold text-gray-900">{user?.name}</h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-700 border border-primary-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div className="lg:col-span-3 mt-8 lg:mt-0" variants={itemVariants}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <AnimatePresence mode="wait">
                {/* Profile Information Tab */}
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Profile Information
                    </h2>
                    
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="Full Name"
                          type="text"
                          leftIcon={<UserIcon className="w-5 h-5" />}
                          error={profileForm.formState.errors.name?.message}
                          {...profileForm.register('name')}
                        />
                        
                        <Input
                          label="Email Address"
                          type="email"
                          leftIcon={<EnvelopeIcon className="w-5 h-5" />}
                          error={profileForm.formState.errors.email?.message}
                          {...profileForm.register('email')}
                        />
                      </div>

                      <Input
                        label="Phone Number"
                        type="tel"
                        leftIcon={<PhoneIcon className="w-5 h-5" />}
                        error={profileForm.formState.errors.phone?.message}
                        {...profileForm.register('phone')}
                      />

                      <Textarea
                        label="Delivery Address"
                        rows={3}
                        error={profileForm.formState.errors.address?.message}
                        helperText="Please provide a complete address including landmarks"
                        {...profileForm.register('address')}
                      />

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          variant="primary"
                          loading={isUpdating}
                          disabled={isUpdating}
                        >
                          {isUpdating ? 'Updating...' : 'Update Profile'}
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Security Settings
                    </h2>

                    <div className="space-y-8">
                      {/* Account Security Status */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <ShieldCheckIcon className="w-6 h-6 text-green-600" />
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-green-800">
                              Account Security
                            </h3>
                            <p className="text-sm text-green-700 mt-1">
                              Your account is secured with strong encryption
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Change Password Form */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          Change Password
                        </h3>
                        
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                          <Input
                            label="Current Password"
                            type="password"
                            leftIcon={<KeyIcon className="w-5 h-5" />}
                            error={passwordForm.formState.errors.currentPassword?.message}
                            {...passwordForm.register('currentPassword')}
                          />

                          <Input
                            label="New Password"
                            type="password"
                            leftIcon={<KeyIcon className="w-5 h-5" />}
                            error={passwordForm.formState.errors.newPassword?.message}
                            {...passwordForm.register('newPassword')}
                          />

                          <Input
                            label="Confirm New Password"
                            type="password"
                            leftIcon={<KeyIcon className="w-5 h-5" />}
                            error={passwordForm.formState.errors.confirmPassword?.message}
                            {...passwordForm.register('confirmPassword')}
                          />

                          <div className="flex justify-end">
                            <Button
                              type="submit"
                              variant="primary"
                              loading={isChangingPassword}
                              disabled={isChangingPassword}
                            >
                              {isChangingPassword ? 'Changing...' : 'Change Password'}
                            </Button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Payment & COD Tab */}
                {activeTab === 'payment' && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Payment Methods & COD Eligibility
                    </h2>

                    <div className="space-y-6">
                      {/* COD Status */}
                      <div className={`border rounded-lg p-6 ${
                        codStatus.isEligible 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-yellow-50 border-yellow-200'
                      }`}>
                        <div className="flex items-start">
                          {codStatus.isEligible ? (
                            <CheckCircleIcon className="w-6 h-6 text-green-600 mt-0.5" />
                          ) : (
                            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 mt-0.5" />
                          )}
                          <div className="ml-3 flex-1">
                            <h3 className={`text-lg font-medium ${
                              codStatus.isEligible ? 'text-green-800' : 'text-yellow-800'
                            }`}>
                              Cash on Delivery (COD) Status
                            </h3>
                            
                            {codStatus.isEligible ? (
                              <p className="text-green-700 mt-1">
                                🎉 Congratulations! You're eligible for Cash on Delivery orders.
                              </p>
                            ) : (
                              <div className="text-yellow-700 mt-1">
                                <p>You need {codStatus.requiredOrders - codStatus.successfulOrders} more successful GCash orders to unlock COD.</p>
                                <div className="mt-3">
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Progress to COD eligibility</span>
                                    <span>{codStatus.successfulOrders}/{codStatus.requiredOrders}</span>
                                  </div>
                                  <div className="w-full bg-yellow-200 rounded-full h-2">
                                    <div
                                      className="bg-yellow-600 h-2 rounded-full transition-all"
                                      style={{ width: `${(codStatus.successfulOrders / codStatus.requiredOrders) * 100}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Payment Methods */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          Available Payment Methods
                        </h3>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 font-bold text-sm">G</span>
                              </div>
                              <div className="ml-3">
                                <p className="font-medium text-gray-900">GCash</p>
                                <p className="text-sm text-gray-600">Digital wallet payment</p>
                              </div>
                            </div>
                            <div className="text-green-600">
                              <CheckCircleIcon className="w-5 h-5" />
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-green-600 font-bold text-sm">₱</span>
                              </div>
                              <div className="ml-3">
                                <p className="font-medium text-gray-900">Cash on Delivery</p>
                                <p className="text-sm text-gray-600">
                                  {codStatus.isEligible ? 'Available' : 'Requires 5 successful GCash orders'}
                                </p>
                              </div>
                            </div>
                            <div className={codStatus.isEligible ? 'text-green-600' : 'text-gray-400'}>
                              <CheckCircleIcon className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Order History Tab */}
                {activeTab === 'orders' && (
                  <motion.div
                    key="orders"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Order History
                    </h2>

                    <div className="text-center py-12">
                      <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-6">
                        Start shopping to see your order history here
                      </p>
                      <Button variant="primary" onClick={() => window.location.href = '/products'}>
                        Browse Products
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
