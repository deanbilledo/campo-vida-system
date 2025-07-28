const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    maxlength: [5000, 'Content cannot be more than 5000 characters']
  },
  excerpt: {
    type: String,
    maxlength: [300, 'Excerpt cannot be more than 300 characters']
  },
  
  // Post Type
  type: {
    type: String,
    enum: ['announcement', 'blog', 'news', 'recipe', 'tips', 'story'],
    default: 'blog'
  },
  
  // Categories
  category: {
    type: String,
    enum: ['Health & Wellness', 'Organic Farming', 'Recipes', 'Company News', 'Tips & Guides', 'Customer Stories', 'Events', 'Other'],
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // Media
  featuredImage: {
    url: String,
    alt: String,
    caption: String
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    caption: String
  }],
  
  // SEO & URLs
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot be more than 160 characters']
  },
  
  // Publishing
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
  scheduledFor: {
    type: Date
  },
  
  // Author (Admin)
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  
  // Visibility & Features
  isVisible: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  
  // Engagement (Read-only stats)
  views: {
    type: Number,
    default: 0
  },
  readTime: {
    type: Number, // in minutes
    default: 1
  },
  
  // Content Structure
  sections: [{
    type: {
      type: String,
      enum: ['text', 'image', 'quote', 'list', 'recipe'],
      default: 'text'
    },
    content: String,
    imageUrl: String,
    imageAlt: String,
    listItems: [String],
    quoteText: String,
    quoteAuthor: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ category: 1, status: 1 });
postSchema.index({ isFeatured: 1, status: 1 });
postSchema.index({ slug: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ author: 1 });

// Auto-generate slug from title
postSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Auto-generate excerpt if not provided
  if (this.isModified('content') && !this.excerpt) {
    this.excerpt = this.content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .substring(0, 250) + '...';
  }
  
  // Calculate read time (average 200 words per minute)
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.max(1, Math.ceil(wordCount / 200));
  }
  
  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

// Virtual for URL
postSchema.virtual('url').get(function() {
  return `/posts/${this.slug || this._id}`;
});

// Virtual for formatted publish date
postSchema.virtual('publishedDateFormatted').get(function() {
  if (!this.publishedAt) return null;
  return this.publishedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Static method to get published posts
postSchema.statics.getPublished = function() {
  return this.find({
    status: 'published',
    isVisible: true,
    $or: [
      { publishedAt: { $lte: new Date() } },
      { publishedAt: { $exists: false } }
    ]
  })
  .populate('author', 'name email')
  .sort({ isPinned: -1, publishedAt: -1 });
};

// Static method to get featured posts
postSchema.statics.getFeatured = function(limit = 3) {
  return this.find({
    status: 'published',
    isVisible: true,
    isFeatured: true,
    $or: [
      { publishedAt: { $lte: new Date() } },
      { publishedAt: { $exists: false } }
    ]
  })
  .populate('author', 'name email')
  .sort({ isPinned: -1, publishedAt: -1 })
  .limit(limit);
};

// Instance method to increment views
postSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save({ validateBeforeSave: false });
};

module.exports = mongoose.model('Post', postSchema);
