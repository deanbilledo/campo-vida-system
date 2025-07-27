import { useEffect } from 'react';

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  useEffect(() => {
    // Monitor page load performance
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          if (perfData) {
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
            
            // Only log in development
            if (process.env.NODE_ENV === 'development') {
              console.log('🚀 Performance Metrics:', {
                'Page Load Time': `${loadTime.toFixed(2)}ms`,
                'DOM Content Loaded': `${domContentLoaded.toFixed(2)}ms`,
                'Total Load Time': `${(perfData.loadEventEnd - perfData.fetchStart).toFixed(2)}ms`
              });
            }
          }
        }, 0);
      });
    }

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      const logMemoryUsage = () => {
        const memory = performance.memory;
        if (process.env.NODE_ENV === 'development') {
          console.log('💾 Memory Usage:', {
            'Used': `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
            'Total': `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
            'Limit': `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`
          });
        }
      };

      // Log memory usage every 30 seconds in development
      if (process.env.NODE_ENV === 'development') {
        const interval = setInterval(logMemoryUsage, 30000);
        return () => clearInterval(interval);
      }
    }
  }, []);
};

// Service Worker registration
export const registerSW = () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};

// Prefetch critical resources
export const prefetchResources = () => {
  const criticalRoutes = ['/products', '/events', '/about', '/contact'];
  
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      criticalRoutes.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });
    });
  }
};
