import { Heart, Star, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
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
  rating,
  reviews,
  category,
  isNew = false,
  isSale = false,
  discount,
  sizes = [],
  onClick,
}: ProductCardProps) => {
  return (
    <div className="card-product" onClick={onClick}>
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[3/4] group">
        <img
          src={image}
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
          className="absolute top-3 right-3 bg-background/80 hover:bg-background hover:text-primary transition-colors"
        >
          <Heart className="w-4 h-4" />
        </Button>

        {/* Quick Add to Cart */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button className="w-full btn-hero text-sm py-2">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Quick Add
          </Button>
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