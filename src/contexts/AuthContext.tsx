import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.login({ email, password });
      
      // Store the token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setToken(response.data.token);
      setUser(response.data.user);
      
      toast({
        title: "Login Successful",
        description: "Welcome back to RajShree Emporium",
      });
      
      navigate('/');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.adminLogin({ email, password });
      
      // Verify the user is an admin
      if (response.data.user.role !== 'admin') {
        throw new Error('Not authorized as admin');
      }
      
      // Store the token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setToken(response.data.token);
      setUser(response.data.user);
      
      toast({
        title: "Admin Login Successful",
        description: "Welcome to the admin dashboard",
      });
      
      navigate('/admin/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Admin login failed";
      setError(errorMessage);
      toast({
        title: "Admin Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Reset state
    setToken(null);
    setUser(null);
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    
    navigate('/login');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
    isLoading,
    error,
    login,
    adminLogin,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
