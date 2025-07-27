import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, MapPinIcon, UsersIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Components';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import apiClient from '../services/api';
import toast from 'react-hot-toast';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All Events' },
    { value: 'Workshop', label: 'Workshops' },
    { value: 'Product Launch', label: 'Product Launches' },
    { value: 'Health Seminar', label: 'Health Seminars' },
    { value: 'Cooking Class', label: 'Cooking Classes' },
    { value: 'Wellness Talk', label: 'Wellness Talks' },
    { value: 'Community Event', label: 'Community Events' },
    { value: 'Other', label: 'Other' }
  ];

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      params.append('upcoming', 'true');
      
      const response = await apiClient.get(`/api/events?${params.toString()}`);
      
      if (response.data.success) {
        setEvents(response.data.data || []);
      } else {
        throw new Error('Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-PH', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return price > 0 ? `₱${price.toFixed(2)}` : 'Free';
  };

  const handleRegister = (eventId) => {
    // TODO: Implement event registration
    toast.success('Registration feature coming soon!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Events & Workshops
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join us for exciting workshops, farm visits, and community events focused on 
            healthy living and sustainable agriculture.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-green-50'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : events.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {events.map((event) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full flex flex-col overflow-hidden">
                  {/* Event Image */}
                  <div className="h-48 bg-gradient-to-r from-green-400 to-blue-500 relative overflow-hidden">
                    {event.images?.[0]?.url ? (
                      <img
                        src={event.images[0].url}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-6xl">
                        🎉
                      </div>
                    )}
                    {event.isFeatured && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Event Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Category Badge */}
                    <div className="mb-3">
                      <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {event.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <CalendarIcon className="w-4 h-4 mr-2 text-green-500" />
                        {formatDate(event.startDate)} at {event.startTime}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPinIcon className="w-4 h-4 mr-2 text-green-500" />
                        {event.location?.venue || 'Location TBD'}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <UsersIcon className="w-4 h-4 mr-2 text-green-500" />
                        {event.registration?.capacity ? 
                          `${event.registration.currentRegistrations || 0}/${event.registration.capacity} registered` :
                          'Unlimited capacity'
                        }
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CurrencyDollarIcon className="w-4 h-4 mr-2 text-green-500" />
                        {formatPrice(event.registration?.fee || 0)}
                      </div>
                    </div>

                    {/* Register Button */}
                    <Button
                      onClick={() => handleRegister(event._id)}
                      className="w-full"
                      disabled={event.registration?.capacity && 
                        (event.registration.currentRegistrations >= event.registration.capacity)}
                    >
                      {event.registration?.capacity && 
                       (event.registration.currentRegistrations >= event.registration.capacity) 
                        ? 'Event Full' : 'Register Now'}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No Events Available
            </h3>
            <p className="text-gray-600 mb-8">
              {selectedCategory === 'all' 
                ? 'There are no upcoming events at the moment. Check back soon!'
                : `No ${selectedCategory.toLowerCase()} events found. Try a different category.`
              }
            </p>
            <Button onClick={() => setSelectedCategory('all')}>
              View All Events
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Events;
