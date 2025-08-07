import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import lehengaProduct from "@/assets/lehenga-product.jpg";
import kurtaProduct from "@/assets/kurta-product.jpg";
import sareeProduct from "@/assets/saree-product.jpg";

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  size: string;
  color?: string;
  quantity: number;
  category: string;
  inStock: boolean;
}

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Royal Red Bridal Lehenga with Heavy Embroidery",
      price: 15999,
      originalPrice: 19999,
      image: lehengaProduct,
      size: "M",
      color: "Red",
      quantity: 1,
      category: "Lehengas",
      inStock: true,
    },
    {
      id: "2",
      name: "Premium Navy Blue Kurta with Golden Work",
      price: 2499,
      originalPrice: 3499,
      image: kurtaProduct,
      size: "L",
      color: "Navy Blue",
      quantity: 2,
      category: "Kurtis",
      inStock: true,
    },
    {
      id: "3",
      name: "Luxurious Maroon Silk Saree with Golden Border",
      price: 8999,
      image: sareeProduct,
      size: "Free Size",
      quantity: 1,
      category: "Dress Materials",
      inStock: false,
    },
  ]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast({
      title: "Item Removed",
      description: "Product has been removed from your cart",
    });
  };

  const moveToWishlist = (id: string) => {
    removeItem(id);
    toast({
      title: "Moved to Wishlist",
      description: "Product has been added to your wishlist",
    });
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const originalTotal = cartItems.reduce((sum, item) => sum + ((item.originalPrice || item.price) * item.quantity), 0);
  const savings = originalTotal - subtotal;
  const shipping = subtotal > 2000 ? 0 : 199;
  const total = subtotal + shipping;

  const proceedToCheckout = () => {
    const inStockItems = cartItems.filter(item => item.inStock);
    if (inStockItems.length === 0) {
      toast({
        title: "Cannot Proceed",
        description: "Please remove out of stock items before checkout",
        variant: "destructive",
      });
      return;
    }
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="heading-section mb-4">Your Cart is Empty</h2>
            <p className="text-elegant mb-8">
              Looks like you haven't added anything to your cart yet. Explore our beautiful collection.
            </p>
            <Button onClick={() => navigate("/products")} className="btn-hero">
              Continue Shopping
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" onClick={() => navigate("/products")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
          <div>
            <h1 className="heading-section">Shopping Cart</h1>
            <p className="text-elegant">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="card-elegant">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Product Image */}
                    <div className="relative w-full sm:w-32 h-48 sm:h-32 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      {!item.inStock && (
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                          <Badge variant="destructive">Out of Stock</Badge>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                          <p className="text-muted-foreground text-sm mb-2">{item.category}</p>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                            <div>Size: <span className="text-foreground font-medium">{item.size}</span></div>
                            {item.color && (
                              <div>Color: <span className="text-foreground font-medium">{item.color}</span></div>
                            )}
                          </div>

                          {/* Price */}
                          <div className="flex items-center space-x-2 mb-4">
                            <span className="font-bold text-lg">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                            {item.originalPrice && (
                              <span className="text-muted-foreground line-through text-sm">
                                ₹{(item.originalPrice * item.quantity).toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-3">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={!item.inStock}
                                className="h-8 w-8"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="font-medium min-w-[2rem] text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={!item.inStock}
                                className="h-8 w-8"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => moveToWishlist(item.id)}
                              >
                                <Heart className="w-4 h-4 mr-1" />
                                Wishlist
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="card-elegant sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-6">Order Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  
                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Savings</span>
                      <span>-₹{savings.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600" : ""}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  
                  {shipping > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Add ₹{(2000 - subtotal).toLocaleString("en-IN")} more for free shipping
                    </p>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <Button
                  className="w-full btn-hero mt-6"
                  onClick={proceedToCheckout}
                  disabled={cartItems.every(item => !item.inStock)}
                >
                  Proceed to Checkout
                </Button>

                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <span>✓</span>
                    <span>Free returns within 7 days</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>✓</span>
                    <span>Secure payment guaranteed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>✓</span>
                    <span>COD available</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;