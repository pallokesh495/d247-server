import express from 'express';
const router = express.Router();
import AuthController from '../../controller/admin/authController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

// Public route: Login
router.post('/login', AuthController.login);

// Protected route: Logout
router.post('/logout', authMiddleware, AuthController.logout);

export default router;