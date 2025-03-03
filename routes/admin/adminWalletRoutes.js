import express from 'express';
const router = express.Router();
import WalletController from '../../controller/walletController.js';
import authMiddleware from '../../middleware/admin/authMiddleware.js';

router.post('/credit', authMiddleware, WalletController.creditBalance);
router.post('/debit', authMiddleware, WalletController.debitBalance);
router.get('/balance',authMiddleware, WalletController.getBalance);

export default router;