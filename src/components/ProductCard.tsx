import { Heart, Star, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";  // Add this import

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  imageData?: string; // Add this line
  rating: number;
  reviews: number;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  discount?: number;
  sizes?: string[];
  onClick?: () => void;
}

const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  image,
  imageData, // Add this line
  rating,
  reviews,
  category,
  isNew = false,
  isSale = false,
  discount,
  sizes = [],
  onClick,
}: ProductCardProps) => {
  const navigate = useNavigate();  // Add this line
  const { addToCart, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { 
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    loading: wishlistLoading 
  } = useWishlist();
  const [selectedSize, setSelectedSize] = useState(sizes[0] || '');
  const [isQuickAddLoading, setIsQuickAddLoading] = useState(false);
  const [isWishlistUpdating, setIsWishlistUpdating] = useState(false);

  const isProductInWishlist = isInWishlist(id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to add items to your cart',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedSize && sizes.length > 0) {
      toast({
        title: 'Select a size',
        description: 'Please select a size before adding to cart',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsQuickAddLoading(true);
      await addToCart(id, selectedSize, 1);
      toast({
        title: 'Added to cart',
        description: `${name} has been added to your cart`,
      });
      navigate('/cart');  // Add this line to navigate to cart after successful addition
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        variant: 'destructive',
      });
    } finally {
      setIsQuickAddLoading(false);
    }
  };

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to manage your wishlist.',
        variant: 'destructive',
      });
      return;
    }

    setIsWishlistUpdating(true);
    try {
      if (isProductInWishlist) {
        await removeFromWishlist(id);
      } else {
        await addToWishlist(id);
      }
    } finally {
      setIsWishlistUpdating(false);
    }
  };
  return (
    <div className="card-product" onClick={onClick}>
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[3/4] group">
        <img
          src={imageData || image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <Badge className="bg-secondary text-secondary-foreground font-medium">
              New
            </Badge>
          )}
          {isSale && discount && (
            <Badge className="bg-destructive text-destructive-foreground font-medium">
              {discount}% OFF
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          size="icon"
          variant="ghost"
          className={`absolute top-3 right-3 bg-background/80 hover:bg-background transition-colors ${
            isProductInWishlist ? 'text-red-500' : 'hover:text-primary'
          }`}
          onClick={handleWishlistClick}
          disabled={wishlistLoading || isWishlistUpdating}
        >
          {isWishlistUpdating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Heart className={`w-4 h-4 ${isProductInWishlist ? 'fill-red-500' : ''}`} />
          )}
        </Button>

        {/* Quick Add to Cart */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button 
            className="w-full btn-hero text-sm py-2"
            onClick={handleAddToCart}
            disabled={isQuickAddLoading || cartLoading}
          >
            {isQuickAddLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 mr-2" />
                Quick Add
              </>
            )}
          </Button>
          
          {sizes.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1 justify-center">
              {sizes.slice(0, 4).map((size) => (
                <button
                  key={size}
                  className={`text-xs px-2 py-1 rounded-md transition-colors ${
                    selectedSize === size
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                >
                  {size}
                </button>
              ))}
              {sizes.length > 4 && (
                <span className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground">
                  +{sizes.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <p className="text-sm text-muted-foreground uppercase tracking-wide">
          {category}
        </p>

        {/* Product Name */}
        <h3 className="font-semibold text-foreground leading-tight line-clamp-2">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(rating)
                    ? "text-secondary fill-secondary"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {rating} ({reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="font-bold text-lg text-foreground">
            ₹{price.toLocaleString("en-IN")}
          </span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Sizes */}
        {sizes.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Sizes:</span>
            <div className="flex space-x-1">
              {sizes.slice(0, 4).map((size) => (
                <span
                  key={size}
                  className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground"
                >
                  {size}
                </span>
              ))}
              {sizes.length > 4 && (
                <span className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground">
                  +{sizes.length - 4}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;