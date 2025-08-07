import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CreditCard, 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  Mail, 
  ArrowLeft,
  CheckCircle2,
  Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { orderService } from "@/services/api";

// Sample cart items for testing - in a real app, you would get this from your cart state or API
const cartItems = [
  {
    id: "1",
    name: "Embroidered Silk Dress Material",
    category: "Dress Materials",
    size: "Free Size",
    color: "Maroon",
    price: 2499,
    originalPrice: 3499,
    quantity: 1,
    image: "/images/products/dress-material-1.jpg",
    inStock: true
  },
  {
    id: "2",
    name: "Designer Lehenga Choli",
    category: "Lehengas",
    size: "M",
    color: "Pink",
    price: 5999,
    originalPrice: 7999,
    quantity: 1,
    image: "/images/products/lehenga-1.jpg",
    inStock: true
  }
];

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal"
];

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "Maharashtra",
    postalCode: "",
    country: "India",
    paymentMethod: "COD",
    notes: ""
  });

  // Calculate order summary
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const originalTotal = cartItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
  const savings = originalTotal - subtotal;
  const shipping = subtotal > 2000 ? 0 : 199;
  const total = subtotal + shipping;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle radio changes
  const handleRadioChange = (value) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: value
    }));
  };

  // Form validation
  const validateForm = () => {
    // Required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'street', 'city', 'state', 'postalCode'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast({
          title: "Missing Information",
          description: `Please fill in all required fields.`,
          variant: "destructive",
        });
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    // Phone validation (basic)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return false;
    }

    // Postal code validation (for India)
    const postalCodeRegex = /^[0-9]{6}$/;
    if (!postalCodeRegex.test(formData.postalCode)) {
      toast({
        title: "Invalid Postal Code",
        description: "Please enter a valid 6-digit postal code.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  // Update the handleSubmit function in Checkout.tsx (around line 150)
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
  
    setIsLoading(true);
  
    try {
      // Prepare order data
      const orderData = {
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      };
  
      // Call the API to create the order
      const response = await orderService.createOrder(orderData);
      
      // Set the order ID from the response
      setOrderId(response.data.data._id);
      setOrderPlaced(true);
      
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${response.data.data._id} has been placed.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If order is placed, show success screen
  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto text-center py-12">
            <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-green-600 w-10 h-10" />
            </div>
            
            <h1 className="text-3xl font-semibold mb-4">Order Placed Successfully!</h1>
            <p className="text-muted-foreground mb-6">Thank you for your purchase. Your order has been received.</p>
            
            <div className="bg-muted/50 rounded-lg p-6 mb-8">
              <h2 className="font-medium mb-4">Order Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-left">Order Number:</div>
                <div className="text-right font-medium">{orderId}</div>
                
                <div className="text-left">Date:</div>
                <div className="text-right">{new Date().toLocaleDateString()}</div>
                
                <div className="text-left">Total Amount:</div>
                <div className="text-right">₹{total.toLocaleString("en-IN")}</div>
                
                <div className="text-left">Payment Method:</div>
                <div className="text-right">{formData.paymentMethod}</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Button>
              
              // Update the button in the success screen (around line 190)
              
              <Button 
                className="btn-hero flex items-center gap-2"
                onClick={() => navigate(`/orders/${orderId}`)}
              >
                Track Order
              </Button>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2"
            onClick={() => navigate("/cart")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Button>
        </div>

        <h1 className="text-3xl font-semibold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Contact Information */}
              <Card className="card-elegant mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Contact Information
                  </CardTitle>
                  <CardDescription>
                    We'll use these details to keep you informed about your order
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input 
                        id="firstName" 
                        name="firstName" 
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input 
                        id="lastName" 
                        name="lastName" 
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        type="tel" 
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="card-elegant mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Shipping Address
                  </CardTitle>
                  <CardDescription>
                    Where should we deliver your order?
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address *</Label>
                    <Input 
                      id="street" 
                      name="street" 
                      value={formData.street}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input 
                        id="city" 
                        name="city" 
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Select 
                        value={formData.state} 
                        onValueChange={(value) => handleSelectChange("state", value)}
                      >
                        <SelectTrigger id="state">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {indianStates.map(state => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input 
                        id="postalCode" 
                        name="postalCode" 
                        value={formData.postalCode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input 
                        id="country" 
                        name="country" 
                        value={formData.country}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Order Notes (Optional)</Label>
                    <Textarea 
                      id="notes" 
                      name="notes" 
                      placeholder="Special instructions for delivery or any other notes"
                      value={formData.notes}
                      onChange={handleChange}
                      className="resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="card-elegant mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>
                    Choose how you'd like to pay
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    defaultValue="COD" 
                    value={formData.paymentMethod}
                    onValueChange={handleRadioChange}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="COD" id="payment-cod" />
                      <Label htmlFor="payment-cod" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Truck className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Cash on Delivery</div>
                            <div className="text-sm text-muted-foreground">Pay when you receive your order</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="Card" id="payment-card" />
                      <Label htmlFor="payment-card" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Credit/Debit Card</div>
                            <div className="text-sm text-muted-foreground">Pay securely with your card</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="UPI" id="payment-upi" />
                      <Label htmlFor="payment-upi" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Wallet className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">UPI</div>
                            <div className="text-sm text-muted-foreground">Pay using UPI apps like Google Pay, PhonePe, etc.</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="card-elegant sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.co/100x100/f5f5f5/666666?text=Product";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.size} | Qty: {item.quantity}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-medium">₹{item.price.toLocaleString("en-IN")}</span>
                          {item.originalPrice > item.price && (
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{item.originalPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
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
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <Button
                  className="w-full btn-hero mt-6"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : `Place Order - ₹${total.toLocaleString("en-IN")}`}
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
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;