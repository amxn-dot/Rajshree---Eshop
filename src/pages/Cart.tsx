import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast"; // Change from "@/components/ui/use-toast"
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Helper type to check if product is a Product object
const isProduct = (product: any): product is Product => {
  return product && typeof product === 'object' && 'name' in product;
};

// Helper function to safely get product property
const getProductProperty = <T,>(product: string | Product, prop: keyof Product, defaultValue: T): T => {
  return isProduct(product) ? (product[prop] as T) : defaultValue;
};

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
  size: string;
  quantity: number;
}

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { 
    cart: cartItems, 
    loading, 
    error,
    getCart, 
    updateCartItem, 
    removeFromCart, 
    clearCart 
  } = useCart();
  
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const [isRemoving, setIsRemoving] = useState<Record<string, boolean>>({});

  // Fetch cart on component mount
  useEffect(() => {
    if (isAuthenticated) {
      getCart();
    }
  }, [isAuthenticated, getCart]);

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await handleRemoveItem(id);
      return;
    }
    
    try {
      setIsUpdating(prev => ({ ...prev, [id]: true }));
      await updateCartItem(id, { quantity: newQuantity });
      toast({
        title: "Cart Updated",
        description: "Your cart has been updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update cart item",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      setIsRemoving(prev => ({ ...prev, [id]: true }));
      await removeFromCart(id);
      toast({
        title: "Item Removed",
        description: "Product has been removed from your cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    } finally {
      setIsRemoving(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleMoveToWishlist = async (id: string) => {
    // For now, just remove from cart
    // In a real app, you would add to wishlist here
    await handleRemoveItem(id);
    toast({
      title: "Moved to Wishlist",
      description: "Product has been added to your wishlist",
    });
  };

  const handleCheckout = () => {
    proceedToCheckout();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Sign in to view your cart and start shopping</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button variant="outline" onClick={() => navigate('/products')}>
                Continue Shopping
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading && cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error loading your cart</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={getCart}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const price = getProductProperty(item.product, 'price', 0);
    return sum + (price * item.quantity);
  }, 0);
  
  const originalTotal = cartItems.reduce((sum, item) => {
    const price = getProductProperty(item.product, 'originalPrice', getProductProperty(item.product, 'price', 0));
    return sum + (price * item.quantity);
  }, 0);
  
  const savings = originalTotal - subtotal;
  const shipping = subtotal > 2000 ? 0 : 199;
  const total = subtotal + shipping;

  const proceedToCheckout = () => {
    const inStockItems = cartItems.filter(item => getProductProperty(item.product, 'inStock', true));
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
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4 mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Button>
            <h1 className="text-2xl font-bold ml-4">Your Cart ({cartItems.length})</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                    <p className="text-muted-foreground mb-6">
                      Looks like you haven't added anything to your cart yet.
                    </p>
                    <Button onClick={() => navigate('/products')}>
                      Continue Shopping
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                cartItems.map((item) => (
                  <Card key={item._id}>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <img 
                          src={getProductProperty(item.product, 'images', ['/placeholder.jpg'])[0] || '/placeholder.jpg'}
                          alt={getProductProperty(item.product, 'name', 'Product Image')}
                          className="w-20 h-24 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <Link 
                            to={`/product/${getProductProperty(item.product, '_id', '')}`}
                            className="font-semibold hover:text-primary transition-colors"
                          >
                            {getProductProperty(item.product, 'name', 'Product Name Not Available')}
                          </Link>
                          <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                          <p className="text-sm font-medium mt-1">
                            ₹{getProductProperty(item.product, 'price', 0).toLocaleString()}
                          </p>
                          {!isProduct(item.product) && 
                            <p className="text-xs text-red-500">Product details missing</p>
                          }
                          {!getProductProperty(item.product, 'inStock', true) && (
                            <Badge variant="destructive" className="mt-2">
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                            disabled={isUpdating[item._id] || item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {isUpdating[item._id] ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                            disabled={isUpdating[item._id]}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleRemoveItem(item._id)}
                          disabled={isRemoving[item._id]}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    
                    {savings > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>You Save</span>
                        <span>-₹{savings.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-6"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={loading}
                  >
                    Proceed to Checkout
                  </Button>
                  
                  {cartItems.length > 0 && (
                    <Button 
                      variant="outline" 
                      className="w-full mt-2"
                      onClick={() => handleMoveToWishlist(cartItems[0]._id)}
                      disabled={isRemoving[cartItems[0]._id]}
                    >
                      {isRemoving[cartItems[0]._id] ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Heart className="mr-2 h-4 w-4" />
                      )}
                      Move to Wishlist
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium mb-3">Delivery Options</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Standard Delivery</span>
                      <span className="text-sm font-medium">3-5 business days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Express Delivery</span>
                      <span className="text-sm font-medium">1-2 business days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-sm text-muted-foreground">
                <p className="mb-2">Need help? Contact our support team 24/7</p>
                <p>Email: support@rajshreeethos.com</p>
                <p>Phone: +91 1234567890</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;