import React, { forwardRef, useState } from 'react';
import { EyeIcon, EyeSlashIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { IconButton } from './Button';

const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  containerClassName = '',
  required = false,
  disabled = false,
  fullWidth = true,
  size = 'md',
  variant = 'default',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const variantClasses = {
    default: 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
    filled: 'bg-gray-50 border-gray-200 focus:bg-white focus:border-primary-500 focus:ring-primary-500',
    outlined: 'border-2 border-gray-300 focus:border-primary-500 focus:ring-0',
  };

  const baseInputClasses = `
    block w-full rounded-lg border bg-white text-gray-900 placeholder-gray-400
    focus:outline-none focus:ring-1 transition-colors duration-200
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon || type === 'password' ? 'pr-10' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 sm:text-sm">
              {leftIcon}
            </span>
          </div>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          type={inputType}
          placeholder={placeholder}
          className={baseInputClasses}
          disabled={disabled}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />

        {/* Right Icon or Password Toggle */}
        {(rightIcon || type === 'password') && (
          <div className="absolute inset-y-0 right-0 flex items-center">
            {type === 'password' ? (
              <IconButton
                type="button"
                variant="ghost"
                size="sm"
                onClick={togglePasswordVisibility}
                className="mr-1 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </IconButton>
            ) : rightIcon ? (
              <div className="pr-3 pointer-events-none">
                <span className="text-gray-400 sm:text-sm">
                  {rightIcon}
                </span>
              </div>
            ) : null}
          </div>
        )}

        {/* Error Icon */}
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
          </div>
        )}
      </div>

      {/* Helper Text or Error Message */}
      {(helperText || error) && (
        <div className="mt-1">
          {error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : (
            <p className="text-sm text-gray-500">{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Textarea Component
export const Textarea = forwardRef(({
  label,
  placeholder,
  error,
  helperText,
  className = '',
  containerClassName = '',
  required = false,
  disabled = false,
  fullWidth = true,
  rows = 4,
  resize = 'vertical',
  ...props
}, ref) => {
  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  };

  const baseTextareaClasses = `
    block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 
    placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500
    transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    ${resizeClasses[resize]}
    ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Textarea */}
      <textarea
        ref={ref}
        placeholder={placeholder}
        rows={rows}
        className={baseTextareaClasses}
        disabled={disabled}
        required={required}
        {...props}
      />

      {/* Helper Text or Error Message */}
      {(helperText || error) && (
        <div className="mt-1">
          {error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : (
            <p className="text-sm text-gray-500">{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

// Select Component
export const Select = forwardRef(({
  label,
  options = [],
  placeholder = 'Select an option...',
  error,
  helperText,
  className = '',
  containerClassName = '',
  required = false,
  disabled = false,
  fullWidth = true,
  ...props
}, ref) => {
  const baseSelectClasses = `
    block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900
    focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500
    transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Select */}
      <select
        ref={ref}
        className={baseSelectClasses}
        disabled={disabled}
        required={required}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Helper Text or Error Message */}
      {(helperText || error) && (
        <div className="mt-1">
          {error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : (
            <p className="text-sm text-gray-500">{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Input;
