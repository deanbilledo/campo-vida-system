import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Button, 
  Card, 
  LoadingSpinner, 
  DataTable, 
  Modal, 
  Input, 
  Textarea, 
  Select,
  Badge 
} from '../../components/ui/Components';
import ImageUpload from '../../components/ui/ImageUpload';
import apiClient from '../../services/api';
import toast from 'react-hot-toast';

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    type: 'blog',
    category: '',
    tags: '',
    featuredImageUrl: '',
    images: [],
    status: 'draft',
    isVisible: true,
    isFeatured: false,
    isPinned: false,
    metaDescription: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const postTypes = [
    { value: 'announcement', label: 'Announcement' },
    { value: 'blog', label: 'Blog Post' },
    { value: 'news', label: 'News' },
    { value: 'recipe', label: 'Recipe' },
    { value: 'tips', label: 'Tips & Guides' },
    { value: 'story', label: 'Customer Story' }
  ];

  const categories = [
    { value: 'Health & Wellness', label: 'Health & Wellness' },
    { value: 'Organic Farming', label: 'Organic Farming' },
    { value: 'Recipes', label: 'Recipes' },
    { value: 'Company News', label: 'Company News' },
    { value: 'Tips & Guides', label: 'Tips & Guides' },
    { value: 'Customer Stories', label: 'Customer Stories' },
    { value: 'Events', label: 'Events' },
    { value: 'Other', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' }
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await apiClient.get('/api/admin/posts');
      setPosts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (imageUrl) => {
    console.log('AdminPosts: Image uploaded:', imageUrl);
    setFormData(prev => ({
      ...prev,
      featuredImageUrl: imageUrl,
      images: [...prev.images, { url: imageUrl, alt: formData.title || 'Post image' }]
    }));
  };

  const handleMultipleImageUpload = (imageUrl) => {
    console.log('AdminPosts: Multiple image uploaded:', imageUrl);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { url: imageUrl, alt: formData.title || 'Post image' }]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    console.log('AdminPosts: handleSubmit called with formData:', formData);

    try {
      // Validate required fields
      if (!formData.title || !formData.content || !formData.category) {
        toast.error('Please fill in all required fields');
        setSubmitting(false);
        return;
      }

      const postData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        type: formData.type,
        category: formData.category,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        status: formData.status,
        isVisible: formData.isVisible,
        isFeatured: formData.isFeatured,
        isPinned: formData.isPinned,
        metaDescription: formData.metaDescription,
        images: formData.images || []
      };

      console.log('AdminPosts: Submitting postData with images:', postData.images);

      // Add featured image if provided
      if (formData.featuredImageUrl) {
        postData.featuredImage = {
          url: formData.featuredImageUrl,
          alt: formData.title
        };
      }

      if (editingPost) {
        await apiClient.put(`/api/admin/posts/${editingPost._id}`, postData);
        toast.success('Post updated successfully!');
      } else {
        await apiClient.post('/api/admin/posts', postData);
        toast.success('Post created successfully!');
      }

      setIsModalOpen(false);
      resetForm();
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save post';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      type: post.type,
      category: post.category,
      tags: post.tags ? post.tags.join(', ') : '',
      featuredImageUrl: post.featuredImage?.url || '',
      images: post.images || [],
      status: post.status,
      isVisible: post.isVisible,
      isFeatured: post.isFeatured,
      isPinned: post.isPinned,
      metaDescription: post.metaDescription || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await apiClient.delete(`/api/admin/posts/${postId}`);
      toast.success('Post deleted successfully!');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      type: 'blog',
      category: '',
      tags: '',
      featuredImageUrl: '',
      images: [],
      status: 'draft',
      isVisible: true,
      isFeatured: false,
      isPinned: false,
      metaDescription: ''
    });
    setEditingPost(null);
  };

  const getStatusBadge = (status) => {
    const variants = {
      published: 'success',
      draft: 'warning',
      archived: 'danger'
    };
    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  const getTypeBadge = (type) => {
    const colors = {
      announcement: 'bg-red-100 text-red-800',
      blog: 'bg-blue-100 text-blue-800',
      news: 'bg-green-100 text-green-800',
      recipe: 'bg-yellow-100 text-yellow-800',
      tips: 'bg-purple-100 text-purple-800',
      story: 'bg-pink-100 text-pink-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type] || 'bg-gray-100 text-gray-800'}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const tableHeaders = ['Post', 'Type', 'Category', 'Status', 'Views', 'Created'];
  const tableData = posts.map(post => ({
    id: post._id,
    post: (
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4 flex items-center justify-center">
          {post.featuredImage?.url ? (
            <img 
              src={post.featuredImage.url.startsWith('http') ? 
                post.featuredImage.url : 
                `http://localhost:5000${post.featuredImage.url}`
              } 
              alt={post.title}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span>📝</span>
          )}
        </div>
        <div>
          <p className="font-medium text-gray-900 line-clamp-1">{post.title}</p>
          <p className="text-sm text-gray-500">by {post.authorName}</p>
          <div className="flex items-center space-x-2 mt-1">
            {post.isFeatured && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Featured</span>}
            {post.isPinned && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Pinned</span>}
          </div>
        </div>
      </div>
    ),
    type: getTypeBadge(post.type),
    category: post.category,
    status: getStatusBadge(post.status),
    views: post.views.toLocaleString(),
    created: formatDate(post.createdAt)
  }));

  const tableActions = (post) => [
    <Button
      key="edit"
      size="sm"
      variant="outline"
      onClick={(e) => {
        e.stopPropagation();
        handleEdit(posts.find(p => p._id === post.id));
      }}
    >
      ✏️ Edit
    </Button>,
    <Button
      key="delete"
      size="sm"
      variant="danger"
      onClick={(e) => {
        e.stopPropagation();
        handleDelete(post.id);
      }}
    >
      🗑️ Delete
    </Button>
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Content Management</h1>
            <p className="text-gray-600">Create and manage blog posts, announcements, and content</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            icon="+"
            size="lg"
          >
            Create Post
          </Button>
        </motion.div>

        {/* Posts Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <DataTable
            headers={tableHeaders}
            data={tableData}
            loading={loading}
            actions={tableActions}
          />
        </motion.div>

        {/* Post Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title={editingPost ? 'Edit Post' : 'Create New Post'}
          size="xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Post Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter post title"
                />
              </div>
              
              <Select
                label="Post Type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                options={postTypes}
                required
              />
              
              <Select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                options={[{ value: '', label: 'Select category' }, ...categories]}
                required
              />
              
              <Select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                options={statusOptions}
                required
              />

              <Input
                label="Tags (comma separated)"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="organic, health, wellness"
              />

              <div className="md:col-span-2">
                <Input
                  label="Excerpt (optional)"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="Brief description of the post..."
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  label="Meta Description (SEO)"
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  placeholder="SEO description for search engines..."
                  maxLength={160}
                />
              </div>

              <div className="md:col-span-2">
                <ImageUpload
                  type="post"
                  onImageUpload={handleImageUpload}
                  currentImage={formData.featuredImageUrl ? 
                    (formData.featuredImageUrl.startsWith('http') ? 
                      formData.featuredImageUrl : 
                      `http://localhost:5000${formData.featuredImageUrl}`
                    ) : ''
                  }
                  label="Featured Image"
                />
              </div>

              <div className="md:col-span-2">
                <ImageUpload
                  type="post"
                  onImageUpload={handleMultipleImageUpload}
                  label="Additional Images"
                  multiple={true}
                />
                {formData.images.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Uploaded Images: {formData.images.length}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={image.url.startsWith('http') ? image.url : `http://localhost:5000${image.url}`} 
                            alt={image.alt} 
                            className="w-full h-20 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                images: prev.images.filter((_, i) => i !== index)
                              }));
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isVisible"
                    name="isVisible"
                    checked={formData.isVisible}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="isVisible" className="ml-2 text-sm font-medium text-gray-700">
                    Visible on Website
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="isFeatured" className="ml-2 text-sm font-medium text-gray-700">
                    Featured Post
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPinned"
                    name="isPinned"
                    checked={formData.isPinned}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="isPinned" className="ml-2 text-sm font-medium text-gray-700">
                    Pin to Top
                  </label>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <Textarea
                label="Content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={12}
                placeholder="Write your post content here..."
                className="col-span-2"
                required
              />
            </div>
            
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={submitting}
                icon={editingPost ? "💾" : "+"}
              >
                {editingPost ? 'Update Post' : 'Create Post'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default AdminPosts;
