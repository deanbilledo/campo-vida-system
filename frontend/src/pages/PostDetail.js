import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CalendarIcon,
  ClockIcon,
  EyeIcon,
  TagIcon,
  UserIcon,
  ShareIcon,
  ChevronLeftIcon,
  LinkIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Toast from '../components/ui/Toast';
import apiClient from '../services/api';

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (post) {
      fetchRelatedPosts();
      setLikes(post.likes || 0);
      // Check if user has liked this post (from localStorage for now)
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      setLiked(likedPosts.includes(post._id));
    }
  }, [post]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get(`/api/posts/${slug}`);
      setPost(response.data.data);
      
      // Track view
      setTimeout(() => {
        apiClient.post(`/api/posts/${slug}/view`).catch(console.error);
      }, 2000);
      
    } catch (error) {
      console.error('Error fetching post:', error);
      setError(error.response?.data?.message || 'Post not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async () => {
    try {
      if (!post.categories || post.categories.length === 0) return;
      
      const response = await apiClient.get(
        `/api/posts?category=${post.categories[0]}&limit=3&exclude=${post._id}`
      );
      setRelatedPosts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await apiClient.post(`/api/posts/${post._id}/like`);
      setLikes(response.data.likes);
      setLiked(!liked);
      
      // Store in localStorage
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      if (!liked) {
        likedPosts.push(post._id);
      } else {
        const index = likedPosts.indexOf(post._id);
        if (index > -1) likedPosts.splice(index, 1);
      }
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
      
    } catch (error) {
      console.error('Error liking post:', error);
      showToast('Unable to like post', 'error');
    }
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = post.title;
    const text = post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 200);

    try {
      switch (platform) {
        case 'copy':
          await navigator.clipboard.writeText(url);
          showToast('Link copied to clipboard!', 'success');
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
          break;
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
          break;
        case 'email':
          window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\nRead more: ' + url)}`;
          break;
        default:
          break;
      }
      setShowShareModal(false);
    } catch (error) {
      console.error('Error sharing:', error);
      showToast('Unable to share', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The post you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/posts')}>
            ← Back to Posts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/posts')}
              className="flex items-center space-x-2"
            >
              <ChevronLeftIcon className="h-5 w-5" />
              <span>Back to Posts</span>
            </Button>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleLike}
                className={`flex items-center space-x-2 ${liked ? 'text-red-600' : 'text-gray-600'}`}
              >
                {liked ? (
                  <HeartSolidIcon className="h-5 w-5" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
                <span>{likes}</span>
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => setShowShareModal(true)}
                className="flex items-center space-x-2"
              >
                <ShareIcon className="h-5 w-5" />
                <span>Share</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        {post.featuredImage?.url && (
          <div className="h-96 bg-gray-900 overflow-hidden">
            <img
              src={post.featuredImage.url.startsWith('http') ? 
                post.featuredImage.url : 
                `http://localhost:5000${post.featuredImage.url}`
              }
              alt={post.title}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${post.featuredImage?.url ? 'absolute bottom-8 left-4 right-4 text-white' : 'py-12'}`}
          >
            {/* Post Type */}
            <div className="mb-4">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getTypeColor(post.type)}`}>
                {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
              </span>
              {post.isFeatured && (
                <span className="inline-block ml-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium">
                  ⭐ Featured
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className={`text-xl mb-6 max-w-3xl ${post.featuredImage?.url ? 'text-gray-200' : 'text-gray-600'}`}>
                {post.excerpt}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5" />
                <span className="font-medium">{post.author?.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5" />
                <span>{formatReadTime(post.readTime)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <EyeIcon className="h-5 w-5" />
                <span>{post.views} views</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div 
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-green-600 prose-strong:text-gray-900"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex items-center space-x-2 mt-8 pt-8 border-t">
                  <TagIcon className="h-5 w-5 text-gray-400" />
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <Link
                        key={tag}
                        to={`/posts?search=${encodeURIComponent(tag)}`}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              {post.categories && post.categories.length > 0 && (
                <div className="flex items-center space-x-2 mt-4">
                  <span className="text-sm text-gray-500">Categories:</span>
                  <div className="flex flex-wrap gap-2">
                    {post.categories.map(category => (
                      <Link
                        key={category}
                        to={`/posts?category=${encodeURIComponent(category)}`}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            {/* Author Info */}
            {post.author && (
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Author</h3>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{post.author.name}</p>
                    <p className="text-sm text-gray-500">{post.author.email}</p>
                  </div>
                </div>
                {post.author.bio && (
                  <p className="text-sm text-gray-600">{post.author.bio}</p>
                )}
              </div>
            )}

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Posts</h3>
                <div className="space-y-4">
                  {relatedPosts.map(relatedPost => (
                    <Link
                      key={relatedPost._id}
                      to={`/posts/${relatedPost.slug || relatedPost._id}`}
                      className="block group"
                    >
                      <div className="flex space-x-3">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {relatedPost.featuredImage?.url ? (
                            <img
                              src={relatedPost.featuredImage.url.startsWith('http') ? 
                                relatedPost.featuredImage.url : 
                                `http://localhost:5000${relatedPost.featuredImage.url}`
                              }
                              alt={relatedPost.title}
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
                            {relatedPost.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(relatedPost.publishedAt)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Share this post</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleShare('copy')}
                className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <LinkIcon className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium">Copy Link</span>
              </button>
              
              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-blue-50 transition-colors"
              >
                <div className="w-5 h-5 bg-blue-600 rounded"></div>
                <span className="text-sm font-medium">Facebook</span>
              </button>
              
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-blue-50 transition-colors"
              >
                <div className="w-5 h-5 bg-blue-400 rounded"></div>
                <span className="text-sm font-medium">Twitter</span>
              </button>
              
              <button
                onClick={() => handleShare('whatsapp')}
                className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-green-50 transition-colors"
              >
                <div className="w-5 h-5 bg-green-500 rounded"></div>
                <span className="text-sm font-medium">WhatsApp</span>
              </button>
              
              <button
                onClick={() => handleShare('email')}
                className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors col-span-2"
              >
                <div className="w-5 h-5 bg-gray-600 rounded"></div>
                <span className="text-sm font-medium">Email</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'success' })}
        />
      )}
    </article>
  );
};

export default PostDetail;
