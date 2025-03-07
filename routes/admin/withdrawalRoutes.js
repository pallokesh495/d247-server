import express from 'express';
import WithdrawalController from '../../controller/admin/WithdrawalController.js';
import authMiddleware from '../../middleware/authMiddleware.js';


const router = express.Router();

// User creates a withdrawal request
router.post('/withdrawal', authMiddleware, WithdrawalController.createWithdrawal);

// Admin updates the status of a withdrawal
router.put('/withdrawal-update', authMiddleware, WithdrawalController.updateWithdrawalStatus);

// Admin gets all withdrawals
router.get('/withdrawal-list', authMiddleware, WithdrawalController.getAllWithdrawals);

// User gets their own withdrawals
router.get('/withdrawals', authMiddleware, WithdrawalController.getUserWithdrawals);

export default router;