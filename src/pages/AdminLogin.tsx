import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Shield, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Pre-defined admin credentials
const ADMIN_CREDENTIALS = {
  id: "admin@rajshree.com",
  password: "RajShree@Admin2024"
};

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    adminId: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(""); // Clear previous errors

    try {
      // Simulate login process
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Check admin credentials
      if (formData.adminId === ADMIN_CREDENTIALS.id && formData.password === ADMIN_CREDENTIALS.password) {
        toast({
          title: "Admin Login Successful!",
          description: "Welcome to RajShree Emporium Admin Panel",
        });
        
        // Store admin session (in real app, use secure storage)
        localStorage.setItem("isAdminLoggedIn", "true");
        localStorage.setItem("adminId", formData.adminId);
        
        navigate("/admin/dashboard");
      } else {
        setLoginError("Incorrect Admin ID or Password. Please try again.");
        toast({
          title: "Invalid Credentials",
          description: "Incorrect Admin ID or Password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setLoginError("Something went wrong. Please try again.");
      toast({
        title: "Login Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-elegant flex items-center justify-center p-4">
      {/* Back to Home */}
      <Button
        variant="ghost"
        className="absolute top-6 left-6"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <Shield className="text-primary-foreground w-6 h-6" />
            </div>
            <span className="heading-section text-3xl">Admin Portal</span>
          </div>
          <p className="text-elegant">Secure access to RajShree Emporium management</p>
        </div>

        <Card className="card-elegant border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-playfair flex items-center justify-center space-x-2">
              <Shield className="w-6 h-6 text-primary" />
              <span>Admin Login</span>
            </CardTitle>
            <CardDescription>
              Enter your admin credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Admin ID Field */}
              <div className="space-y-2">
                <Label htmlFor="adminId">Admin ID</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="adminId"
                    name="adminId"
                    type="text"
                    placeholder="Enter admin ID"
                    value={formData.adminId}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Admin Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {loginError && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                  <p className="font-medium">Invalid Credentials</p>
                  <p>Incorrect Admin ID or Password. Please try again.</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full btn-hero"
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Access Admin Panel"}
              </Button>
            </form>

            {/* Admin Credentials Info */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border/50">
              <h4 className="font-semibold text-sm mb-2 text-primary">Demo Admin Credentials:</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><strong>ID:</strong> admin@rajshree.com</p>
                <p><strong>Password:</strong> RajShree@Admin2024</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Login Link */}
        <div className="text-center mt-6">
          <p className="text-elegant">
            Not an admin?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary hover:text-primary-dark font-medium transition-colors"
            >
              Customer Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;