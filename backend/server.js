// server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables (for connection string)
dotenv.config();

// Connect to DB function - FIX: Removed unsupported options
const connectDB = async () => {
    try {
        // Mongoose v6+ mein options ki zarurat nahi hai
        await mongoose.connect(process.env.MONGO_URI); 
        
        console.log('MongoDB Connected successfully!');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Exit process with failure
    }
};

connectDB();

const app = express();

// Middleware
app.use(express.json()); // To accept JSON data in body

// Import Routes
const productRoutes = require('./routes/productRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes'); // <-- Naya Import: Warehouse Routes

// Mount Routes
app.use('/api/products', productRoutes); // Products routes
app.use('/api', warehouseRoutes); // <-- CRITICAL FIX: Warehouse routes mounted at /api

// Define a simple root route
app.get('/', (req, res) => {
    res.send('StockMaster IMS API is running...');
});


const PORT = 3000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));