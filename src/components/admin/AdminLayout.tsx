import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNav from './AdminNav';
import AdminSidebar from './AdminSidebar';

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 