import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Import CORS
import sequelize from './config/db.js';
import userAuthRoutes from './routes/user/userAuthRoutes.js';
import ownerAuthRoutes from './routes/admin/ownerAuthRoutes.js'
import agentAuthRoutes from './routes/admin/agentAuthRoutes.js'

import ownerRoutes from './routes/admin/ownerRoutes.js'
import userRoutes from './routes/admin/userRoutes.js';
import agentRoutes from './routes/admin/agentRoutes.js'

import adminWalletRoutes from './routes/admin/adminWalletRoutes.js';
import userWalletRoutes from './routes/user/userWalletRoutes.js';
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
      origin: ["http://localhost:3001","http://localhost:3000"], // Allow only this origin
      methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
      credentials: true, // Allow cookies and credentials
    })
  );

// Routes



app.use('/api/user', userAuthRoutes);
app.use('/api/admin',ownerAuthRoutes);
app.use('/api/admin',agentAuthRoutes)

app.use('/api/admin',ownerRoutes)
app.use('/api/admin', userRoutes);
app.use('/api/admin', agentRoutes)

app.use('/api/admin', adminWalletRoutes);
app.use('/api/user', userWalletRoutes);

app.use('/api/admin', withdrawalRoutes);


// Start the server
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});