'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Eye, Lock, ArrowRight } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

export default function AdminLogin() {
  const { login } = useAdmin();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const ok = login(password);
      if (!ok) {
        setErrorMsg('Kata sandi salah. Silakan masukkan kata sandi yang benar.');
      }
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="relative h-12 w-36">
              <Image
                src="/logo-transparent.png"
                alt="Floréa Florist Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
          <h2 className="text-2xl font-serif font-medium text-stone-900 tracking-tight">
            Florea Florist Admin
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            Masuk untuk mengelola katalog mahakarya buket & floral
          </p>
        </div>

        {/* Card */}
        <div className="bg-white py-8 px-6 sm:px-8 rounded-2xl border border-stone-200/80 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5"
              >
                Kunci Akses Admin
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Masukkan kata sandi..."
                  className="w-full pl-9 pr-10 py-2.5 text-sm rounded-lg border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-[#E60067] focus:ring-1 focus:ring-[#E60067] text-stone-900 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-[#E60067] hover:bg-[#CC005A] text-white text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition duration-150 active:scale-[0.98] shadow-xs cursor-pointer disabled:opacity-70"
            >
              <span>{isLoading ? 'Memverifikasi...' : 'Buka Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
