import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary-600 mb-4">404</div>
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mb-6">
            <span className="text-white text-3xl">🌱</span>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8 max-w-sm mx-auto">
          Oops! The page you're looking for seems to have wandered off like a free-range chicken. 
          Let's get you back to the good stuff!
        </p>

        {/* Action Buttons */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link to="/">
            <Button variant="primary" leftIcon={<HomeIcon className="w-5 h-5" />}>
              Back to Home
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            leftIcon={<ArrowLeftIcon className="w-5 h-5" />}
          >
            Go Back
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/products" className="text-primary-600 hover:text-primary-500">
              Browse Products
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/events" className="text-primary-600 hover:text-primary-500">
              View Events
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/contact" className="text-primary-600 hover:text-primary-500">
              Contact Support
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
