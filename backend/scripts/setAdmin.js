const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load env vars
dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rajshree-ethos';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const setAdmin = async () => {
  await connectDB();

  try {
    const adminEmail = 'admin@rajshree.com';

    // Delete existing admin user to ensure clean creation
    const deletedUser = await User.findOneAndDelete({ email: adminEmail });
    if (deletedUser) {
      console.log(`Removed existing user: ${adminEmail}`);
    }

    // Create new admin user
    console.log(`Creating new admin user: ${adminEmail}`);
    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: 'RajShree@Admin2024', // You should change this immediately after first login
      role: 'admin'
    });
    console.log(`Successfully created admin user: ${adminEmail}`);
    console.log('Default password: RajShree@Admin2024');

  } catch (error) {
    console.error('Error setting admin user:', error);
  } finally {
    mongoose.disconnect();
    console.log('MongoDB Disconnected.');
  }
};

setAdmin();
