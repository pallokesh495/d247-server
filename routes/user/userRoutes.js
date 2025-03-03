import express from 'express';  
const router = express.Router();
import UserController from '../../controller/admin/userController.js';




// Protected route: Create a user
router.post('/users-create', UserController.createUser);

export default router;