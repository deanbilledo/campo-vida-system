import React from 'react';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  GlobeAltIcon,
  UsersIcon,
  SparklesIcon,
  CheckCircleIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';

const About = () => {
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

  const values = [
    {
      icon: <HeartIcon className="w-8 h-8" />,
      title: 'Passion for Quality',
      description: 'We are committed to providing the highest quality organic products that nourish both body and soul.',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      icon: <GlobeAltIcon className="w-8 h-8" />,
      title: 'Environmental Stewardship',
      description: 'Our sustainable farming practices protect the environment for future generations.',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: <UsersIcon className="w-8 h-8" />,
      title: 'Community Partnership',
      description: 'We work hand-in-hand with local farmers to create a thriving agricultural community.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: <SparklesIcon className="w-8 h-8" />,
      title: 'Innovation & Tradition',
      description: 'Blending traditional farming wisdom with modern sustainable practices.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Campo Vida Founded',
      description: 'Started with a vision to connect local organic farmers with health-conscious consumers.',
    },
    {
      year: '2021',
      title: 'Partner Network Expansion',
      description: 'Partnered with 25+ local farms across Benguet and surrounding areas.',
    },
    {
      year: '2023',
      title: 'Sustainable Practices Certification',
      description: 'Achieved full organic certification and implemented carbon-neutral delivery.',
    },
    {
      year: '2024',
      title: 'Community Impact',
      description: 'Supported over 100 farming families and delivered to 5,000+ satisfied customers.',
    },
  ];

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
                  About
                  <span className="block gradient-text">Campo Vida</span>
                </motion.h1>
                <motion.p
                  className="text-lg text-gray-600 leading-relaxed"
                  variants={itemVariants}
                >
                  Campo Vida is more than just an organic food company. We're a bridge connecting 
                  passionate local farmers with families who value fresh, healthy, and sustainably 
                  grown produce. Our journey began in the heart of Baguio, where the cool mountain 
                  climate and rich soil create perfect conditions for organic farming.
                </motion.p>
              </div>
              
              <motion.div className="flex items-center space-x-4" variants={itemVariants}>
                <MapPinIcon className="w-6 h-6 text-primary-600" />
                <span className="text-gray-700 font-medium">Based in Baguio City, Philippines</span>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              variants={itemVariants}
            >
              <img
                src="/img/view-2.jpg"
                alt="Campo Vida Farm Views"
                className="w-full h-96 object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Vision Mission Section */}
      <section className="py-20 bg-white">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants}>
              <img
                src="/img/vission-mission-objectives.jpg"
                alt="Campo Vida Vision Mission Objectives"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </motion.div>
            
            <motion.div className="space-y-8" variants={itemVariants}>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed">
                  To provide fresh, organic, and sustainably grown produce while supporting 
                  local farming communities and promoting environmental stewardship. We believe 
                  that good food should be accessible, affordable, and beneficial for both 
                  people and the planet.
                </p>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
                <p className="text-gray-600 leading-relaxed">
                  To become the leading platform for organic produce in the Philippines, 
                  creating a sustainable ecosystem where farmers thrive, communities prosper, 
                  and families enjoy the freshest, healthiest food possible.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do, from partnering with farmers to delivering to your doorstep.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="text-center group"
                variants={itemVariants}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 ${value.bgColor} ${value.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Farm Photos Section */}
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
              From Our Partner Farms
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Take a glimpse into the beautiful farms where our organic produce is lovingly grown.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { src: '/img/20250709_153946.jpg', alt: 'Fresh vegetables growing in the field' },
              { src: '/img/20250709_153953.jpg', alt: 'Organic farming practices' },
              { src: '/img/20250715_132621.jpg', alt: 'Harvest season at partner farms' },
              { src: '/img/20250715_132626.jpg', alt: 'Sustainable farming methods' },
              { src: '/img/20250715_133203.jpg', alt: 'Quality organic produce' },
              { src: '/img/path-1.jpg', alt: 'Farm pathways and landscapes' },
            ].map((image, index) => (
              <motion.div
                key={index}
                className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 group"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20 bg-gray-50">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From humble beginnings to a thriving community of farmers and customers.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary-200" />
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  className={`flex items-center ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                  variants={itemVariants}
                >
                  <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <div className="text-primary-600 font-bold text-lg mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="relative flex-shrink-0">
                    <div className="w-6 h-6 bg-primary-600 rounded-full border-4 border-white shadow-lg" />
                  </div>
                  
                  <div className="lg:w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-white">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div className="space-y-6" variants={itemVariants}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Supporting Local Communities
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our success is built on strong partnerships with local farmers and communities. 
                Together, we're creating sustainable livelihoods while preserving traditional 
                farming knowledge and protecting our environment.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">100+ partner farming families</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">5,000+ hectares of organic farmland</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">Carbon-neutral delivery system</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">Direct trade ensuring fair prices</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <img
                src="/img/partners.jpg"
                alt="Campo Vida Partners and Community"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary-600">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Join the Campo Vida Family
            </h2>
            <p className="text-lg text-primary-100 max-w-2xl mx-auto mb-8">
              Experience the difference of truly fresh, organic produce while supporting 
              sustainable agriculture and local communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="accent"
                size="lg"
                onClick={() => window.location.href = '/products'}
              >
                Shop Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary-600"
                onClick={() => window.location.href = '/contact'}
              >
                Get in Touch
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
