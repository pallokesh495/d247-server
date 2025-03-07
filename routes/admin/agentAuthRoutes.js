import express from 'express';
import agentAuthController from '../../controller/admin/agentAuthController.js'
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();




// login agent
router.post('/login', agentAuthController.login);

// logoutagent
 router.post('/logout',authMiddleware, agentAuthController.logout);



export default router;