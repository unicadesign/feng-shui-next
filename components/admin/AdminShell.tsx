'use client';

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

interface AdminShellProps {
  children: React.ReactNode;
}

const AdminShell: React.FC<AdminShellProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:hidden bg-cream-50 border-b border-sand-200 p-4 flex items-center gap-3 sticky top-0 z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-xl hover:bg-sand-200 transition-colors text-charcoal"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-heading text-charcoal text-lg">Admin</span>
      </div>

      <div className="lg:ml-60 min-h-screen p-6 lg:p-8">{children}</div>
    </div>
  );
};

export default AdminShell;
