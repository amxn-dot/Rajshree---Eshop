import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  inStock: boolean;
}

interface CartItem {
  _id: string;
  product: Product | string;
  quantity: number;
  size: string;
}

interface CartContextType {
  cart: CartItem[];
  getCart: () => Promise<void>;
  addToCart: (productId: string, size: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateCartItem: (itemId: string, updates: { quantity?: number; size?: string }) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { isAuthenticated, token } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!token) {
      setCart([]);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      
      const data = await response.json();
      setCart(data.data?.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [isAuthenticated, fetchCart]);

  const addToCart = useCallback(async (productId: string, size: string, quantity: number = 1) => {
    if (!isAuthenticated || !token) return;

    try {
      setLoading(true);
      await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, size, quantity }),
      });
      await fetchCart();
      toast({ title: 'Added to cart' });
    } catch (err) {
      toast({ title: 'Error adding to cart', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, fetchCart, toast]);

  const removeFromCart = useCallback(async (itemId: string) => {
    if (!token) return;
    try {
      setLoading(true);
      await fetch(`http://localhost:5000/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      await fetchCart();
      toast({ title: 'Removed from cart' });
    } catch (err) {
      toast({ title: 'Error removing from cart', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [token, fetchCart, toast]);

  const updateCartItem = useCallback(async (itemId: string, updates: { quantity?: number; size?: string }) => {
    if (!token) return;
    try {
      setLoading(true);
      await fetch(`http://localhost:5000/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      await fetchCart();
      toast({ title: 'Cart updated' });
    } catch (err) {
      toast({ title: 'Error updating cart', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [token, fetchCart, toast]);

  const clearCart = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      await fetch('http://localhost:5000/api/cart', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setCart([]);
      toast({ title: 'Cart cleared' });
    } catch (err) {
      toast({ title: 'Error clearing cart', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  const value = {
    cart,
    loading,
    error,
    getCart: fetchCart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
