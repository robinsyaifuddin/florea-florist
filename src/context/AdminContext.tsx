'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product, PRODUCTS } from '@/data/products';
import {
  getProducts as fetchProductsFromSupabase,
  createProduct as createProductInSupabase,
  updateProduct as updateProductInSupabase,
  deleteProduct as deleteProductInSupabase,
} from '@/lib/supabase/products';

interface AdminContextType {
  products: Product[];
  isLoading: boolean;
  isCheckingAuth: boolean;
  isAuthenticated: boolean;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  // Gunakan data awal dari PRODUCTS lokal agar saat pertama render atau klik halaman langsung instan tanpa blank/lag
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Periksa sesi login yang tersimpan di HttpOnly Cookie via server
  const checkSession = useCallback(async () => {
    try {
      setIsCheckingAuth(true);
      const res = await fetch('/api/admin/session', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(Boolean(data.authenticated));
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  // Ambil data produk terbaru di latar belakang (revalidasi tanpa memblokir UI)
  const refreshProducts = useCallback(async () => {
    try {
      const data = await fetchProductsFromSupabase();
      if (data && data.length > 0) {
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
    refreshProducts();
  }, [checkSession, refreshProducts]);

  // Login aman lewat API server
  const login = async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        return { success: true };
      }

      return {
        success: false,
        error: data.error || 'Kata sandi tidak valid. Silakan coba lagi.',
      };
    } catch {
      return {
        success: false,
        error: 'Terjadi gangguan koneksi. Silakan coba sesaat lagi.',
      };
    }
  };

  // Logout aman dengan membersihkan cookie di server
  const logout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsAuthenticated(false);
    }
  };

  // CRUD Supabase
  const addProduct = async (newProd: Omit<Product, 'id'>) => {
    try {
      const created = await createProductInSupabase(newProd);
      if (created) {
        setProducts((prev) => [created, ...prev]);
      }
    } catch (err) {
      console.error('Error adding product:', err);
      throw err;
    }
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    try {
      const updated = await updateProductInSupabase(id, updatedFields);
      if (updated) {
        setProducts((prev) =>
          prev.map((item) => (item.id === id ? updated : item))
        );
      }
    } catch (err) {
      console.error('Error updating product:', err);
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteProductInSupabase(id);
      setProducts((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      throw err;
    }
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        isLoading,
        isCheckingAuth,
        isAuthenticated,
        login,
        logout,
        addProduct,
        updateProduct,
        deleteProduct,
        refreshProducts,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
