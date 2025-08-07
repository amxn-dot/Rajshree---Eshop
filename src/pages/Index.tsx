import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Truck, Shield, RotateCcw, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import heroImage from "@/assets/hero-saree.jpg";
import collectionBanner from "@/assets/collection-banner.jpg";
import lehengaProduct from "@/assets/lehenga-product.jpg";
import kurtaProduct from "@/assets/kurta-product.jpg";
import sareeProduct from "@/assets/saree-product.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      image: heroImage,
      title: "Exquisite Indian Ethnic Wear",
      subtitle: "Discover the finest collection of traditional dress materials, lehengas, and more",
      cta: "Shop Collection",
      link: "/products",
    },
    {
      image: collectionBanner,
      title: "Festive Season Special",
      subtitle: "Up to 50% off on designer lehengas and festive wear",
      cta: "Shop Sale",
      link: "/sale",
    },
  ];

  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders above ₹2,000",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure transactions",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "7-day return policy",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Customer care assistance",
    },
  ];

  const featuredProducts = [
    {
      id: "1",
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
    },
    {
      id: "2",
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
    },
    {
      id: "3",
      name: "Luxurious Maroon Silk Saree with Golden Border",
      price: 8999,
      image: sareeProduct,
      rating: 4.9,
      reviews: 156,
      category: "Dress Materials",
      isNew: true,
      sizes: ["Free Size"],
    },
    {
      id: "4",
      name: "Designer Wedding Lehenga in Emerald Green",
      price: 22999,
      originalPrice: 28999,
      image: lehengaProduct,
      rating: 4.7,
      reviews: 67,
      category: "Lehengas",
      isSale: true,
      discount: 21,
      sizes: ["S", "M", "L", "XL"],
    },
  ];

  const categories = [
    {
      name: "Dress Materials",
      image: sareeProduct,
      count: "500+ Styles",
      link: "/category/dress-materials",
    },
    {
      name: "Lehengas",
      image: lehengaProduct,
      count: "300+ Designs",
      link: "/category/lehengas",
    },
    {
      name: "Kurtis",
      image: kurtaProduct,
      count: "400+ Options",
      link: "/category/kurtis",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="relative h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-2xl animate-fade-in">
                    <h1 className="heading-elegant text-white mb-6">
                      {slide.title}
                    </h1>
                    <p className="text-white/90 text-xl mb-8 leading-relaxed">
                      {slide.subtitle}
                    </p>
                    <Button
                      onClick={() => navigate(slide.link)}
                      className="btn-hero text-lg px-8 py-4"
                    >
                      {slide.cta}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-secondary" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-elegant">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-elegant">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="heading-section mb-4">Shop by Category</h2>
            <p className="text-elegant max-w-2xl mx-auto">
              Explore our curated collection of authentic Indian ethnic wear
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div
                key={index}
                className="relative group cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 0.2}s` }}
                onClick={() => navigate(category.link)}
              >
                <div className="relative overflow-hidden rounded-xl aspect-[4/5]">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="font-playfair font-semibold text-3xl mb-2">
                      {category.name}
                    </h3>
                    <p className="text-white/80 mb-4">{category.count}</p>
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                      Explore Collection
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-elegant">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="heading-section mb-4">Featured Products</h2>
            <p className="text-elegant max-w-2xl mx-auto">
              Handpicked selections from our premium collection
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard
                  {...product}
                  onClick={() => navigate(`/product/${product.id}`)}
                />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button
              onClick={() => navigate("/products")}
              className="btn-hero"
            >
              View All Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
