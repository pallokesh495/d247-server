import express from 'express';
import WithdrawalController from '../../controller/admin/WithdrawalController.js';
import authMiddleware from '../../middleware/admin/authMiddleware.js';

const router = express.Router();

// User creates a withdrawal request
router.post('/withdrawals', authMiddleware, WithdrawalController.createWithdrawal);

// Admin updates the status of a withdrawal
router.put('/withdrawals/status', authMiddleware, WithdrawalController.updateWithdrawalStatus);

// Admin gets all withdrawals
router.get('/withdrawals', authMiddleware, WithdrawalController.getAllWithdrawals);

// User gets their own withdrawals
router.get('/user/withdrawals', authMiddleware, WithdrawalController.getUserWithdrawals);

export default router;