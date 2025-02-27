import React from 'react';
import { Link } from 'react-router-dom';

const CustomerHome: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Top Deals</h2>
          <Link to="/deals" className="text-primary hover:underline">View all</Link>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <div className="flex items-center gap-4">
            <select className="border rounded-lg px-3 py-2">
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Best Selling</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="bg-white border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div className="aspect-w-1 aspect-h-1 mb-4">
              <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                <p className="text-center text-gray-500">Products coming soon...</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-primary">$99.99</span>
                <span className="text-sm text-red-600">Save $50</span>
              </div>
              <p className="text-sm text-gray-600">Product description here...</p>
              <button className="w-full bg-primary text-white rounded-lg py-2 hover:bg-blue-700">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;