const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const complaintRoutes = require('./routes/complaintRoutes');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Root welcome & API info endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Campus Complaint Tracker API',
    endpoints: {
      createComplaint: 'POST /api/complaints',
      getAllComplaints: 'GET /api/complaints (supports ?status= ?category= ?priority= ?search=)',
      getComplaintById: 'GET /api/complaints/:id',
      updateComplaint: 'PUT /api/complaints/:id',
      updateStatus: 'PATCH /api/complaints/:id/status',
      deleteComplaint: 'DELETE /api/complaints/:id',
    },
  });
});

// Mount complaint routes
app.use('/api/complaints', complaintRoutes);

// 404 Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]', err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[Server] Campus Complaint Tracker is running on http://localhost:${PORT}`);
  console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection] ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
