import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  CalendarIcon,
  ClockIcon,
  EyeIcon,
  TagIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';
import Input, { Select } from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import apiClient from '../services/api';

const Posts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State management
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);

  const postTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'announcement', label: 'Announcements' },
    { value: 'blog', label: 'Blog Posts' },
    { value: 'news', label: 'News' },
    { value: 'recipe', label: 'Recipes' },
    { value: 'tips', label: 'Tips & Guides' },
    { value: 'story', label: 'Customer Stories' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title', label: 'Title (A-Z)' },
    { value: 'views', label: 'Most Viewed' }
  ];

  useEffect(() => {
    fetchPosts();
    fetchCategories();
    fetchFeaturedPosts();
  }, [selectedCategory, selectedType, sortBy, currentPage, searchQuery]);

  useEffect(() => {
    // Update URL params
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedType !== 'all') params.set('type', selectedType);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    setSearchParams(params);
  }, [searchQuery, selectedCategory, selectedType, sortBy, setSearchParams]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedType !== 'all') params.append('type', selectedType);
      if (sortBy !== 'newest') params.append('sort', sortBy);
      params.append('page', currentPage);
      params.append('limit', 12);

      const response = await apiClient.get(`/api/posts?${params.toString()}`);
      setPosts(response.data.data || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/api/posts/categories');
      setCategories([
        { value: 'all', label: 'All Categories', count: 0 },
        ...response.data.data.map(cat => ({
          value: cat.name,
          label: cat.name,
          count: cat.count
        }))
      ]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchFeaturedPosts = async () => {
    try {
      const response = await apiClient.get('/api/posts/featured?limit=3');
      setFeaturedPosts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching featured posts:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPosts();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatReadTime = (minutes) => {
    return `${minutes} min read`;
  };

  const getTypeColor = (type) => {
    const colors = {
      announcement: 'bg-red-100 text-red-800',
      blog: 'bg-blue-100 text-blue-800',
      news: 'bg-green-100 text-green-800',
      recipe: 'bg-yellow-100 text-yellow-800',
      tips: 'bg-purple-100 text-purple-800',
      story: 'bg-pink-100 text-pink-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-6">Campo Vida Blog</h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
              Discover insights about organic living, health tips, delicious recipes, and the latest news from Campo Vida.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-20 py-4 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/70"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-white/70" />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  size="sm"
                >
                  Search
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Posts</h3>
              
              <div className="space-y-4">
                <Select
                  label="Category"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  options={categories}
                />
                
                <Select
                  label="Type"
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    setCurrentPage(1);
                  }}
                  options={postTypes}
                />
                
                <Select
                  label="Sort By"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  options={sortOptions}
                />
              </div>
            </div>

            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Posts</h3>
                <div className="space-y-4">
                  {featuredPosts.map(post => (
                    <Link
                      key={post._id}
                      to={`/posts/${post.slug || post._id}`}
                      className="block group"
                    >
                      <div className="flex space-x-3">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {post.featuredImage?.url ? (
                            <img
                              src={post.featuredImage.url.startsWith('http') ? 
                                post.featuredImage.url : 
                                `http://localhost:5000${post.featuredImage.url}`
                              }
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              📝
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 group-hover:text-green-600 line-clamp-2">
                            {post.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(post.publishedAt)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <>
                {/* Posts Grid */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                  {posts.map((post, index) => (
                    <motion.article
                      key={post._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                    >
                      {/* Post Image */}
                      <div className="relative h-48 bg-gradient-to-br from-green-400 to-blue-500 overflow-hidden">
                        {post.featuredImage?.url ? (
                          <img
                            src={post.featuredImage.url.startsWith('http') ? 
                              post.featuredImage.url : 
                              `http://localhost:5000${post.featuredImage.url}`
                            }
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white text-6xl">
                            📝
                          </div>
                        )}
                        
                        {/* Post Type Badge */}
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(post.type)}`}>
                            {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                          </span>
                        </div>

                        {/* Featured Badge */}
                        {post.isFeatured && (
                          <div className="absolute top-4 right-4">
                            <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                              ⭐ Featured
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Post Content */}
                      <div className="p-6">
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            <span>{formatDate(post.publishedAt)}</span>
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            <span>{formatReadTime(post.readTime)}</span>
                          </div>
                          <div className="flex items-center">
                            <EyeIcon className="h-4 w-4 mr-1" />
                            <span>{post.views}</span>
                          </div>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                          {post.title}
                        </h2>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
                        </p>

                        {/* Post Footer */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <UserIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">{post.author?.name}</span>
                          </div>
                          
                          <Link
                            to={`/posts/${post.slug || post._id}`}
                            className="text-green-600 hover:text-green-700 font-medium text-sm"
                          >
                            Read More →
                          </Link>
                        </div>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex items-center space-x-2 mt-4 pt-4 border-t">
                            <TagIcon className="h-4 w-4 text-gray-400" />
                            <div className="flex flex-wrap gap-1">
                              {post.tags.slice(0, 3).map(tag => (
                                <span
                                  key={tag}
                                  className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                              {post.tags.length > 3 && (
                                <span className="text-gray-400 text-xs">
                                  +{post.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.article>
                  ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      >
                        Previous
                      </Button>
                      
                      {[...Array(totalPages)].map((_, i) => (
                        <Button
                          key={i + 1}
                          variant={currentPage === i + 1 ? 'primary' : 'outline'}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      ))}
                      
                      <Button
                        variant="outline"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;
