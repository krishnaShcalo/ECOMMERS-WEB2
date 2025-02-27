import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { useAuthorization } from '../hooks/useAuthorization';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const Navbar: React.FC = () => {
  const cart = useStore((state) => state.cart);
  const { can, loading: authLoading } = useAuthorization();
  const { user } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setIsProfileMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16 gap-8">
          <div className="flex items-center gap-4">
            <button className="text-white">
              <span className="sr-only">Menu</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/" className="text-2xl font-bold text-white">
              Budget Bazaar 
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/products" className="text-white hover:text-secondary">
                Products
              </Link>
              <Link to="/deals" className="text-white hover:text-secondary">
                Deals
              </Link>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="max-w-2xl">
              <div className="relative">
                <input
                  type="search"
                  placeholder="What can we help you find today?"
                  className="w-full px-4 py-2 text-gray-900 rounded-lg focus:outline-none"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2">
                  <span className="sr-only">Search</span>
                  <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <Link to="/cart" className="relative">
              <span className="sr-only">Cart</span>
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Link>
            
            {!authLoading && (
              <div className="relative">
                {user ? (
                  <>
                    <button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="flex items-center gap-2 hover:text-secondary"
                    >
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user?.user_metadata?.avatar_url || '/images/default-avatar.png'}
                        alt="User avatar"
                      />
                      <span className="hidden md:block">
                        {user.user_metadata?.full_name || user.email}
                      </span>
                    </button>

                    {isProfileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        {can('viewAdminDashboard') && (
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        <Link
                          to="/account"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          My Account
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          My Orders
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign out
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-4">
                    <Link
                      to="/login"
                      className="text-white hover:text-secondary"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/signup"
                      className="bg-white text-primary px-4 py-2 rounded-md hover:bg-secondary"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar