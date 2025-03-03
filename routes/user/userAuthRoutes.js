import express from 'express';
const router = express.Router();
import AuthController from '../../controller/user/userAuthController.js';
import authMiddleware from '../../middleware/user/authMiddleware.js';

// Public route: Login
router.post('/login', AuthController.login);

// Protected route: Logout
router.post('/logout', authMiddleware, AuthController.logout);

export default router;