const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Use routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Rajshree Ethos API is running...');
});

// Function to find a free port
const findFreePort = (startPort) => {
  return new Promise((resolve, reject) => {
    const server = http.createServer();
    server.listen(startPort, () => {
      const { port } = server.address();
      server.close(() => {
        resolve(port);
      });
    });
    server.on('error', () => {
      // Port is in use, try the next one
      resolve(findFreePort(startPort + 1));
    });
  });
};

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    // Start server on a free port
    const preferredPort = process.env.PORT || 5000;
    const PORT = await findFreePort(preferredPort);
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      if (PORT !== preferredPort) {
        console.log(`Note: Default port ${preferredPort} was in use, using port ${PORT} instead`);
      }
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });