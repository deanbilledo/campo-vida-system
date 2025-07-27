import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';
import Input, { Textarea } from '../components/ui/Input';
import toast from 'react-hot-toast';

// Contact form validation schema
const contactSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  phone: yup
    .string()
    .matches(/^(\+63|0)[0-9]{10}$/, 'Please enter a valid Philippine phone number'),
  subject: yup
    .string()
    .required('Subject is required'),
  message: yup
    .string()
    .min(10, 'Message must be at least 10 characters')
    .required('Message is required'),
});

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <MapPinIcon className="w-6 h-6" />,
      title: 'Visit Us',
      details: ['Campo Vida Center', 'Baguio City, Benguet', 'Philippines 2600'],
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: <PhoneIcon className="w-6 h-6" />,
      title: 'Call Us',
      details: ['+63 912 345 6789', '+63 917 987 6543', 'Mon-Sat: 8AM-6PM'],
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: <EnvelopeIcon className="w-6 h-6" />,
      title: 'Email Us',
      details: ['hello@campovida.ph', 'orders@campovida.ph', 'support@campovida.ph'],
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: <ClockIcon className="w-6 h-6" />,
      title: 'Business Hours',
      details: ['Monday - Saturday', '8:00 AM - 6:00 PM', 'Sunday: Closed'],
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden py-20">
        <div className="absolute inset-0 hero-pattern opacity-40" />
        
        <motion.div
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div className="space-y-8" variants={itemVariants}>
              <div>
                <motion.h1
                  className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                  variants={itemVariants}
                >
                  Get in
                  <span className="block gradient-text">Touch</span>
                </motion.h1>
                <motion.p
                  className="text-lg text-gray-600 leading-relaxed"
                  variants={itemVariants}
                >
                  Have questions about our organic products? Want to partner with us? 
                  Or need help with your order? We'd love to hear from you! Our team 
                  is here to help you with all your fresh produce needs.
                </motion.p>
              </div>
              
              <motion.div className="flex items-center space-x-4" variants={itemVariants}>
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-primary-600" />
                <span className="text-gray-700 font-medium">We typically respond within 24 hours</span>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              variants={itemVariants}
            >
              <img
                src="/img/path-2.jpg"
                alt="Campo Vida Farm Paths"
                className="w-full h-96 object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-20 bg-white">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Multiple Ways to Reach Us
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the most convenient way to connect with our team
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                className="text-center group"
                variants={itemVariants}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 ${info.bgColor} ${info.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {info.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {info.title}
                </h3>
                <div className="space-y-1">
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-gray-600">
                      {detail}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 bg-gray-50">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-8"
              variants={itemVariants}
            >
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Send us a Message
                </h3>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    type="text"
                    placeholder="Enter your full name"
                    leftIcon={<UserIcon className="w-5 h-5" />}
                    error={errors.name?.message}
                    {...register('name')}
                  />
                  
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    leftIcon={<EnvelopeIcon className="w-5 h-5" />}
                    error={errors.email?.message}
                    {...register('email')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Phone Number (Optional)"
                    type="tel"
                    placeholder="+63 XXX XXX XXXX"
                    leftIcon={<PhoneIcon className="w-5 h-5" />}
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                  
                  <Input
                    label="Subject"
                    type="text"
                    placeholder="What's this about?"
                    error={errors.subject?.message}
                    {...register('subject')}
                  />
                </div>

                <Textarea
                  label="Message"
                  rows={5}
                  placeholder="Tell us how we can help you..."
                  error={errors.message?.message}
                  {...register('message')}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </motion.div>

            {/* Farm Location & Info */}
            <motion.div className="space-y-8" variants={itemVariants}>
              {/* Farm Image */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <img
                  src="/img/hutt.jpg"
                  alt="Campo Vida Farm Location"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Visit Our Farm
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Come and see where the magic happens! Take a tour of our organic 
                    farms and meet the passionate farmers behind your fresh produce.
                  </p>
                  <div className="flex items-center text-primary-600">
                    <MapPinIcon className="w-5 h-5 mr-2" />
                    <span className="font-medium">Baguio City, Benguet</span>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Why Contact Us?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Product Inquiries</h4>
                      <p className="text-sm text-gray-600">
                        Questions about our organic products, availability, or custom orders
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Partnership Opportunities</h4>
                      <p className="text-sm text-gray-600">
                        Interested in becoming a partner farmer or retailer
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Order Support</h4>
                      <p className="text-sm text-gray-600">
                        Help with placing orders, delivery issues, or payment questions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">General Feedback</h4>
                      <p className="text-sm text-gray-600">
                        Share your experience and help us improve our services
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <motion.div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Quick answers to common questions
            </p>
          </motion.div>

          <motion.div className="space-y-6" variants={itemVariants}>
            {[
              {
                question: 'What are your delivery hours?',
                answer: 'We deliver Monday to Saturday, 8:00 AM to 6:00 PM. Same-day delivery is available for orders placed before 2:00 PM.',
              },
              {
                question: 'How fresh are your products?',
                answer: 'All our products are harvested within 24-48 hours before delivery. We work directly with local farmers to ensure maximum freshness.',
              },
              {
                question: 'Do you offer bulk orders for restaurants?',
                answer: 'Yes! We provide special pricing and customized delivery schedules for restaurants, cafes, and other commercial establishments.',
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept GCash, bank transfers, and cash on delivery (COD available after 5 successful orders).',
              },
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Contact;
