import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StarIcon,
  HeartIcon,
  ShoppingCartIcon,
  TruckIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Mock product data (would come from API)
  const mockProduct = {
    id: parseInt(id),
    name: 'Fresh Organic Tomatoes',
    price: 85.00,
    originalPrice: 95.00,
    description: 'Premium organic tomatoes grown in the fertile highlands of Benguet. These vine-ripened tomatoes are bursting with natural flavor and packed with nutrients. Perfect for salads, cooking, or enjoying fresh.',
    category: 'Vegetables',
    unit: 'kg',
    stock: 25,
    images: [
      '/api/placeholder/500/500',
      '/api/placeholder/500/500',
      '/api/placeholder/500/500',
      '/api/placeholder/500/500',
    ],
    rating: 4.8,
    reviewCount: 124,
    origin: 'Benguet, Philippines',
    harvestDate: '2024-01-15',
    nutritionalInfo: {
      calories: '18 per 100g',
      vitamin_c: '28mg',
      potassium: '237mg',
      fiber: '1.2g',
    },
    features: [
      'Organically grown without pesticides',
      'Harvested within 24 hours',
      'Rich in lycopene and vitamins',
      'Supports local farmers',
    ],
    storage: 'Store in a cool, dry place. Refrigerate for longer freshness.',
    seller: {
      name: 'Green Valley Farm',
      rating: 4.9,
      location: 'La Trinidad, Benguet',
    },
  };

  const mockReviews = [
    {
      id: 1,
      user: 'Maria Santos',
      rating: 5,
      comment: 'Amazing quality! These tomatoes are so fresh and flavorful. Perfect for my garden salad.',
      date: '2024-01-10',
      verified: true,
    },
    {
      id: 2,
      user: 'Juan Cruz',
      rating: 4,
      comment: 'Good quality tomatoes, delivered fresh as promised. Will order again.',
      date: '2024-01-08',
      verified: true,
    },
    {
      id: 3,
      user: 'Ana Lopez',
      rating: 5,
      comment: 'Best tomatoes I\'ve bought online! Campo Vida always delivers quality.',
      date: '2024-01-05',
      verified: true,
    },
  ];

  const mockRelatedProducts = [
    {
      id: 2,
      name: 'Organic Bell Peppers',
      price: 120.00,
      image: '/api/placeholder/300/300',
      rating: 4.7,
    },
    {
      id: 3,
      name: 'Fresh Lettuce',
      price: 65.00,
      image: '/api/placeholder/300/300',
      rating: 4.6,
    },
    {
      id: 4,
      name: 'Organic Carrots',
      price: 90.00,
      image: '/api/placeholder/300/300',
      rating: 4.8,
    },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data.data);
        } else {
          // Fallback to mock data if API fails
          setProduct(mockProduct);
        }
        setReviews(mockReviews);
        setRelatedProducts(mockRelatedProducts);
      } catch (error) {
        console.error('Error fetching product:', error);
        // Fallback to mock data
        setProduct(mockProduct);
        setReviews(mockReviews);
        setRelatedProducts(mockRelatedProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      unit: product.unit,
      category: product.category,
      stock: product.stock,
    }, quantity);

    toast.success(`Added ${quantity} ${product.unit} of ${product.name} to cart`);
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.error('Please login to save to wishlist');
      navigate('/login');
      return;
    }
    
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Button onClick={() => navigate('/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Breadcrumb */}
        <motion.nav className="mb-8" variants={itemVariants}>
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <button onClick={() => navigate('/')} className="hover:text-primary-600">
                Home
              </button>
            </li>
            <li>/</li>
            <li>
              <button onClick={() => navigate('/products')} className="hover:text-primary-600">
                Products
              </button>
            </li>
            <li>/</li>
            <li>
              <button onClick={() => navigate(`/products?category=${product.category}`)} className="hover:text-primary-600">
                {product.category}
              </button>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </motion.nav>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Product Images */}
          <motion.div className="lg:col-span-6" variants={itemVariants}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Main Image */}
              <div className="relative aspect-square">
                <img
                  src={(() => {
                    const images = product.images || [];
                    if (images.length === 0) {
                      return '/img/placeholder.jpg';
                    }
                    
                    const currentImage = images[selectedImageIndex];
                    
                    // Handle new API format (objects with url property)
                    if (typeof currentImage === 'object' && currentImage.url) {
                      const imageUrl = currentImage.url;
                      if (imageUrl.startsWith('http')) {
                        return imageUrl;
                      }
                      const cacheBuster = product.lastUpdated ? 
                        `?v=${new Date(product.lastUpdated).getTime()}` : 
                        `?v=${Date.now()}`;
                      return `http://localhost:5000${imageUrl}${cacheBuster}`;
                    }
                    
                    // Handle old format (direct URL strings) or placeholder
                    if (typeof currentImage === 'string') {
                      if (currentImage.startsWith('http') || currentImage.startsWith('/api/placeholder')) {
                        return currentImage;
                      }
                      return `http://localhost:5000${currentImage}`;
                    }
                    
                    return '/img/placeholder.jpg';
                  })()}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/img/placeholder.jpg';
                  }}
                />
                
                {/* Image Navigation */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex((prev) => 
                        prev === 0 ? product.images.length - 1 : prev - 1
                      )}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
                    >
                      <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex((prev) => 
                        prev === product.images.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
                    >
                      <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                    </button>
                  </>
                )}

                {/* Stock Badge */}
                <div className="absolute top-4 left-4">
                  {product.stock > 0 ? (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      In Stock ({product.stock} {product.unit} available)
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={handleWishlist}
                    className="bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
                  >
                    {isWishlisted ? (
                      <HeartSolidIcon className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    className="bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
                  >
                    <ShareIcon className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Image Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="p-4">
                  <div className="flex space-x-2 overflow-x-auto">
                    {product.images.map((image, index) => {
                      const getThumbUrl = (img) => {
                        // Handle new API format (objects with url property)
                        if (typeof img === 'object' && img.url) {
                          const imageUrl = img.url;
                          if (imageUrl.startsWith('http')) {
                            return imageUrl;
                          }
                          const cacheBuster = product.lastUpdated ? 
                            `?v=${new Date(product.lastUpdated).getTime()}` : 
                            `?v=${Date.now()}`;
                          return `http://localhost:5000${imageUrl}${cacheBuster}`;
                        }
                        
                        // Handle old format (direct URL strings) or placeholder
                        if (typeof img === 'string') {
                          if (img.startsWith('http') || img.startsWith('/api/placeholder')) {
                            return img;
                          }
                          return `http://localhost:5000${img}`;
                        }
                        
                        return '/img/placeholder.jpg';
                      };

                      return (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                            selectedImageIndex === index
                              ? 'border-primary-500'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={getThumbUrl(image)}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/img/placeholder.jpg';
                            }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div className="lg:col-span-6 mt-8 lg:mt-0" variants={itemVariants}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Basic Info */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarSolidIcon
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {product.rating} ({product.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-primary-600">
                      ₱{product.price.toFixed(2)}
                    </span>
                    <span className="text-lg text-gray-500 ml-2">per {product.unit}</span>
                  </div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-lg text-gray-500 line-through">
                      ₱{product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity ({product.unit})
                    </label>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="text-lg font-medium px-4">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        disabled={quantity >= product.stock}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Price
                    </label>
                    <div className="text-2xl font-bold text-primary-600">
                      ₱{(product.price * quantity).toFixed(2)}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={product.stock === 0}
                  leftIcon={<ShoppingCartIcon className="w-5 h-5" />}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>

              {/* Product Details */}
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Origin:</span>
                    <span className="ml-2 text-gray-600">{product.origin}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Harvest Date:</span>
                    <span className="ml-2 text-gray-600">{product.harvestDate}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Category:</span>
                    <span className="ml-2 text-gray-600">{product.category}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Seller:</span>
                    <span className="ml-2 text-gray-600">{product.seller.name}</span>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Key Features:</h3>
                  <ul className="space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Delivery Info */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <TruckIcon className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-green-800">Fresh Delivery</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Delivered fresh within 24 hours of harvest. Free delivery for orders over ₱1,500.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional Information Tabs */}
        <motion.div className="mt-12" variants={itemVariants}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button className="py-4 px-1 border-b-2 border-primary-500 text-primary-600 font-medium text-sm">
                  Nutritional Information
                </button>
                <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">
                  Reviews ({product.reviewCount})
                </button>
                <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">
                  Storage Instructions
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Nutritional Information */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                  <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900">{value}</div>
                    <div className="text-sm text-gray-600 capitalize">
                      {key.replace('_', ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Related Products */}
        <motion.div className="mt-12" variants={itemVariants}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/products/${relatedProduct.id}`)}
              >
                <div className="aspect-square">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{relatedProduct.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-600">
                      ₱{relatedProduct.price.toFixed(2)}
                    </span>
                    <div className="flex items-center">
                      <StarSolidIcon className="w-4 h-4 text-yellow-400" />
                      <span className="ml-1 text-sm text-gray-600">{relatedProduct.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProductDetail;
