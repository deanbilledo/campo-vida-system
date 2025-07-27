import React from 'react';
import { motion } from 'framer-motion';
import { DotsLoader } from './LoadingSpinner';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-md hover:shadow-lg',
    secondary: 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 focus:ring-secondary-500',
    accent: 'bg-accent-600 text-white hover:bg-accent-700 focus:ring-accent-500 shadow-md hover:shadow-lg',
    outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-md hover:shadow-lg',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 shadow-md hover:shadow-lg',
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs rounded',
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg',
    xl: 'px-8 py-4 text-lg rounded-xl',
  };

  const widthClasses = fullWidth ? 'w-full' : '';

  const isDisabled = disabled || loading;

  const handleClick = (e) => {
    if (!isDisabled && onClick) {
      onClick(e);
    }
  };

  return (
    <motion.button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${widthClasses}
        ${className}
      `}
      type={type}
      disabled={isDisabled}
      onClick={handleClick}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {/* Left Icon */}
      {leftIcon && !loading && (
        <span className="mr-2 -ml-1">
          {leftIcon}
        </span>
      )}

      {/* Loading Spinner */}
      {loading && (
        <span className="mr-2 -ml-1">
          <DotsLoader 
            color={variant === 'outline' || variant === 'ghost' ? 'gray' : 'white'} 
            size="sm" 
          />
        </span>
      )}

      {/* Button Text */}
      <span>{children}</span>

      {/* Right Icon */}
      {rightIcon && !loading && (
        <span className="ml-2 -mr-1">
          {rightIcon}
        </span>
      )}
    </motion.button>
  );
};

// Icon Button Component
export const IconButton = ({
  children,
  variant = 'ghost',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    xs: 'p-1',
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
    xl: 'p-4',
  };

  return (
    <Button
      variant={variant}
      className={`!px-0 !py-0 ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
};

// Button Group Component
export const ButtonGroup = ({ children, className = '', orientation = 'horizontal' }) => {
  const orientationClasses = {
    horizontal: 'flex-row space-x-2',
    vertical: 'flex-col space-y-2',
  };

  return (
    <div className={`flex ${orientationClasses[orientation]} ${className}`}>
      {children}
    </div>
  );
};

// Floating Action Button
export const FloatingActionButton = ({
  children,
  className = '',
  position = 'bottom-right',
  ...props
}) => {
  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6',
  };

  return (
    <motion.div
      className={`${positionClasses[position]} z-50`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <IconButton
        variant="primary"
        size="lg"
        className={`rounded-full shadow-lg hover:shadow-xl ${className}`}
        {...props}
      >
        {children}
      </IconButton>
    </motion.div>
  );
};

export default Button;
