const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  
  // Event Details
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: ['Workshop', 'Product Launch', 'Health Seminar', 'Cooking Class', 'Wellness Talk', 'Community Event', 'Other']
  },
  
  // Date and Time
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
  },
  timezone: {
    type: String,
    default: 'Asia/Manila'
  },
  
  // Location
  location: {
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      maxlength: [200, 'Venue cannot be more than 200 characters']
    },
    address: {
      street: String,
      barangay: String,
      city: String,
      province: String,
      zipCode: String
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    isOnline: {
      type: Boolean,
      default: false
    },
    onlineLink: {
      type: String,
      validate: {
        validator: function(v) {
          if (this.location.isOnline && !v) return false;
          if (v && !this.location.isOnline) return false;
          if (v) {
            return /^https?:\/\/.+/.test(v);
          }
          return true;
        },
        message: 'Please provide a valid online meeting link for online events'
      }
    },
    specialInstructions: String
  },
  
  // Organizer Information
  organizer: {
    name: {
      type: String,
      required: [true, 'Organizer name is required']
    },
    email: {
      type: String,
      required: [true, 'Organizer email is required'],
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      match: [/^(\+63|0)?9\d{9}$/, 'Please enter a valid Philippine phone number']
    },
    organization: String,
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot be more than 500 characters']
    }
  },
  
  // Registration & Capacity
  registration: {
    isRequired: {
      type: Boolean,
      default: true
    },
    capacity: {
      type: Number,
      min: [1, 'Capacity must be at least 1'],
      default: 50
    },
    currentRegistrations: {
      type: Number,
      default: 0,
      min: [0, 'Current registrations cannot be negative']
    },
    fee: {
      type: Number,
      default: 0,
      min: [0, 'Fee cannot be negative']
    },
    earlyBirdFee: {
      amount: {
        type: Number,
        min: [0, 'Early bird fee cannot be negative']
      },
      deadline: Date
    },
    registrationDeadline: Date,
    waitingList: {
      enabled: {
        type: Boolean,
        default: true
      },
      currentCount: {
        type: Number,
        default: 0
      }
    }
  },
  
  // Content & Media
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    },
    caption: String
  }],
  
  // Event Program
  agenda: [{
    time: {
      type: String,
      required: true,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
    },
    title: {
      type: String,
      required: true,
      maxlength: [100, 'Agenda item title cannot be more than 100 characters']
    },
    description: {
      type: String,
      maxlength: [300, 'Agenda item description cannot be more than 300 characters']
    },
    speaker: String,
    duration: Number // in minutes
  }],
  
  // Speakers/Facilitators
  speakers: [{
    name: {
      type: String,
      required: true
    },
    title: String,
    bio: {
      type: String,
      maxlength: [500, 'Speaker bio cannot be more than 500 characters']
    },
    photo: String,
    socialLinks: {
      facebook: String,
      instagram: String,
      linkedin: String,
      website: String
    }
  }],
  
  // Requirements & What to Bring
  requirements: {
    items: [{
      type: String,
      maxlength: [100, 'Requirement item cannot be more than 100 characters']
    }],
    prerequisites: [{
      type: String,
      maxlength: [200, 'Prerequisite cannot be more than 200 characters']
    }],
    ageRestriction: {
      minimum: Number,
      maximum: Number
    },
    specialNeeds: String
  },
  
  // External Links
  externalLinks: {
    registrationUrl: {
      type: String,
      validate: {
        validator: function(v) {
          if (v) return /^https?:\/\/.+/.test(v);
          return true;
        },
        message: 'Please provide a valid registration URL'
      }
    },
    facebookEvent: String,
    ticketingPlatform: String,
    livestreamUrl: String
  },
  
  // Status & Visibility
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'postponed', 'completed'],
    default: 'draft'
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Tags & Categories
  tags: [{
    type: String,
    maxlength: [30, 'Tag cannot be more than 30 characters']
  }],
  targetAudience: [{
    type: String,
    enum: ['Beginners', 'Intermediate', 'Advanced', 'All Levels', 'Families', 'Adults Only', 'Seniors', 'Children']
  }],
  
  // Analytics
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    registrations: {
      type: Number,
      default: 0
    },
    cancellations: {
      type: Number,
      default: 0
    },
    attendance: {
      registered: Number,
      attended: Number,
      attendanceRate: Number
    },
    feedback: {
      averageRating: {
        type: Number,
        min: [0, 'Rating cannot be negative'],
        max: [5, 'Rating cannot be more than 5'],
        default: 0
      },
      totalReviews: {
        type: Number,
        default: 0
      }
    }
  },
  
  // Communication
  notifications: {
    reminder24h: {
      sent: { type: Boolean, default: false },
      sentAt: Date
    },
    reminder1h: {
      sent: { type: Boolean, default: false },
      sentAt: Date
    },
    followUp: {
      sent: { type: Boolean, default: false },
      sentAt: Date
    }
  },
  
  // Post-Event
  materials: [{
    title: String,
    description: String,
    fileUrl: String,
    fileType: {
      type: String,
      enum: ['pdf', 'doc', 'ppt', 'video', 'audio', 'image', 'other']
    },
    isPublic: {
      type: Boolean,
      default: false
    }
  }],
  
  // Admin Information
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  adminNotes: {
    type: String,
    maxlength: [500, 'Admin notes cannot be more than 500 characters']
  },
  
  // SEO
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    slug: {
      type: String,
      unique: true,
      sparse: true
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for registration status
eventSchema.virtual('registrationStatus').get(function() {
  if (!this.registration.isRequired) return 'not_required';
  if (this.registration.currentRegistrations >= this.registration.capacity) return 'full';
  if (this.registration.registrationDeadline && new Date() > this.registration.registrationDeadline) return 'closed';
  return 'open';
});

// Virtual for event status based on dates
eventSchema.virtual('eventStatus').get(function() {
  const now = new Date();
  const startDateTime = new Date(`${this.startDate.toDateString()} ${this.startTime}`);
  const endDateTime = new Date(`${this.endDate.toDateString()} ${this.endTime}`);
  
  if (this.status === 'cancelled') return 'cancelled';
  if (this.status === 'postponed') return 'postponed';
  if (now < startDateTime) return 'upcoming';
  if (now >= startDateTime && now <= endDateTime) return 'ongoing';
  return 'completed';
});

// Virtual for days until event
eventSchema.virtual('daysUntilEvent').get(function() {
  const now = new Date();
  const startDateTime = new Date(`${this.startDate.toDateString()} ${this.startTime}`);
  const diffTime = startDateTime - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for availability
eventSchema.virtual('spotsAvailable').get(function() {
  return Math.max(0, this.registration.capacity - this.registration.currentRegistrations);
});

// Virtual for primary image
eventSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : (this.images.length > 0 ? this.images[0].url : null);
});

// Pre-save middleware
eventSchema.pre('save', function(next) {
  // Generate slug if not provided
  if (!this.seo.slug) {
    this.seo.slug = this.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  
  // Validate end date is after start date
  if (this.endDate < this.startDate) {
    return next(new Error('End date must be after start date'));
  }
  
  // Update lastUpdatedBy if user is available in context
  if (this.isModified() && !this.isNew && this.$locals && this.$locals.user) {
    this.lastUpdatedBy = this.$locals.user._id;
  }
  
  next();
});

// Indexes
eventSchema.index({ startDate: 1, status: 1 });
eventSchema.index({ category: 1, status: 1 });
eventSchema.index({ isFeatured: 1, status: 1 });
eventSchema.index({ 'seo.slug': 1 }, { unique: true, sparse: true });
eventSchema.index({ title: 'text', description: 'text' });

// Static methods
eventSchema.statics.getUpcomingEvents = function(limit = 10) {
  return this.find({
    status: 'published',
    isVisible: true,
    startDate: { $gte: new Date() }
  })
  .sort({ startDate: 1 })
  .limit(limit)
  .select('title shortDescription startDate startTime location category primaryImage registrationStatus');
};

eventSchema.statics.getFeaturedEvents = function(limit = 3) {
  return this.find({
    status: 'published',
    isVisible: true,
    isFeatured: true,
    startDate: { $gte: new Date() }
  })
  .sort({ startDate: 1 })
  .limit(limit);
};

eventSchema.statics.getEventsByCategory = function(category) {
  return this.find({
    status: 'published',
    isVisible: true,
    category: category,
    startDate: { $gte: new Date() }
  })
  .sort({ startDate: 1 });
};

// Instance methods
eventSchema.methods.incrementViews = function() {
  this.analytics.views += 1;
  return this.save();
};

eventSchema.methods.addRegistration = function() {
  if (this.registrationStatus === 'full') {
    throw new Error('Event is full');
  }
  if (this.registrationStatus === 'closed') {
    throw new Error('Registration is closed');
  }
  
  this.registration.currentRegistrations += 1;
  this.analytics.registrations += 1;
  return this.save();
};

eventSchema.methods.cancelRegistration = function() {
  if (this.registration.currentRegistrations > 0) {
    this.registration.currentRegistrations -= 1;
    this.analytics.cancellations += 1;
  }
  return this.save();
};

eventSchema.methods.updateAttendance = function(attendedCount) {
  this.analytics.attendance.registered = this.registration.currentRegistrations;
  this.analytics.attendance.attended = attendedCount;
  this.analytics.attendance.attendanceRate = 
    this.registration.currentRegistrations > 0 
      ? (attendedCount / this.registration.currentRegistrations) * 100 
      : 0;
  return this.save();
};

module.exports = mongoose.model('Event', eventSchema);
