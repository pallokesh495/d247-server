import express from 'express';
import ownerAuthController from '../../controller/admin/ownerAuthController.js'
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();




// login client/website
router.post('/login-owner', ownerAuthController.login);

// logout client/website
 router.post('/logout',authMiddleware, ownerAuthController.logout);



export default router;