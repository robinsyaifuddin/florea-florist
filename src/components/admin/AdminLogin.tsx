'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Eye, EyeOff, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

export default function AdminLogin() {
  const { login } = useAdmin();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsLoading(true);
    setErrorMsg('');

    const res = await login(password);
    if (!res.success) {
      setErrorMsg(res.error || 'Kata sandi salah. Silakan coba lagi.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="relative h-12 w-36">
              <Image
                src="/logo-transparent.png"
                alt="Florea Florist Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
          <h2 className="text-2xl font-serif font-medium text-stone-900 tracking-tight">
            Florea Admin Portal
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            Sistem autentikasi aman dengan sesi login persisten 30 hari
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
                  autoFocus
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Masukkan kata sandi admin..."
                  className="w-full pl-9 pr-10 py-2.5 text-sm rounded-lg border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-[#E60067] focus:ring-1 focus:ring-[#E60067] text-stone-900 transition placeholder:text-stone-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200/80 text-rose-700 text-xs flex items-center gap-2">
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full py-2.5 px-4 rounded-lg bg-[#E60067] hover:bg-[#CC005A] text-white text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition duration-150 active:scale-[0.98] shadow-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>{isLoading ? 'Memverifikasi...' : 'Buka Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Terlindungi dengan HttpOnly Session & Enkripsi HMAC</span>
          </div>
        </div>
      </div>
    </div>
  );
}
