import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Import CORS
import sequelize from './config/db.js';
import authRoutes from './routes/admin/authRoutes.js';
import ownerRoutes from './routes/admin/ownerRoutes.js'
import userRoutes from './routes/admin/userRoutes.js';
import walletRoutes from './routes/admin/walletRoutes.js';
import withdrawalRoutes from './routes/admin/withdrawalRoutes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log('Request Body from server.js:', req.body); // Log the request body
  next();
});
app.use(
    cors({
      origin: "http://localhost:3001", // Allow only this origin
      methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
      credentials: true, // Allow cookies and credentials
    })
  );

// Routes
app.use('/api/admin', authRoutes);
app.use('/api/admin/',ownerRoutes)

app.use('/api/admin', userRoutes);
app.use('/api/admin', walletRoutes);
app.use('/api/admin', withdrawalRoutes);

// Start the server
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});