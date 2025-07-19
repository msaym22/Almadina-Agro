require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

// =====================
// Middleware Setup
// =====================
// CORS Configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  preflightContinue: false,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// File Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =====================
// Database Setup
// =====================
const { sequelize } = require('./models');

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database models synchronized');
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

// =====================
// Route Setup
// =====================
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const customerRoutes = require('./routes/customerRoutes');
const saleRoutes = require('./routes/saleRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const backupRoutes = require('./routes/backupRoutes');

// Auth routes (no middleware needed)
app.use('/api/auth', authRoutes);

// Protected routes
const authMiddleware = require('./middleware/auth');
app.use('/api/products', authMiddleware, productRoutes);
app.use('/api/customers', authMiddleware, customerRoutes);
app.use('/api/sales', authMiddleware, saleRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);
app.use('/api/backup', authMiddleware, backupRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// =====================
// Error Handling
// =====================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// =====================
// Backup Scheduling
// =====================
try {
  const { scheduleBackups } = require('./utils/backup');
  scheduleBackups();
} catch (error) {
  console.log('Backup scheduling not available:', error.message);
}

// =====================
// Server Startup
// =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS configured for: http://localhost:3000`);
  console.log(`Health check available at: http://localhost:${PORT}/api/health`);
});

// Export for testing
module.exports = app;