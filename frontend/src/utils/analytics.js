// Analytics and tracking utilities
export class Analytics {
  static isProduction = process.env.NODE_ENV === 'production';
  
  // Initialize analytics
  static init() {
    if (!this.isProduction) {
      console.log('📊 Analytics initialized in development mode');
      return;
    }

    // Google Analytics 4 (replace with your measurement ID)
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', 'GA_MEASUREMENT_ID');
  }

  // Track page views
  static trackPageView(pagePath, pageTitle) {
    if (!this.isProduction) {
      console.log('📄 Page view:', { pagePath, pageTitle });
      return;
    }

    if (window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: pagePath,
        page_title: pageTitle,
      });
    }
  }

  // Track events
  static trackEvent(action, category = 'engagement', label = '', value = 0) {
    if (!this.isProduction) {
      console.log('🎯 Event:', { action, category, label, value });
      return;
    }

    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  }

  // E-commerce tracking
  static trackPurchase(transactionId, items, value, currency = 'PHP') {
    if (!this.isProduction) {
      console.log('🛒 Purchase:', { transactionId, items, value, currency });
      return;
    }

    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: transactionId,
        value: value,
        currency: currency,
        items: items,
      });
    }
  }

  // Track add to cart
  static trackAddToCart(item) {
    this.trackEvent('add_to_cart', 'ecommerce', item.name, item.price);
    
    if (!this.isProduction) return;

    if (window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'PHP',
        value: item.price,
        items: [item],
      });
    }
  }

  // Track remove from cart
  static trackRemoveFromCart(item) {
    this.trackEvent('remove_from_cart', 'ecommerce', item.name, item.price);
    
    if (!this.isProduction) return;

    if (window.gtag) {
      window.gtag('event', 'remove_from_cart', {
        currency: 'PHP',
        value: item.price,
        items: [item],
      });
    }
  }

  // Track user engagement
  static trackUserEngagement(action, element = '') {
    this.trackEvent(action, 'user_engagement', element);
  }

  // Track search
  static trackSearch(searchTerm, resultCount = 0) {
    this.trackEvent('search', 'site_search', searchTerm, resultCount);
  }

  // Track form submissions
  static trackFormSubmission(formName, success = true) {
    this.trackEvent('form_submit', 'forms', formName, success ? 1 : 0);
  }

  // Track scroll depth
  static trackScrollDepth(percentage) {
    this.trackEvent('scroll', 'user_engagement', `${percentage}%`, percentage);
  }

  // Track file downloads
  static trackDownload(fileName, fileType) {
    this.trackEvent('file_download', 'downloads', `${fileName}.${fileType}`);
  }

  // Track external link clicks
  static trackExternalLink(url) {
    this.trackEvent('click', 'external_links', url);
  }

  // Track errors
  static trackError(errorMessage, errorSource = 'javascript') {
    this.trackEvent('exception', 'errors', errorMessage);
    
    if (!this.isProduction) return;

    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: errorMessage,
        fatal: false,
      });
    }
  }
}

// Performance tracking
export class PerformanceTracker {
  static trackWebVitals() {
    if (!Analytics.isProduction) return;

    // Track Core Web Vitals
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS((metric) => {
        Analytics.trackEvent('web_vitals', 'performance', 'CLS', Math.round(metric.value * 1000));
      });

      getFID((metric) => {
        Analytics.trackEvent('web_vitals', 'performance', 'FID', Math.round(metric.value));
      });

      getFCP((metric) => {
        Analytics.trackEvent('web_vitals', 'performance', 'FCP', Math.round(metric.value));
      });

      getLCP((metric) => {
        Analytics.trackEvent('web_vitals', 'performance', 'LCP', Math.round(metric.value));
      });

      getTTFB((metric) => {
        Analytics.trackEvent('web_vitals', 'performance', 'TTFB', Math.round(metric.value));
      });
    });
  }
}

export default Analytics;
