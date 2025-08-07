import { ChangeEvent, useEffect, useState, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Trash2, Plus, Package, Search, ShoppingBag, Users, Link, Upload } from "lucide-react";
import lehengaProduct from "@/assets/lehenga-product.jpg";
import kurtaProduct from "@/assets/kurta-product.jpg";
import sareeProduct from "@/assets/saree-product.jpg";

// Product interface
interface Product {
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
  inventory: number;
  description?: string;
}

import { productService } from "@/services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [imageInputType, setImageInputType] = useState<"url" | "upload">("url");
  const [editImageInputType, setEditImageInputType] = useState<"url" | "upload">("url");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    price: 0,
    originalPrice: 0,
    category: "",
    inventory: 0,
    sizes: [],
    description: "",
    image: "",
  });

  // Sample categories
  const categories = ["Dress Materials", "Lehengas", "Kurtis", "Suits Pieces"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];

  // Sample product data
  const sampleProducts: Product[] = [
    {
      id: "1",
      name: "Luxurious Maroon Silk Saree with Golden Border",
      price: 8999,
      image: sareeProduct,
      rating: 4.9,
      reviews: 156,
      category: "Dress Materials",
      isNew: true,
      sizes: ["Free Size"],
      inventory: 25,
      description: "Elegant silk saree with intricate golden border work, perfect for special occasions."
    },
    {
      id: "4",
      name: "Royal Red Bridal Lehenga with Heavy Embroidery",
      price: 15999,
      originalPrice: 19999,
      image: lehengaProduct,
      rating: 4.8,
      reviews: 124,
      category: "Lehengas",
      isSale: true,
      discount: 20,
      sizes: ["S", "M", "L", "XL", "XXL"],
      inventory: 12,
      description: "Stunning bridal lehenga with heavy embroidery and stone work, perfect for wedding ceremonies."
    },
    {
      id: "7",
      name: "Premium Navy Blue Kurta with Golden Work",
      price: 2499,
      originalPrice: 3499,
      image: kurtaProduct,
      rating: 4.6,
      reviews: 89,
      category: "Kurtis",
      isSale: true,
      discount: 29,
      sizes: ["S", "M", "L", "XL"],
      inventory: 45,
      description: "Premium quality cotton kurta with golden embroidery work, suitable for festive occasions."
    },
  ];

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    if (!token || user.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "Please login as admin to access this page.",
        variant: "destructive",
      });
      navigate("/admin/login");
    }

    // Load products from API
    const fetchProducts = async () => {
      try {
        const response = await productService.getProducts();
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        // Fallback to localStorage if API fails
        const savedProducts = localStorage.getItem("products");
        if (savedProducts) {
          setProducts(JSON.parse(savedProducts));
        } else {
          setProducts(sampleProducts);
        }
      }
    };

    fetchProducts();
  }, [navigate, toast]);

  const handleAddProduct = async () => {
    try {
      // Handle image upload if it's a file
      let imageUrl = newProduct.image;
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadResponse = await productService.uploadProductImage(formData);
        imageUrl = uploadResponse.data.imageUrl;
      }

      // Create the new product object
      const productToAdd = {
        name: newProduct.name || "",
        price: newProduct.price || 0,
        originalPrice: newProduct.originalPrice,
        image: imageUrl,
        category: newProduct.category || "Dress Materials",
        sizes: newProduct.sizes || ["Free Size"],
        inventory: newProduct.inventory || 0,
        description: newProduct.description,
      };
      
      // Send to API
      const response = await productService.createProduct(productToAdd);
      
      // Update local state
      setProducts([...products, response.data.data]);
      
      // Reset form and close dialog
      setNewProduct({
        name: "",
        price: 0,
        originalPrice: 0,
        category: "",
        inventory: 0,
        sizes: [],
        description: "",
      });
      setIsAddProductOpen(false);
      
      toast({
        title: "Product Added",
        description: `${response.data.data.name} has been added successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error Adding Product",
        description: error.response?.data?.message || "Failed to add product.",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      // Handle image upload if it's a file
      let imageUrl = selectedProduct.image;
      if (editImageFile) {
        const formData = new FormData();
        formData.append('image', editImageFile);
        const uploadResponse = await productService.uploadProductImage(formData);
        imageUrl = uploadResponse.data.imageUrl;
      }

      // Update the product with new image if uploaded
      const productToUpdate = {
        ...selectedProduct,
        image: imageUrl
      };
      
      // Send to API
      const response = await productService.updateProduct(selectedProduct.id, productToUpdate);
      
      // Update local state
      const updatedProducts = products.map(product => 
        product.id === selectedProduct.id ? response.data.data : product
      );
      
      setProducts(updatedProducts);
      setIsEditProductOpen(false);
      
      toast({
        title: "Product Updated",
        description: `${response.data.data.name} has been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error Updating Product",
        description: error.response?.data?.message || "Failed to update product.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await productService.deleteProduct(id);
      
      // Update local state
      const updatedProducts = products.filter(product => product.id !== id);
      setProducts(updatedProducts);
      
      toast({
        title: "Product Deleted",
        description: `Product has been deleted successfully.`,
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Error Deleting Product",
        description: error.response?.data?.message || "Failed to delete product.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateInventory = (id: string, newInventory: number) => {
    const updatedProducts = products.map(product => 
      product.id === id ? { ...product, inventory: newInventory } : product
    );
    
    setProducts(updatedProducts);
    
    // Save to localStorage - THIS LINE WAS MISSING
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    
    toast({
      title: "Inventory Updated",
      description: `Inventory has been updated successfully.`,
    });
  };

  const handleSizeToggle = (size: string, isChecked: boolean, isNewProduct: boolean = true) => {
    if (isNewProduct) {
      // For new product
      const currentSizes = newProduct.sizes || [];
      if (isChecked) {
        setNewProduct({ ...newProduct, sizes: [...currentSizes, size] });
      } else {
        setNewProduct({ 
          ...newProduct, 
          sizes: currentSizes.filter(s => s !== size) 
        });
      }
    } else {
      // For editing existing product
      if (!selectedProduct) return;
      
      const currentSizes = selectedProduct.sizes || [];
      if (isChecked) {
        setSelectedProduct({ 
          ...selectedProduct, 
          sizes: [...currentSizes, size] 
        });
      } else {
        setSelectedProduct({ 
          ...selectedProduct, 
          sizes: currentSizes.filter(s => s !== size) 
        });
      }
    }
  };

  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleFileUpload(e: ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    // Set the file state based on which dialog is open
    if (isEditProductOpen) {
      setEditImageFile(file);
    } else {
      setImageFile(file);
    }
    
    // Create a URL for the file
    const imageUrl = URL.createObjectURL(file);
    
    // Convert image to base64 for storage
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      
      // Update the product state with the base64 image
      if (isEditProductOpen && selectedProduct) {
        setSelectedProduct({ ...selectedProduct, image: base64String });
      } else {
        setNewProduct({ ...newProduct, image: base64String });
      }
    };
    reader.readAsDataURL(file);
    
    // Also set the URL for immediate preview
    if (isEditProductOpen && selectedProduct) {
      setSelectedProduct({ ...selectedProduct, image: imageUrl });
    } else {
      setNewProduct({ ...newProduct, image: imageUrl });
    }
  }

  function handleLogout(event: MouseEvent<HTMLButtonElement>): void {
    // Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Show success message
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    
    // Redirect to admin login page
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gradient-elegant p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-playfair">Admin Dashboard</h1>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Customers
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Orders</h2>
                <p className="text-3xl font-bold">24</p>
                <p className="text-muted-foreground">Total orders</p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Products</h2>
                <p className="text-3xl font-bold">{products.length}</p>
                <p className="text-muted-foreground">Total products</p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Customers</h2>
                <p className="text-3xl font-bold">89</p>
                <p className="text-muted-foreground">Registered users</p>
              </div>
            </div>
            
            <div className="mt-8 bg-card p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Order ID</th>
                      <th className="text-left py-3">Customer</th>
                      <th className="text-left py-3">Date</th>
                      <th className="text-left py-3">Amount</th>
                      <th className="text-left py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3">#ORD-001</td>
                      <td className="py-3">Priya Sharma</td>
                      <td className="py-3">2023-06-15</td>
                      <td className="py-3">₹4,599</td>
                      <td className="py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Delivered</span></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">#ORD-002</td>
                      <td className="py-3">Rahul Patel</td>
                      <td className="py-3">2023-06-14</td>
                      <td className="py-3">₹2,899</td>
                      <td className="py-3"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Shipped</span></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">#ORD-003</td>
                      <td className="py-3">Ananya Singh</td>
                      <td className="py-3">2023-06-13</td>
                      <td className="py-3">₹7,299</td>
                      <td className="py-3"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Processing</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-hero">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                      Fill in the details to add a new product to your inventory.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input 
                          id="name" 
                          value={newProduct.name} 
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                          placeholder="Enter product name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select 
                          value={newProduct.category} 
                          onValueChange={(value) => setNewProduct({...newProduct, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Image Upload/URL Section */}
                    <div className="space-y-2">
                      <Label>Product Image</Label>
                      <div className="flex space-x-2 mb-2">
                        <Button 
                          type="button" 
                          variant={imageInputType === "url" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setImageInputType("url")}
                        >
                          <Link className="w-4 h-4 mr-2" />
                          Image URL
                        </Button>
                        <Button 
                          type="button" 
                          variant={imageInputType === "upload" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setImageInputType("upload")}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Image
                        </Button>
                      </div>
                      
                      {imageInputType === "url" ? (
                        <div className="space-y-2">
                          <Input 
                            id="imageUrl" 
                            value={newProduct.image || ""} 
                            onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                            placeholder="Enter image URL"
                          />
                          {newProduct.image && (
                            <div className="mt-2">
                              <p className="text-sm mb-1">Preview:</p>
                              <div className="w-20 h-20 rounded-md overflow-hidden border">
                                <img 
                                  src={newProduct.image} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/%3E%3C/svg%3E";
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Input 
                            id="imageUpload" 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e)}
                          />
                          {newProduct.image && (
                            <div className="mt-2">
                              <p className="text-sm mb-1">Preview:</p>
                              <div className="w-20 h-20 rounded-md overflow-hidden border">
                                <img 
                                  src={newProduct.image} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover" 
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (₹)</Label>
                        <Input 
                          id="price" 
                          type="number" 
                          value={newProduct.price} 
                          onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                          placeholder="Enter price"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="originalPrice">Original Price (₹)</Label>
                        <Input 
                          id="originalPrice" 
                          type="number" 
                          value={newProduct.originalPrice} 
                          onChange={(e) => setNewProduct({...newProduct, originalPrice: Number(e.target.value)})}
                          placeholder="Enter original price"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="inventory">Inventory</Label>
                      <Input 
                        id="inventory" 
                        type="number" 
                        value={newProduct.inventory} 
                        onChange={(e) => setNewProduct({...newProduct, inventory: Number(e.target.value)})}
                        placeholder="Enter inventory count"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Available Sizes</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {sizes.map(size => (
                          <div key={size} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`size-${size}`} 
                              checked={newProduct.sizes?.includes(size)}
                              onCheckedChange={(checked) => handleSizeToggle(size, checked as boolean)}
                            />
                            <Label htmlFor={`size-${size}`} className="text-sm">{size}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <textarea 
                        id="description" 
                        className="w-full min-h-[100px] p-2 border rounded-md" 
                        value={newProduct.description} 
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        placeholder="Enter product description"
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddProduct}>Add Product</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="bg-card rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left py-3 px-4">Product</th>
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-left py-3 px-4">Price</th>
                      <th className="text-left py-3 px-4">Inventory</th>
                      <th className="text-center py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(product => (
                        <tr key={product.id} className="border-t hover:bg-muted/30">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 rounded-md overflow-hidden">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="truncate max-w-[200px]">
                                <p className="font-medium truncate">{product.name}</p>
                                <p className="text-xs text-muted-foreground">{product.sizes?.join(", ")}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">{product.category}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">₹{product.price.toLocaleString("en-IN")}</span>
                              {product.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ₹{product.originalPrice.toLocaleString("en-IN")}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <Input 
                                type="number" 
                                className="w-20 h-8" 
                                value={product.inventory} 
                                onChange={(e) => handleUpdateInventory(product.id, Number(e.target.value))}
                              />
                              <span className={`text-sm ${product.inventory < 10 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                {product.inventory < 10 ? 'Low stock' : 'In stock'}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex justify-center space-x-2">
                              <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setSelectedProduct(product)}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[550px]">
                                  {/* Inside the Edit Product Dialog */}
                                  {selectedProduct && (
                                    <>
                                      <DialogHeader>
                                        <DialogTitle>Edit Product</DialogTitle>
                                        <DialogDescription>
                                          Update the details of your product.
                                        </DialogDescription>
                                      </DialogHeader>
                                      
                                      <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                            <Label htmlFor="edit-name">Product Name</Label>
                                            <Input 
                                              id="edit-name" 
                                              value={selectedProduct.name} 
                                              onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})}
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <Label htmlFor="edit-category">Category</Label>
                                            <Select 
                                              value={selectedProduct.category} 
                                              onValueChange={(value) => setSelectedProduct({...selectedProduct, category: value})}
                                            >
                                              <SelectTrigger>
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {categories.map(category => (
                                                  <SelectItem key={category} value={category}>{category}</SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                            <Label htmlFor="edit-price">Price (₹)</Label>
                                            <Input 
                                              id="edit-price" 
                                              type="number" 
                                              value={selectedProduct.price} 
                                              onChange={(e) => setSelectedProduct({...selectedProduct, price: Number(e.target.value)})}
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <Label htmlFor="edit-originalPrice">Original Price (₹)</Label>
                                            <Input 
                                              id="edit-originalPrice" 
                                              type="number" 
                                              value={selectedProduct.originalPrice || 0} 
                                              onChange={(e) => setSelectedProduct({...selectedProduct, originalPrice: Number(e.target.value)})}
                                            />
                                          </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-inventory">Inventory</Label>
                                          <Input 
                                            id="edit-inventory" 
                                            type="number" 
                                            value={selectedProduct.inventory} 
                                            onChange={(e) => setSelectedProduct({...selectedProduct, inventory: Number(e.target.value)})}
                                          />
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <Label>Available Sizes</Label>
                                          <div className="grid grid-cols-4 gap-2">
                                            {sizes.map(size => (
                                              <div key={size} className="flex items-center space-x-2">
                                                <Checkbox 
                                                  id={`edit-size-${size}`} 
                                                  checked={selectedProduct.sizes?.includes(size)}
                                                  onCheckedChange={(checked) => handleSizeToggle(size, checked as boolean, false)}
                                                />
                                                <Label htmlFor={`edit-size-${size}`} className="text-sm">{size}</Label>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-description">Description</Label>
                                          <textarea 
                                            id="edit-description" 
                                            className="w-full min-h-[100px] p-2 border rounded-md" 
                                            value={selectedProduct.description || ""} 
                                            onChange={(e) => setSelectedProduct({...selectedProduct, description: e.target.value})}
                                          />
                                        </div>
                                      </div>
                                      
                                      <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsEditProductOpen(false)}>Cancel</Button>
                                        <Button onClick={handleEditProduct}>Save Changes</Button>
                                      </DialogFooter>
                                    </>
                                  )}
                                </DialogContent>
                              </Dialog>
                              
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          No products found. Try adjusting your search or add a new product.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Customer Management</h2>
              <p className="text-muted-foreground">Customer management features will be implemented in the next phase.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;