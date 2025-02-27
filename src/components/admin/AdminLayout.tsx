import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 min-h-screen bg-white shadow-md">
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin/products"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/admin/orders"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Orders
              </Link>
            </li>
            <li>
              <Link
                to="/admin/customers"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Customers
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout; 