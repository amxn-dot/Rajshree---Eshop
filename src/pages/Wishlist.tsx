import { useEffect } from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingBag, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

const Wishlist = () => {
  const { wishlist, loading, getWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    getWishlist();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">My Wishlist</h1>
          
          {wishlist.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Your wishlist is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Explore our products and add your favorite items to your wishlist.
                </p>
                <Button onClick={() => navigate('/products')}>Discover Products</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  image={product.images[0]}
                  rating={4.5} // Dummy data, replace with actual if available
                  reviews={120} // Dummy data
                  category={product.category}
                  sizes={['S', 'M', 'L', 'XL']} // Dummy data
                  onClick={() => navigate(`/product/${product._id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
