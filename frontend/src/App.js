import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

// Context providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/auth/Profile';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

// Protected routes
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import DriverRoute from './components/auth/DriverRoute';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminEvents from './pages/admin/AdminEvents';
import AdminSettings from './pages/admin/AdminSettings';

// Driver pages
import DriverDashboard from './pages/driver/DriverDashboard';
import DriverDeliveries from './pages/driver/DriverDeliveries';
import DriverProfile from './pages/driver/DriverProfile';

// Error pages
import NotFound from './pages/errors/NotFound';
import ErrorBoundary from './components/errors/ErrorBoundary';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3,
};

// Page wrapper component for consistent animations
const PageWrapper = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <Router>
                <div className="min-h-screen bg-gray-50">
                  <Navbar />
                  
                  <main className="flex-1">
                    <Routes>
                      {/* Public routes */}
                      <Route 
                        path="/" 
                        element={
                          <PageWrapper>
                            <Home />
                          </PageWrapper>
                        } 
                      />
                      <Route 
                        path="/products" 
                        element={
                          <PageWrapper>
                            <Products />
                          </PageWrapper>
                        } 
                      />
                      <Route 
                        path="/products/:id" 
                        element={
                          <PageWrapper>
                            <ProductDetail />
                          </PageWrapper>
                        } 
                      />
                      <Route 
                        path="/events" 
                        element={
                          <PageWrapper>
                            <Events />
                          </PageWrapper>
                        } 
                      />
                      <Route 
                        path="/events/:id" 
                        element={
                          <PageWrapper>
                            <EventDetail />
                          </PageWrapper>
                        } 
                      />
                      <Route 
                        path="/cart" 
                        element={
                          <PageWrapper>
                            <Cart />
                          </PageWrapper>
                        } 
                      />
                      <Route 
                        path="/about" 
                        element={
                          <PageWrapper>
                            <About />
                          </PageWrapper>
                        } 
                      />
                      <Route 
                        path="/contact" 
                        element={
                          <PageWrapper>
                            <Contact />
                          </PageWrapper>
                        } 
                      />
                      <Route 
                        path="/privacy" 
                        element={
                          <PageWrapper>
                            <PrivacyPolicy />
                          </PageWrapper>
                        } 
                      />
                      <Route 
                        path="/terms" 
                        element={
                          <PageWrapper>
                            <TermsOfService />
                          </PageWrapper>
                        } 
                      />

                      {/* Auth routes */}
                      <Route 
                        path="/login" 
                        element={
                          <PageWrapper>
                            <Login />
                          </PageWrapper>
                        } 
                      />
                      <Route 
                        path="/register" 
                        element={
                          <PageWrapper>
                            <Register />
                          </PageWrapper>
                        } 
                      />

                      {/* Protected customer routes */}
                      <Route 
                        path="/profile" 
                        element={
                          <ProtectedRoute>
                            <PageWrapper>
                              <Profile />
                            </PageWrapper>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/orders" 
                        element={
                          <ProtectedRoute>
                            <PageWrapper>
                              <Orders />
                            </PageWrapper>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/orders/:id" 
                        element={
                          <ProtectedRoute>
                            <PageWrapper>
                              <OrderDetail />
                            </PageWrapper>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/checkout" 
                        element={
                          <ProtectedRoute>
                            <PageWrapper>
                              <Checkout />
                            </PageWrapper>
                          </ProtectedRoute>
                        } 
                      />

                      {/* Admin routes */}
                      <Route 
                        path="/admin" 
                        element={
                          <AdminRoute>
                            <PageWrapper>
                              <AdminDashboard />
                            </PageWrapper>
                          </AdminRoute>
                        } 
                      />
                      <Route 
                        path="/admin/products" 
                        element={
                          <AdminRoute>
                            <PageWrapper>
                              <AdminProducts />
                            </PageWrapper>
                          </AdminRoute>
                        } 
                      />
                      <Route 
                        path="/admin/orders" 
                        element={
                          <AdminRoute>
                            <PageWrapper>
                              <AdminOrders />
                            </PageWrapper>
                          </AdminRoute>
                        } 
                      />
                      <Route 
                        path="/admin/customers" 
                        element={
                          <AdminRoute>
                            <PageWrapper>
                              <AdminCustomers />
                            </PageWrapper>
                          </AdminRoute>
                        } 
                      />
                      <Route 
                        path="/admin/events" 
                        element={
                          <AdminRoute>
                            <PageWrapper>
                              <AdminEvents />
                            </PageWrapper>
                          </AdminRoute>
                        } 
                      />
                      <Route 
                        path="/admin/settings" 
                        element={
                          <AdminRoute>
                            <PageWrapper>
                              <AdminSettings />
                            </PageWrapper>
                          </AdminRoute>
                        } 
                      />

                      {/* Driver routes */}
                      <Route 
                        path="/driver" 
                        element={
                          <DriverRoute>
                            <PageWrapper>
                              <DriverDashboard />
                            </PageWrapper>
                          </DriverRoute>
                        } 
                      />
                      <Route 
                        path="/driver/deliveries" 
                        element={
                          <DriverRoute>
                            <PageWrapper>
                              <DriverDeliveries />
                            </PageWrapper>
                          </DriverRoute>
                        } 
                      />
                      <Route 
                        path="/driver/profile" 
                        element={
                          <DriverRoute>
                            <PageWrapper>
                              <DriverProfile />
                            </PageWrapper>
                          </DriverRoute>
                        } 
                      />

                      {/* 404 route */}
                      <Route 
                        path="*" 
                        element={
                          <PageWrapper>
                            <NotFound />
                          </PageWrapper>
                        } 
                      />
                    </Routes>
                  </main>
                  
                  <Footer />
                </div>

                {/* Global components */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                    success: {
                      style: {
                        background: '#10b981',
                      },
                    },
                    error: {
                      style: {
                        background: '#ef4444',
                      },
                    },
                  }}
                />
                
                {/* Loading spinner overlay when needed */}
                <React.Suspense fallback={<LoadingSpinner />}>
                  <div />
                </React.Suspense>
              </Router>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
