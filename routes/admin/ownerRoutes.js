import express from 'express';
import OwnerController from '../../controller/admin/OwnerController.js';
import authMiddleware from '../../middleware/authMiddleware.js';
import AuthController from '../../controller/admin/ownerAuthController.js';

const router = express.Router();

// Create a new client/website
router.post('/clients', OwnerController.createClient);

// login client/website
router.post('/login-owner', AuthController.login);

// Update a client/website
// router.put('/clients/:ownerId', authMiddleware, OwnerController.updateClient);

// Get all clients/websites
router.get('/clients', authMiddleware, OwnerController.getAllClients);

// Get a specific client/website
router.get('/clients/:ownerId', authMiddleware, OwnerController.getClient);

// Delete a client/website
router.delete('/clients/:ownerId', authMiddleware, OwnerController.deleteClient);

router.put('/client/update-password',authMiddleware, OwnerController.updatePassword);

export default router;