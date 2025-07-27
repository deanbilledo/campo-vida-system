import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  overlay = false,
  text = 'Loading...' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    accent: 'text-accent-600',
    white: 'text-white',
    gray: 'text-gray-600',
  };

  const spinnerElement = (
    <div className="flex flex-col items-center justify-center space-y-2">
      <motion.div
        className={`${sizeClasses[size]} ${colorClasses[color]}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
          <path
            className="opacity-25"
            fill="currentColor"
            d="M12 0a12 12 0 0 1 12 12h-4a8 8 0 0 0-8-8V0z"
          />
        </svg>
      </motion.div>
      
      {text && (
        <motion.p
          className={`text-sm ${colorClasses[color]} font-medium`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {spinnerElement}
      </motion.div>
    );
  }

  return spinnerElement;
};

// Skeleton loader component
export const SkeletonLoader = ({ 
  className = '', 
  rows = 1,
  avatar = false,
  button = false,
}) => {
  const skeletonRows = Array.from({ length: rows }, (_, index) => (
    <div key={index} className="space-y-3">
      {avatar && (
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full skeleton" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded skeleton" />
            <div className="h-3 bg-gray-200 rounded w-3/4 skeleton" />
          </div>
        </div>
      )}
      
      <div className={`h-4 bg-gray-200 rounded skeleton ${className}`} />
      <div className={`h-4 bg-gray-200 rounded w-5/6 skeleton ${className}`} />
      <div className={`h-4 bg-gray-200 rounded w-4/6 skeleton ${className}`} />
      
      {button && (
        <div className="h-10 bg-gray-200 rounded-lg w-32 skeleton" />
      )}
    </div>
  ));

  return <div className="space-y-6">{skeletonRows}</div>;
};

// Dots loader
export const DotsLoader = ({ color = 'primary', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  const colorClasses = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    accent: 'bg-accent-600',
    white: 'bg-white',
    gray: 'bg-gray-600',
  };

  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.1,
          }}
        />
      ))}
    </div>
  );
};

// Pulse loader for content
export const PulseLoader = ({ className = '', children }) => {
  return (
    <motion.div
      className={`animate-pulse ${className}`}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        repeatType: 'reverse',
      }}
    >
      {children}
    </motion.div>
  );
};

export default LoadingSpinner;
