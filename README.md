# 🌿 Campo Vida E-commerce System

A complete MERN stack e-commerce platform for Campo Vida organic products center.

## 🧰 Technology Stack

- **Frontend**: React.js + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT with bcrypt
- **File Uploads**: Multer
- **Hosting**: Hostinger

## 🏗️ Project Structure

```
campo-vida-system/
├── backend/              # Node.js/Express backend
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Authentication, validation middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   ├── uploads/         # File upload directory
│   └── server.js        # Main server file
├── frontend/            # React frontend
│   ├── public/          # Static files
│   ├── src/            # React components and logic
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom hooks
│   │   ├── context/     # React context
│   │   ├── utils/       # Helper functions
│   │   └── App.js       # Main App component
└── shared/              # Shared configurations and types
```

## 🚀 Getting Started

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 📦 Core Features

1. **Landing Page** - Public showcase with featured products
2. **User Authentication** - Role-based access control (Customer, Admin, Driver)
3. **Product Catalog** - Advanced filtering and search
4. **Intelligent Order System** - Automated order processing
5. **Delivery Management** - Driver interface and tracking
6. **Payment Integration** - GCash and COD support
7. **Admin Dashboard** - Complete management system
8. **Mobile Optimization** - Responsive design
9. **Security** - JWT, CSRF protection, rate limiting
10. **Analytics** - Sales and operational reporting

## 🎯 Business Rules

- **COD Eligibility**: Minimum 5 successful GCash orders
- **Stock Management**: 2-unit safety buffer for walk-ins
- **Order Cutoff**: 3PM for next-day delivery
- **Delivery Hours**: 9AM-5PM within 10km radius
- **Business Hours**: 8AM-5PM Mon-Sat

## 🔐 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting and CSRF protection
- Role-based access control

## 📱 Mobile Features

- Mobile-first responsive design
- Progressive Web App capabilities
- Touch-friendly interface
- Optimized performance

## 🚢 Deployment

Configured for Hostinger deployment with:
- Node.js hosting support
- MongoDB Atlas integration
- SSL certificate
- File upload management
- Environment variables

---

*Built for Campo Vida - Your local organic products center*
