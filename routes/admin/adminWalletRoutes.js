import express from 'express';
const router = express.Router();
import WalletController from '../../controller/walletController.js';
import authMiddleware from '../../middleware/admin/authMiddleware.js';

router.post('/credit', authMiddleware, WalletController.creditBalance);
router.post('/debit', authMiddleware, WalletController.debitBalance);
router.get('/balance',authMiddleware, WalletController.getBalance);

// New routes for fetching wallets
router.get('/wallet-list', authMiddleware, WalletController.getAllWallets); // Get all wallets
router.get('/wallets/:role', authMiddleware, WalletController.getWalletsByRole); // Get wallets by role

export default router;