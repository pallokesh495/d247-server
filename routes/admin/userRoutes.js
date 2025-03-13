import express from 'express';  
const router = express.Router();
import UserController from '../../controller/admin/userController.js';
import authMiddleware from '../../middleware/authMiddleware.js'; // Import the middleware
import roleMiddleware from '../../middleware/roleMiddleware.js';

// Public route: Get all users
router.get('/users-list', authMiddleware, UserController.getAllUsers);
router.get('/user-details', authMiddleware, UserController.getUser);

// Protected route: Create a user
router.post('/users-create', UserController.createUser);

//update pass for users
router.put('/user-update-password',authMiddleware, UserController.updatePassword);

export default router;