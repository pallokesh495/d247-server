import express from 'express';
const router = express.Router();
import WalletController from '../../controller/walletController.js';
import authMiddleware from '../../middleware/user/authMiddleware.js';

router.get('/balance',authMiddleware, WalletController.getBalance);

export default router;