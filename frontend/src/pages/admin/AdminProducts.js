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

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    unit: '',
    imageUrl: '',
    isOrganic: true,
    isActive: true,
    images: []
  });
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    { value: 'Chips', label: 'Chips' },
    { value: 'Juices', label: 'Juices' },
    { value: 'Milk', label: 'Milk' },
    { value: 'Supplements', label: 'Supplements' },
    { value: 'Fruits', label: 'Fruits' },
    { value: 'Vegetables', label: 'Vegetables' },
    { value: 'Herbs', label: 'Herbs' },
    { value: 'Nuts', label: 'Nuts' },
    { value: 'Other', label: 'Other' }
  ];

  const units = [
    { value: 'kg', label: 'Kilogram' },
    { value: 'g', label: 'Gram' },
    { value: 'piece', label: 'Piece' },
    { value: 'bundle', label: 'Bundle' },
    { value: 'pack', label: 'Pack' },
    { value: 'liter', label: 'Liter' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get('/api/admin/products');
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
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
    setFormData(prev => ({
      ...prev,
      imageUrl: imageUrl
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.stock) {
        toast.error('Please fill in all required fields');
        setSubmitting(false);
        return;
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        isActive: formData.isActive,
        isFeatured: formData.isFeatured || false,
        organicCertified: formData.isOrganic || false,
        specifications: {
          weight: {
            unit: formData.unit || 'pieces'
          }
        }
      };

      // Add image if provided
      if (formData.imageUrl) {
        productData.images = [{
          url: formData.imageUrl,
          alt: formData.name,
          isPrimary: true
        }];
      }

      if (editingProduct) {
        await apiClient.put(`/api/admin/products/${editingProduct._id}`, productData);
        toast.success('Product updated successfully!');
      } else {
        await apiClient.post('/api/admin/products', productData);
        toast.success('Product created successfully!');
      }

      setIsModalOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: (product.stock?.quantity || 0).toString(),
      unit: product.specifications?.weight?.unit || 'pieces',
      imageUrl: product.images?.[0]?.url || '',
      isOrganic: product.organicCertified || false,
      isActive: product.isActive,
      images: product.images || []
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await apiClient.delete(`/api/admin/products/${productId}`);
      toast.success('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      unit: '',
      imageUrl: '',
      isOrganic: true,
      isActive: true,
      images: []
    });
    setEditingProduct(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const getStockBadge = (product) => {
    const stock = product.stock?.quantity || 0;
    if (stock <= 0) return <Badge variant="danger">Out of Stock</Badge>;
    if (stock <= 10) return <Badge variant="warning">Low Stock</Badge>;
    return <Badge variant="success">In Stock</Badge>;
  };

  const getStatusBadge = (isActive) => {
    return isActive ? 
      <Badge variant="success">Active</Badge> : 
      <Badge variant="danger">Inactive</Badge>;
  };

  const tableHeaders = ['Product', 'Category', 'Price', 'Stock', 'Status', 'Organic'];
  const tableData = products.map(product => ({
    id: product._id,
    product: (
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4 flex items-center justify-center">
          {product.images?.[0]?.url ? (
            <img 
              src={product.images[0].url.startsWith('http') ? 
                product.images[0].url : 
                `http://localhost:5000${product.images[0].url}`
              } 
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span>🌿</span>
          )}
        </div>
        <div>
          <p className="font-medium text-gray-900">{product.name}</p>
          <p className="text-sm text-gray-500">{product.specifications?.weight?.unit || 'pieces'}</p>
        </div>
      </div>
    ),
    category: product.category,
    price: formatCurrency(product.price),
    stock: (
      <div className="flex items-center space-x-2">
        <span>{product.stock?.quantity || 0}</span>
        {getStockBadge(product)}
      </div>
    ),
    status: getStatusBadge(product.isActive),
    organic: product.organicCertified ? '✅' : '❌'
  }));

  const tableActions = (product) => [
    <Button
      key="edit"
      size="sm"
      variant="outline"
      onClick={(e) => {
        e.stopPropagation();
        handleEdit(products.find(p => p._id === product.id));
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
        handleDelete(product.id);
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Product Management</h1>
            <p className="text-gray-600">Manage your organic product catalog</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            icon="+"
            size="lg"
          >
            Add Product
          </Button>
        </motion.div>

        {/* Products Table */}
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

        {/* Product Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title={editingProduct ? 'Edit Product' : 'Add New Product'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter product name"
              />
              
              <Select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                options={[{ value: '', label: 'Select category' }, ...categories]}
                required
              />
              
              <Input
                label="Price (PHP)"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                required
                placeholder="0.00"
              />
              
              <Input
                label="Stock Quantity"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                required
                placeholder="0"
              />
              
              <Select
                label="Unit"
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                options={[{ value: '', label: 'Select unit' }, ...units]}
                required
              />

              <div className="col-span-2">
                <Input
                  label="Product Image URL"
                  name="image"
                  type="url"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                    <div className="w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                      <img
                        src={formData.image}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm" style={{display: 'none'}}>
                        Invalid image URL
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isOrganic"
                    name="isOrganic"
                    checked={formData.isOrganic}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="isOrganic" className="ml-2 text-sm font-medium text-gray-700">
                    Organic Product
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                    Active Product
                  </label>
                </div>
              </div>
            </div>
            
            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Describe the product..."
              className="col-span-2"
            />
            
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
                icon={editingProduct ? "💾" : "+"}
              >
                {editingProduct ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default AdminProducts;
