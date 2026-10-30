'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product, PRODUCTS } from '@/data/products';
import {
  getProducts as fetchProductsFromSupabase,
  createProduct as createProductInSupabase,
  updateProduct as updateProductInSupabase,
  deleteProduct as deleteProductInSupabase,
  mapSupabaseToProduct,
} from '@/lib/supabase/products';
import { createClient } from '@/lib/supabase/client';

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

export function AdminProvider({
  children,
  initialProducts = [],
}: {
  children: ReactNode;
  initialProducts?: Product[];
}) {
  // Inisialisasi awal produk: Prioritas 1 Server SSR, Prioritas 2 LocalStorage SWR
  const [products, setProducts] = useState<Product[]>(() => {
    if (initialProducts && initialProducts.length > 0) {
      return initialProducts;
    }
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('florea_cached_products');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // Abaikan kegagalan baca cache
      }
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    // Jika server SSR sudah memasok produk, tidak perlu loading
    if (initialProducts && initialProducts.length > 0) {
      return false;
    }
    // Jika di browser ada cache localStorage yang valid, tidak perlu loading
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('florea_cached_products');
        if (cached && JSON.parse(cached).length > 0) {
          return false;
        }
      } catch {}
    }
    // Jika belum ada data sama sekali, tampilkan loading skeleton
    return true;
  });

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

  // Helper sinkronisasi ke localStorage
  const syncToCache = (data: Product[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('florea_cached_products', JSON.stringify(data));
      } catch {
        // Abaikan kuota limit
      }
    }
  };

  // Ambil data produk terbaru dari database Supabase (background revalidate)
  const refreshProducts = useCallback(async () => {
    try {
      const data = await fetchProductsFromSupabase();
      if (data) {
        setProducts(data);
        syncToCache(data);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Jika data dari server sudah ada, sinkronkan ke local cache
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
      syncToCache(initialProducts);
    }
  }, [initialProducts]);

  useEffect(() => {
    checkSession();
    // Hanya re-fetch dari background jika belum ada data initial
    if (!initialProducts || initialProducts.length === 0) {
      refreshProducts();
    }
  }, [checkSession, refreshProducts, initialProducts]);

  // Real-time synchronization via Supabase Realtime & Cross-tab BroadcastChannel
  useEffect(() => {
    // 1. Cross-tab Broadcast Channel (Sinkronisasi instan antar tab di browser yang sama tanpa jeda jaringan)
    let channel: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      channel = new BroadcastChannel('florea_products_sync');
      channel.onmessage = (event) => {
        if (!event.data) return;
        const { type, payload } = event.data;
        if (type === 'ADD' && payload) {
          setProducts((prev) => {
            const next = [payload, ...prev.filter((p) => p.id !== payload.id)];
            syncToCache(next);
            return next;
          });
        } else if (type === 'UPDATE' && payload) {
          setProducts((prev) => {
            const next = prev.map((item) => (item.id === payload.id ? { ...item, ...payload } : item));
            syncToCache(next);
            return next;
          });
        } else if (type === 'DELETE' && payload?.id) {
          setProducts((prev) => {
            const next = prev.filter((item) => item.id !== payload.id);
            syncToCache(next);
            return next;
          });
        } else if (type === 'REFRESH') {
          refreshProducts();
        }
      };
    }

    // 2. Supabase Realtime Subscription (Sinkronisasi lintas device/browser)
    const supabase = createClient();
    const realtimeSubscription = supabase
      .channel('realtime_products_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newProduct = mapSupabaseToProduct(payload.new);
            setProducts((prev) => {
              const next = [newProduct, ...prev.filter((p) => p.id !== newProduct.id)];
              syncToCache(next);
              return next;
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedProduct = mapSupabaseToProduct(payload.new);
            setProducts((prev) => {
              const next = prev.map((item) => (item.id === updatedProduct.id ? updatedProduct : item));
              syncToCache(next);
              return next;
            });
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old?.id;
            if (deletedId) {
              setProducts((prev) => {
                const next = prev.filter((item) => item.id !== deletedId);
                syncToCache(next);
                return next;
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      if (channel) {
        channel.close();
      }
      supabase.removeChannel(realtimeSubscription);
    };
  }, [refreshProducts]);

  // Helper untuk broadcast ke tab lain
  const notifyBroadcast = (type: 'ADD' | 'UPDATE' | 'DELETE' | 'REFRESH', payload?: any) => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const bc = new BroadcastChannel('florea_products_sync');
        bc.postMessage({ type, payload });
        bc.close();
      } catch {
        // Abaikan error broadcast channel jika tidak didukung
      }
    }
  };

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

  // CRUD Supabase dengan update state lokal instan + sinkronisasi broadcast tab
  const addProduct = async (newProd: Omit<Product, 'id'>) => {
    try {
      const created = await createProductInSupabase(newProd);
      if (created) {
        setProducts((prev) => {
          const next = [created, ...prev.filter((p) => p.id !== created.id)];
          syncToCache(next);
          return next;
        });
        notifyBroadcast('ADD', created);
      }
    } catch (err) {
      console.error('Error adding product:', err);
      throw err;
    }
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    // 1. Optimistic Update instan di antarmuka (0 latency)
    setProducts((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item));
      syncToCache(next);
      return next;
    });

    try {
      const updated = await updateProductInSupabase(id, updatedFields);
      if (updated) {
        setProducts((prev) => {
          const next = prev.map((item) => (item.id === id ? updated : item));
          syncToCache(next);
          return next;
        });
        notifyBroadcast('UPDATE', updated);
      }
    } catch (err) {
      // Revert bila terjadi kegagalan jaringan
      refreshProducts();
      console.error('Error updating product:', err);
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    // Optimistic Delete instan
    setProducts((prev) => {
      const next = prev.filter((item) => item.id !== id);
      syncToCache(next);
      return next;
    });

    try {
      await deleteProductInSupabase(id);
      notifyBroadcast('DELETE', { id });
    } catch (err) {
      refreshProducts();
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
