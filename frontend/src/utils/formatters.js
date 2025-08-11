// Utility functions for formatting data

export const formatCurrency = (amount, currency = 'PHP') => {
  if (amount === null || amount === undefined) return `${currency} 0.00`;
  
  const num = Number(amount);
  if (isNaN(num)) return `${currency} 0.00`;
  
  return `${currency} ${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  return dateObj.toLocaleDateString('en-US', defaultOptions);
};

export const formatTime = (time) => {
  if (!time) return '';
  
  // Handle both date objects and time strings
  if (time instanceof Date) {
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
  
  // Handle time strings like "14:30" or "2:30 PM"
  if (typeof time === 'string') {
    // If it's already formatted, return as is
    if (time.includes('AM') || time.includes('PM')) {
      return time;
    }
    
    // If it's in 24-hour format, convert it
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10) || 0;
    
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
  
  return time;
};

export const formatDateTime = (date, includeSeconds = false) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  const dateStr = formatDate(dateObj);
  const timeOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  
  if (includeSeconds) {
    timeOptions.second = '2-digit';
  }
  
  const timeStr = dateObj.toLocaleTimeString('en-US', timeOptions);
  
  return `${dateStr} at ${timeStr}`;
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count > 0) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
  }
  
  return 'just now';
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format for Philippine numbers
  if (cleaned.startsWith('63')) {
    // International format
    const withoutCountryCode = cleaned.substring(2);
    if (withoutCountryCode.length === 10) {
      return `+63 ${withoutCountryCode.substring(0, 3)} ${withoutCountryCode.substring(3, 6)} ${withoutCountryCode.substring(6)}`;
    }
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    // Local format
    return `${cleaned.substring(0, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}`;
  } else if (cleaned.length === 10) {
    // Without leading 0
    return `0${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
  }
  
  return phone; // Return original if can't format
};

export const formatOrderNumber = (orderNumber) => {
  if (!orderNumber) return '';
  
  // If it's already formatted with #, return as is
  if (orderNumber.startsWith('#')) {
    return orderNumber;
  }
  
  // Otherwise, add the # prefix
  return `#${orderNumber}`;
};

export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';
  
  const num = Number(value);
  if (isNaN(num)) return '0%';
  
  return `${num.toFixed(decimals)}%`;
};

export const formatAddress = (address) => {
  if (!address) return '';
  
  const parts = [];
  
  if (address.street) parts.push(address.street);
  if (address.barangay) parts.push(address.barangay);
  if (address.city) parts.push(address.city);
  if (address.province) parts.push(address.province);
  if (address.zipCode) parts.push(address.zipCode);
  
  return parts.join(', ');
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + '...';
};

export const capitalizeWords = (str) => {
  if (!str) return '';
  
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

export const formatStatus = (status) => {
  if (!status) return '';
  
  return status
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
