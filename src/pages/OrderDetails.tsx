import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle2, 
  MapPin, 
  CreditCard,
  AlertCircle,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { orderService } from "@/services/api";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        const response = await orderService.getOrder(id);
        setOrder(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch order details");
        toast({
          title: "Error",
          description: err.response?.data?.message || "Failed to fetch order details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id, toast]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // Get status step
  const getStatusStep = (status) => {
    switch (status) {
      case 'Processing': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      case 'Cancelled': return -1;
      default: return 0;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="flex items-center gap-2"
              onClick={() => navigate("/orders")}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </Button>
          </div>
          
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6 flex items-center gap-4">
              <AlertCircle className="text-red-500 w-6 h-6" />
              <p className="text-red-700">{error || "Order not found"}</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const statusStep = getStatusStep(order.status);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2"
            onClick={() => navigate("/orders")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl font-semibold">Order #{order._id}</h1>
                    <p className="text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'Processing' ? 'text-blue-600 bg-blue-50' :
                      order.status === 'Shipped' ? 'text-amber-600 bg-amber-50' :
                      order.status === 'Delivered' ? 'text-green-600 bg-green-50' :
                      'text-red-600 bg-red-50'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Timeline */}
                {statusStep !== -1 && (
                  <div className="mt-8">
                    <div className="relative">
                      {/* Progress Bar */}
                      <div className="absolute top-5 left-0 right-0 h-1 bg-muted">
                        <div 
                          className="h-1 bg-primary transition-all" 
                          style={{ width: `${Math.max(0, (statusStep - 1) * 50)}%` }}
                        ></div>
                      </div>
                      
                      {/* Steps */}
                      <div className="flex justify-between relative">
                        {/* Processing */}
                        <div className="text-center">
                          <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
                            statusStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          }`}>
                            <Package className="w-5 h-5" />
                          </div>
                          <p className="mt-2 text-sm font-medium">Processing</p>
                          {order.createdAt && (
                            <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                          )}
                        </div>
                        
                        {/* Shipped */}
                        <div className="text-center">
                          <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
                            statusStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          }`}>
                            <Truck className="w-5 h-5" />
                          </div>
                          <p className="mt-2 text-sm font-medium">Shipped</p>
                          {statusStep >= 2 && (
                            <p className="text-xs text-muted-foreground">{formatDate(order.updatedAt)}</p>
                          )}
                        </div>
                        
                        {/* Delivered */}
                        <div className="text-center">
                          <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
                            statusStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          }`}>
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <p className="mt-2 text-sm font-medium">Delivered</p>
                          {order.deliveredAt && (
                            <p className="text-xs text-muted-foreground">{formatDate(order.deliveredAt)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Cancelled Order */}
                {statusStep === -1 && (
                  <div className="mt-6 bg-red-50 border border-red-100 rounded-lg p-4 flex items-center gap-3">
                    <Clock className="text-red-500 w-5 h-5" />
                    <div>
                      <p className="font-medium text-red-700">Order Cancelled</p>
                      <p className="text-sm text-red-600">This order has been cancelled.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex gap-4 pb-4 border-b last:border-0">
                      <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://placehold.co/100x100/f5f5f5/666666?text=Product";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.size && `Size: ${item.size} | `}Qty: {item.quantity}
                        </p>
                        <p className="font-medium mt-1">₹{item.price.toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping & Payment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">Shipping Address</h2>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Payment Method */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">Payment Method</h2>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p>{order.paymentMethod}</p>
                    <p className="text-muted-foreground">
                      {order.isPaid ? 
                        `Paid on ${formatDate(order.paidAt)}` : 
                        order.paymentMethod === 'COD' ? 
                          'Payment will be collected on delivery' : 
                          'Payment pending'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({order.items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>₹{(order.totalPrice - (order.totalPrice > 2000 ? 0 : 199)).toLocaleString("en-IN")}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={order.totalPrice > 2000 ? "text-green-600" : ""}>
                      {order.totalPrice > 2000 ? "FREE" : `₹199`}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{order.totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                  <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <span>✓</span>
                      <span>Free returns within 7 days</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>✓</span>
                      <span>Secure payment guaranteed</span>
                    </div>
                    {order.paymentMethod === 'COD' && (
                      <div className="flex items-center space-x-2">
                        <span>✓</span>
                        <span>Cash on delivery available</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderDetails;