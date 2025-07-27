import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  HeartIcon,
  StarIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import Button, { IconButton } from '../components/ui/Button';
import Input, { Select } from '../components/ui/Input';
import { useCart } from '../context/CartContext';
import LoadingSpinner, { SkeletonLoader } from '../components/ui/LoadingSpinner';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useCart();
  
  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name');
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Mock data - replace with API call
  const mockProducts = [
    {
      _id: '1',
      name: 'Fresh Pineapples',
      price: 85,
      originalPrice: 95,
      images: ['/img/pineapple.jpg'],
      category: 'fruits',
      stock: 25,
      rating: 4.8,
      reviewCount: 142,
      unit: 'piece',
      description: 'Sweet and juicy pineapples grown in the volcanic soil of Benguet.',
      isNew: true,
      isFeatured: true,
    },
    {
      _id: '2',
      name: 'Organic Mixed Vegetables',
      price: 120,
      originalPrice: 150,
      images: ['/img/20250709_153424.jpg'],
      category: 'vegetables',
      stock: 15,
      rating: 4.9,
      reviewCount: 98,
      unit: 'bundle',
      description: 'Fresh assortment of organic vegetables including lettuce, carrots, and herbs.',
      isNew: false,
      isFeatured: true,
    },
    {
      _id: '3',
      name: 'Fresh Leafy Greens',
      price: 65,
      originalPrice: 75,
      images: ['/img/20250709_153634.jpg'],
      category: 'vegetables',
      stock: 30,
      rating: 4.7,
      reviewCount: 76,
      unit: 'bundle',
      description: 'Crisp and fresh leafy greens perfect for salads and healthy meals.',
      isNew: true,
      isFeatured: false,
    },
    {
      _id: '4',
      name: 'Premium Vegetables Bundle',
      price: 150,
      originalPrice: 180,
      images: ['/img/20250715_132607.jpg'],
      category: 'vegetables',
      stock: 12,
      rating: 5.0,
      reviewCount: 203,
      unit: 'bundle',
      description: 'Premium selection of fresh vegetables harvested this morning.',
      isNew: false,
      isFeatured: true,
    },
    {
      _id: '5',
      name: 'Garden Fresh Vegetables',
      price: 95,
      originalPrice: 110,
      images: ['/img/20250715_132621.jpg'],
      category: 'vegetables',
      stock: 20,
      rating: 4.6,
      reviewCount: 89,
      unit: 'bundle',
      description: 'Garden-fresh vegetables straight from our partner farms.',
      isNew: false,
      isFeatured: false,
    },
    {
      _id: '6',
      name: 'Organic Root Vegetables',
      price: 75,
      originalPrice: 90,
      images: ['/img/20250715_132626.jpg'],
      category: 'vegetables',
      stock: 18,
      rating: 4.8,
      reviewCount: 67,
      unit: 'bundle',
      description: 'Fresh root vegetables including carrots, radishes, and sweet potatoes.',
      isNew: false,
      isFeatured: false,
    },
    {
      _id: '7',
      name: 'Farm Fresh Produce',
      price: 180,
      originalPrice: 200,
      images: ['/img/20250715_133203.jpg'],
      category: 'mixed',
      stock: 14,
      rating: 4.9,
      reviewCount: 156,
      unit: 'bundle',
      description: 'Mixed selection of the freshest produce available today.',
      isNew: true,
      isFeatured: true,
    },
    {
      _id: '8',
      name: 'Seasonal Harvest Mix',
      price: 110,
      originalPrice: 130,
      images: ['/img/20250715_133213.jpg'],
      category: 'mixed',
      stock: 0,
      rating: 4.7,
      reviewCount: 92,
      unit: 'bundle',
      description: 'Seasonal mix of fruits and vegetables at peak freshness.',
      isNew: false,
      isFeatured: false,
    },
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'mixed', label: 'Mixed Bundles' },
    { value: 'herbs', label: 'Herbs' },
    { value: 'pantry', label: 'Pantry Items' },
    { value: 'dairy', label: 'Dairy' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: '-name', label: 'Name (Z-A)' },
    { value: 'price', label: 'Price (Low to High)' },
    { value: '-price', label: 'Price (High to Low)' },
    { value: 'rating', label: 'Rating' },
    { value: 'newest', label: 'Newest First' },
  ];

  // Simulate API call
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredProducts = [...mockProducts];
      
      // Apply filters
      if (searchQuery) {
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (selectedCategory !== 'all') {
        filteredProducts = filteredProducts.filter(product =>
          product.category === selectedCategory
        );
      }
      
      if (priceRange.min) {
        filteredProducts = filteredProducts.filter(product =>
          product.price >= parseInt(priceRange.min)
        );
      }
      
      if (priceRange.max) {
        filteredProducts = filteredProducts.filter(product =>
          product.price <= parseInt(priceRange.max)
        );
      }
      
      // Apply sorting
      filteredProducts.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case '-name':
            return b.name.localeCompare(a.name);
          case 'price':
            return a.price - b.price;
          case '-price':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'newest':
            return b.isNew - a.isNew;
          default:
            return 0;
        }
      });
      
      setProducts(filteredProducts);
      setTotalPages(Math.ceil(filteredProducts.length / 12));
      setLoading(false);
    };

    fetchProducts();
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (sortBy !== 'name') params.set('sort', sortBy);
    setSearchParams(params);
  }, [searchQuery, selectedCategory, sortBy, setSearchParams]);

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  const handleAddToCart = (product) => {
    addItem(product, 1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange({ min: '', max: '' });
    setSortBy('name');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Organic Products
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Discover our full range of fresh, organic products sourced directly from local farms.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowFilters(!showFilters)}
                leftIcon={<FunnelIcon className="w-5 h-5" />}
              >
                Filters
              </Button>
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
              {(showFilters || window.innerWidth >= 1024) && (
                <motion.div
                  className="bg-white rounded-lg shadow-sm border p-6 space-y-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search Products
                    </label>
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
                    />
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      options={categories}
                    />
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <Button
                    variant="ghost"
                    fullWidth
                    onClick={clearFilters}
                    leftIcon={<XMarkIcon className="w-5 h-5" />}
                  >
                    Clear Filters
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="text-sm text-gray-600">
                {loading ? 'Loading...' : `Showing ${products.length} products`}
              </div>
              
              <div className="flex items-center space-x-4">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  options={sortOptions}
                  className="min-w-[180px]"
                />
                
                <IconButton
                  variant="ghost"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <AdjustmentsHorizontalIcon className="w-5 h-5" />
                </IconButton>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <SkeletonLoader className="h-48 w-full" />
                    <div className="p-4">
                      <SkeletonLoader className="h-4 w-3/4 mb-2" />
                      <SkeletonLoader className="h-4 w-1/2 mb-2" />
                      <SkeletonLoader className="h-6 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <MagnifyingGlassIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </motion.div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <AnimatePresence>
                  {products.map((product, index) => (
                    <motion.div
                      key={product._id}
                      className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-all duration-300 group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ y: -2 }}
                    >
                      {/* Product Image */}
                      <div className="relative overflow-hidden">
                        <Link to={`/products/${product._id}`}>
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>
                        
                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col space-y-1">
                          {product.isNew && (
                            <span className="bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                              New
                            </span>
                          )}
                          {product.originalPrice && (
                            <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                            </span>
                          )}
                        </div>

                        {/* Wishlist Button */}
                        <button
                          onClick={() => toggleWishlist(product._id)}
                          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50"
                        >
                          {wishlist.has(product._id) ? (
                            <HeartSolid className="w-4 h-4 text-red-500" />
                          ) : (
                            <HeartIcon className="w-4 h-4 text-gray-600" />
                          )}
                        </button>

                        {/* Quick Add to Cart */}
                        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button
                            variant="primary"
                            size="sm"
                            fullWidth
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                          >
                            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                          </Button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        {/* Category & Rating */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-primary-600 font-medium uppercase tracking-wide">
                            {product.category}
                          </span>
                          <div className="flex items-center space-x-1">
                            <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">
                              {product.rating} ({product.reviewCount})
                            </span>
                          </div>
                        </div>

                        {/* Product Name */}
                        <Link to={`/products/${product._id}`}>
                          <h3 className="font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {product.description}
                        </p>

                        {/* Price & Stock */}
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
                            <span className="text-xs text-gray-500">/ {product.unit}</span>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            {product.stock} left
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Pagination */}
            {!loading && products.length > 0 && totalPages > 1 && (
              <motion.div
                className="flex justify-center mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  >
                    Previous
                  </Button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <Button
                      key={index + 1}
                      variant={currentPage === index + 1 ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  >
                    Next
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
