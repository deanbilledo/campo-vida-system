import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  CheckIcon,
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';

// Hero Section Component
const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 hero-pattern opacity-40" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20 animate-float" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-accent-200 rounded-full opacity-30 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-secondary-200 rounded-full opacity-25 animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Content */}
          <motion.div className="space-y-8" variants={itemVariants}>
            <div className="space-y-6">
              <motion.div
                className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                variants={itemVariants}
              >
                <span className="w-2 h-2 bg-primary-600 rounded-full mr-2 animate-pulse" />
                100% Organic & Fresh
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
                variants={itemVariants}
              >
                Farm Fresh
                <span className="block gradient-text">Organic Products</span>
                <span className="block text-3xl md:text-4xl lg:text-5xl text-gray-600">
                  Delivered to You
                </span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg"
                variants={itemVariants}
              >
                Discover the finest organic produce from local farmers in Baguio. 
                Fresh, sustainable, and delivered straight to your doorstep.
              </motion.p>
            </div>

            <motion.div className="flex flex-col sm:flex-row gap-4" variants={itemVariants}>
              <Button
                variant="primary"
                size="lg"
                className="group"
                onClick={() => window.location.href = '/products'}
              >
                Shop Now
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/about'}
              >
                Learn More
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex flex-wrap items-center gap-8 pt-8"
              variants={itemVariants}
            >
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="w-6 h-6 text-primary-600" />
                <span className="text-sm font-medium text-gray-700">Certified Organic</span>
              </div>
              <div className="flex items-center space-x-2">
                <TruckIcon className="w-6 h-6 text-primary-600" />
                <span className="text-sm font-medium text-gray-700">Free Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <HeartIcon className="w-6 h-6 text-primary-600" />
                <span className="text-sm font-medium text-gray-700">Local Farmers</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div
            className="relative"
            variants={itemVariants}
          >
            <div className="relative z-10">
              <motion.img
                src="/img/view-1.jpg"
                alt="Campo Vida Organic Farm Views"
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl organic-shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Floating Cards */}
              <motion.div
                className="absolute -top-4 -left-4 bg-white p-4 rounded-xl shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-gray-900">Fresh Today</span>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">5.0</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">500+ Happy Customers</p>
              </motion.div>
            </div>

            {/* Background Decorations */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-8 right-8 w-32 h-32 bg-primary-200 rounded-full opacity-20" />
              <div className="absolute bottom-8 left-8 w-24 h-24 bg-accent-200 rounded-full opacity-30" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Features Section Component
const FeaturesSection = () => {
  const features = [
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: 'Certified Organic',
      description: 'All our products are certified organic, ensuring the highest quality and safety standards.',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: <TruckIcon className="w-8 h-8" />,
      title: 'Fast Delivery',
      description: 'Fresh products delivered to your doorstep within 24 hours of harvest.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: <HeartIcon className="w-8 h-8" />,
      title: 'Supporting Local',
      description: 'We partner with local farmers to bring you the freshest produce while supporting our community.',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Campo Vida?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to bringing you the finest organic products while supporting sustainable farming practices.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="text-center group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.bgColor} ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Featured Products Section Component
const FeaturedProductsSection = () => {
  // This would normally fetch from API
  const featuredProducts = [
    {
      id: 1,
      name: 'Fresh Pineapples',
      price: 85,
      originalPrice: 95,
      image: '/img/pineapple.jpg',
      category: 'Fruits',
      rating: 4.8,
      isNew: true,
    },
    {
      id: 2,
      name: 'Organic Vegetables',
      price: 120,
      originalPrice: 150,
      image: '/img/20250709_153424.jpg',
      category: 'Vegetables',
      rating: 4.9,
      isNew: false,
    },
    {
      id: 3,
      name: 'Fresh Herbs & Greens',
      price: 65,
      originalPrice: 75,
      image: '/img/20250709_153634.jpg',
      category: 'Vegetables',
      rating: 4.7,
      isNew: true,
    },
    {
      id: 4,
      name: 'Farm Fresh Produce',
      price: 150,
      originalPrice: 180,
      image: '/img/20250715_132607.jpg',
      category: 'Mixed',
      rating: 5.0,
      isNew: false,
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Discover our most popular organic products, freshly harvested from local farms.
          </p>
          <Link to="/products">
            <Button variant="outline" size="lg">
              View All Products
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.isNew && (
                  <span className="absolute top-3 left-3 bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    New
                  </span>
                )}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50">
                    <HeartIcon className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-primary-600 font-medium">
                    {product.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{product.rating}</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      ₱{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ₱{product.originalPrice}
                      </span>
                    )}
                  </div>
                  <Button size="sm" variant="primary">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Newsletter Section Component
const NewsletterSection = () => {
  return (
    <section className="py-20 bg-primary-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay Updated with Campo Vida
          </h2>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto mb-8">
            Get the latest updates on fresh arrivals, seasonal produce, and exclusive offers delivered to your inbox.
          </p>
          
          <motion.div
            className="max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-primary-300 focus:outline-none"
                required
              />
              <Button variant="accent" size="lg" type="submit">
                Subscribe
              </Button>
            </form>
            <p className="text-sm text-primary-200 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Main Home Component
const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <FeaturedProductsSection />
      <NewsletterSection />
    </div>
  );
};

export default Home;
