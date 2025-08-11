import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';

// Assuming Product interface is defined elsewhere and can be imported
// For now, defining it here for clarity
interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  inStock: boolean;
}

interface WishlistContextType {
  wishlist: Product[];
  getWishlist: () => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  loading: boolean;
  error: string | null;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      getWishlist();
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated]);

  const getWishlist = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch wishlist');

      const data = await response.json();
      setWishlist(data.data.products || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      toast({ title: 'Please sign in', description: 'You need to be signed in to add items to your wishlist.', variant: 'destructive' });
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add to wishlist');
      }

      const data = await response.json();
      setWishlist(data.data.products);
      toast({ title: 'Added to wishlist', description: 'Item has been added to your wishlist.' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Could not add to wishlist.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to remove from wishlist');

      const data = await response.json();
      setWishlist(data.data.products);
      toast({ title: 'Removed from wishlist', description: 'Item has been removed from your wishlist.' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item');
      toast({ title: 'Error', description: 'Could not remove from wishlist.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item._id === productId);
  };

  const value = {
    wishlist,
    loading,
    error,
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
