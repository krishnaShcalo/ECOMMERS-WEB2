import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/Navbar';
import CustomerHome from './pages/customer/Home';
import ProductsPage from './pages/customer/Products';
import ProductDetail from './pages/customer/ProductDetail';
import Cart from './pages/customer/Cart';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import SignUp from './pages/auth/SignUp';
import Profile from './pages/account/Profile';
import Addresses from './pages/account/Addresses';
import AdminRoute from './components/auth/AdminRoute';
import Login from './pages/auth/Login';
import AdminLayout from './components/admin/AdminLayout';
import AdminCustomers from './pages/admin/Customers';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Toaster />
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<CustomerHome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:productId" element={<ProductDetail />} />

              {/* Protected Customer Routes */}
              <Route path="/account" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/account/addresses" element={<ProtectedRoute><Addresses /></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />

              {/* Protected Admin Routes */}
              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="customers" element={<AdminCustomers />} />
              </Route>
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;