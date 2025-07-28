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
import apiClient from '../../services/api';
import toast from 'react-hot-toast';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    maxAttendees: '',
    price: '',
    isActive: true,
    isFeatured: false,
    status: 'published',
    isVisible: true,
    image: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    { value: 'Workshop', label: 'Workshop' },
    { value: 'Product Launch', label: 'Product Launch' },
    { value: 'Health Seminar', label: 'Health Seminar' },
    { value: 'Cooking Class', label: 'Cooking Class' },
    { value: 'Wellness Talk', label: 'Wellness Talk' },
    { value: 'Community Event', label: 'Community Event' },
    { value: 'Other', label: 'Other' }
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await apiClient.get('/api/admin/events');
      setEvents(response.data.data || response.data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.date || !formData.time || !formData.location || !formData.category) {
        toast.error('Please fill in all required fields');
        setSubmitting(false);
        return;
      }

      const eventData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        startDate: formData.date,
        endDate: formData.date,
        startTime: formData.time,
        endTime: formData.time, // Using same time for both start and end
        location: {
          venue: formData.location,
          address: {
            street: formData.location
          }
        },
        organizer: {
          name: 'Campo Vida Team',
          email: 'admin@campo-vida.com'
        },
        maxAttendees: parseInt(formData.maxAttendees) || 50,
        price: parseFloat(formData.price) || 0,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        status: formData.status || 'published',
        isVisible: formData.isVisible !== false,
        images: formData.image ? [{ url: formData.image, alt: formData.title, isPrimary: true }] : []
      };

      if (editingEvent) {
        await apiClient.put(`/api/admin/events/${editingEvent._id}`, eventData);
        toast.success('Event updated successfully!');
      } else {
        await apiClient.post('/api/admin/events', eventData);
        toast.success('Event created successfully!');
      }

      setIsModalOpen(false);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.errors || 'Failed to save event';
      if (typeof errorMessage === 'object') {
        const errorMessages = Object.values(errorMessage).filter(msg => msg).join(', ');
        toast.error(errorMessages || 'Failed to save event');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (event) => {
    const eventDate = new Date(event.startDate);
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: eventDate.toISOString().split('T')[0],
      time: event.startTime || '10:00',
      location: event.location?.venue || '',
      category: event.category,
      maxAttendees: event.registration?.capacity?.toString() || '',
      price: event.registration?.fee?.toString() || '0',
      isActive: event.status === 'published' || event.isActive !== false,
      isFeatured: event.isFeatured || false,
      status: event.status || 'published',
      isVisible: event.isVisible !== false,
      image: event.images?.[0]?.url || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await apiClient.delete(`/api/admin/events/${eventId}`);
      toast.success('Event deleted successfully!');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      category: '',
      maxAttendees: '',
      price: '',
      isActive: true,
      isFeatured: false,
      status: 'published',
      isVisible: true,
      image: ''
    });
    setEditingEvent(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatEventDate = (startDate, startTime) => {
    if (!startDate) return 'No date';
    const date = new Date(startDate);
    const dateStr = date.toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    return startTime ? `${dateStr} at ${startTime}` : dateStr;
  };

  const getStatusBadge = (isActive, startDate) => {
    const now = new Date();
    const eventDate = new Date(startDate);
    
    if (isActive === false) return <Badge variant="danger">Inactive</Badge>;
    if (eventDate < now) return <Badge variant="default">Past</Badge>;
    return <Badge variant="success">Active</Badge>;
  };

  const getCategoryBadge = (category) => {
    if (!category) return <Badge variant="default">No Category</Badge>;
    
    const categoryColors = {
      'Workshop': 'info',
      'Product Launch': 'success',
      'Health Seminar': 'success',
      'Cooking Class': 'warning',
      'Wellness Talk': 'info',
      'Community Event': 'default',
      'Other': 'default'
    };
    
    return <Badge variant={categoryColors[category] || 'default'}>
      {category}
    </Badge>;
  };

  const tableHeaders = ['Event', 'Date & Time', 'Category', 'Price', 'Attendees', 'Status'];
  const tableData = events.map(event => ({
    id: event._id,
    event: (
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg mr-4 flex items-center justify-center text-white font-bold">
          🎉
        </div>
        <div>
          <p className="font-medium text-gray-900">{event.title}</p>
          <p className="text-sm text-gray-500">{event.location?.venue || 'No venue'}</p>
          {event.isFeatured && <Badge variant="warning" size="sm">Featured</Badge>}
        </div>
      </div>
    ),
    dateTime: formatEventDate(event.startDate, event.startTime),
    category: getCategoryBadge(event.category),
    price: event.registration?.fee > 0 ? formatCurrency(event.registration.fee) : 'Free',
    attendees: event.registration?.capacity ? `${event.registration.currentRegistrations || 0}/${event.registration.capacity}` : 'Unlimited',
    status: getStatusBadge(event.isActive, event.startDate)
  }));

  const tableActions = (event) => [
    <Button
      key="edit"
      size="sm"
      variant="outline"
      onClick={(e) => {
        e.stopPropagation();
        handleEdit(events.find(e => e._id === event.id));
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
        handleDelete(event.id);
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Event Management</h1>
            <p className="text-gray-600">Create and manage Campo Vida events and workshops</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            icon="+"
            size="lg"
          >
            Create Event
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-3xl font-bold text-gray-900">{events.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-blue-600 text-xl">🎉</span>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Events</p>
                <p className="text-3xl font-bold text-gray-900">
                  {events.filter(e => e.isActive !== false && new Date(e.startDate) > new Date()).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-green-600 text-xl">✅</span>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Featured</p>
                <p className="text-3xl font-bold text-gray-900">
                  {events.filter(e => e.isFeatured).length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-yellow-600 text-xl">⭐</span>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-3xl font-bold text-gray-900">
                  {events.filter(e => {
                    const eventDate = new Date(e.startDate);
                    const now = new Date();
                    return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-purple-600 text-xl">📅</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Events Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DataTable
            headers={tableHeaders}
            data={tableData}
            loading={loading}
            actions={tableActions}
          />
        </motion.div>

        {/* Event Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title={editingEvent ? 'Edit Event' : 'Create New Event'}
          size="xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Event Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter event title"
                className="md:col-span-2"
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
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="Event location"
              />
              
              <Input
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
              
              <Input
                label="Time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
                required
              />
              
              <Input
                label="Price (PHP)"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00 (Free event)"
              />
              
              <Input
                label="Max Attendees"
                name="maxAttendees"
                type="number"
                value={formData.maxAttendees}
                onChange={handleInputChange}
                placeholder="Leave empty for unlimited"
              />
              
              <div className="space-y-4">
                <Select
                  label="Event Status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  options={[
                    { value: 'draft', label: 'Draft' },
                    { value: 'published', label: 'Published' },
                    { value: 'cancelled', label: 'Cancelled' },
                    { value: 'postponed', label: 'Postponed' }
                  ]}
                  required
                />

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
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                    Active Event
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
                    Featured Event
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
              placeholder="Describe the event..."
              required
            />
            
            <Input
              label="Image URL"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
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
                icon={editingEvent ? "💾" : "+"}
              >
                {editingEvent ? 'Update Event' : 'Create Event'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default AdminEvents;
