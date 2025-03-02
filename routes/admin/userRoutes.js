import express from 'express';  
const router = express.Router();
import UserController from '../../controller/admin/userController.js';
import authMiddleware from '../../middleware/authMiddleware.js'; // Import the middleware
import roleMiddleware from '../../middleware/roleMiddleware.js';

// Public route: Get all users
router.get('/users-list', authMiddleware, UserController.getAllUsers);

// Protected route: Create a user
router.post('/users-create', authMiddleware, roleMiddleware(['Agent', 'Owner', 'User']), UserController.createUser);

export default router;