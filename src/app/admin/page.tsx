'use client';

import { useAdmin } from '@/context/AdminContext';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const { isAuthenticated, isCheckingAuth } = useAdmin();

  // Tampilkan loading halus saat pertama kali memvalidasi sesi cookie
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#E60067] mb-3" />
        <p className="text-xs text-stone-500 font-medium tracking-wide">
          Memeriksa sesi login...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
}
