import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const customerService = [
    { name: "Track Your Order", href: "/track-order" },
    { name: "Return Policy", href: "/returns" },
    { name: "Size Guide", href: "/size-guide" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact Us", href: "/contact" },
  ];

  const company = [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Wholesale", href: "/wholesale" },
  ];

  const categories = [
    { name: "Wedding Dress Materials", href: "/category/wedding-dress-materials" },
    { name: "Designer Lehengas", href: "/category/designer-lehengas" },
    { name: "Festive Kurtis", href: "/category/festive-kurtis" },
    { name: "Bridal Collection", href: "/category/bridal" },
    { name: "Suits Pieces", href: "/category/suits-pieces" },
  ];

  return (
    <footer className="bg-gradient-to-b from-muted to-muted/50 border-t border-border/50">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary to-accent py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-primary-foreground text-2xl font-playfair font-semibold mb-2">
            Stay Updated with Latest Collections
          </h3>
          <p className="text-primary-foreground/80 mb-6">
            Get exclusive access to new arrivals, special offers, and fashion tips
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-secondary text-foreground"
            />
            <button className="btn-secondary w-full sm:w-auto">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">R</span>
              </div>
              <span className="heading-section text-xl">RajShree Emporium</span>
            </div>
            <p className="text-elegant">
              Your trusted destination for authentic Indian ethnic wear. Celebrating tradition with contemporary elegance.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-foreground">Customer Service</h4>
            <ul className="space-y-2">
              {customerService.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-elegant hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-foreground">Company</h4>
            <ul className="space-y-2">
              {company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-elegant hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-foreground">Popular Categories</h4>
            <ul className="space-y-2">
              {categories.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-elegant hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-border/50 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Call Us</p>
                <p className="text-elegant">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Email Us</p>
                <p className="text-elegant">support@rajshreeemporium.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Visit Store</p>
                <p className="text-elegant">Mumbai, Maharashtra</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/50 bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-elegant text-center md:text-left">
              © 2024 RajShree Emporium. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <img
                src="https://via.placeholder.com/40x25/333/fff?text=VISA"
                alt="Visa"
                className="h-6 opacity-70"
              />
              <img
                src="https://via.placeholder.com/40x25/333/fff?text=MC"
                alt="Mastercard"
                className="h-6 opacity-70"
              />
              <img
                src="https://via.placeholder.com/40x25/333/fff?text=UPI"
                alt="UPI"
                className="h-6 opacity-70"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;