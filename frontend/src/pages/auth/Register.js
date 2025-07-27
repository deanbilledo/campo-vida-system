import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input, { Textarea } from '../../components/ui/Input';
import toast from 'react-hot-toast';

// Validation schema
const registerSchema = yup.object({
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
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  address: yup
    .string()
    .min(10, 'Please provide a complete address')
    .required('Address is required for delivery'),
  agreeToTerms: yup
    .boolean()
    .oneOf([true], 'You must agree to the terms and conditions'),
});

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, isAuthenticated, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const { confirmPassword, agreeToTerms, ...userData } = data;
      const result = await registerUser(userData);
      if (result.success) {
        toast.success('Registration successful! Welcome to Campo Vida!');
        navigate('/');
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '' };
    
    let strength = 0;
    const checks = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ];
    
    strength = checks.filter(Boolean).length;
    
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    
    return {
      strength,
      label: labels[strength - 1] || '',
      color: colors[strength - 1] || 'bg-gray-300',
      percentage: (strength / 5) * 100,
    };
  };

  const passwordStrength = getPasswordStrength(password);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.05,
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 hero-pattern opacity-40" />
      
      <motion.div
        className="relative sm:mx-auto sm:w-full sm:max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center" variants={itemVariants}>
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CV</span>
            </div>
            <span className="text-2xl font-bold gradient-text">Campo Vida</span>
          </Link>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create your account
          </h2>
          <p className="text-gray-600">
            Join our community and start shopping for fresh organic products
          </p>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          className="mt-8 bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10"
          variants={itemVariants}
        >
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <motion.div variants={itemVariants}>
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                leftIcon={<UserIcon className="w-5 h-5" />}
                error={errors.name?.message}
                {...register('name')}
              />
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants}>
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                leftIcon={<EnvelopeIcon className="w-5 h-5" />}
                error={errors.email?.message}
                {...register('email')}
              />
            </motion.div>

            {/* Phone Number */}
            <motion.div variants={itemVariants}>
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+63 XXX XXX XXXX"
                leftIcon={<PhoneIcon className="w-5 h-5" />}
                error={errors.phone?.message}
                helperText="We'll use this for order updates and delivery coordination"
                {...register('phone')}
              />
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants}>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                leftIcon={<LockClosedIcon className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                }
                error={errors.password?.message}
                {...register('password')}
              />
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Password strength:</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength.strength >= 4 ? 'text-green-600' : 
                      passwordStrength.strength >= 3 ? 'text-blue-600' :
                      passwordStrength.strength >= 2 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.percentage}%` }}
                    />
                  </div>
                </div>
              )}
            </motion.div>

            {/* Confirm Password */}
            <motion.div variants={itemVariants}>
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                leftIcon={<LockClosedIcon className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                }
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
            </motion.div>

            {/* Address */}
            <motion.div variants={itemVariants}>
              <Textarea
                label="Delivery Address"
                placeholder="Enter your complete address including landmarks"
                rows={3}
                error={errors.address?.message}
                helperText="Please provide a detailed address for accurate delivery"
                {...register('address')}
              />
            </motion.div>

            {/* Terms and Conditions */}
            <motion.div variants={itemVariants}>
              <div className="flex items-start space-x-3">
                <input
                  id="agreeToTerms"
                  type="checkbox"
                  className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  {...register('agreeToTerms')}
                />
                <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-500 font-medium">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-500 font-medium">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms.message}</p>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </Button>
            </motion.div>

            {/* Benefits */}
            <motion.div
              className="bg-green-50 border border-green-200 rounded-lg p-4"
              variants={itemVariants}
            >
              <h4 className="text-sm font-medium text-green-800 mb-2">
                What you'll get with your Campo Vida account:
              </h4>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• Access to fresh, organic products from local farms</li>
                <li>• Fast delivery within 24 hours of harvest</li>
                <li>• COD eligibility after 5 successful GCash orders</li>
                <li>• Exclusive discounts and seasonal offers</li>
                <li>• Priority access to workshops and events</li>
              </ul>
            </motion.div>
          </form>

          {/* Sign In Link */}
          <motion.div className="mt-6 text-center" variants={itemVariants}>
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4"
          variants={itemVariants}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-800">Your information is secure</h3>
              <p className="text-xs text-blue-700 mt-1">
                We use industry-standard encryption to protect your personal information and never share your data with third parties.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
