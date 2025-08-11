import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Admin Route Component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  // If not authenticated, redirect to the admin login page
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // If authenticated but not an admin, redirect to the homepage
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              
              <Route path="/admin/dashboard" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              
              <Route path="/products" element={<Products />} />
              
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } />
              
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />
              
              <Route path="/orders" element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } />
              
              <Route path="/orders/:id" element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              } />
              
              <Route path="/category/:category" element={<Products />} />
              <Route path="/product/:id" element={<Products />} />
              <Route path="/new-arrivals" element={<Products />} />
              <Route path="/sale" element={<Products />} />

              <Route path="/wishlist" element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              } />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
