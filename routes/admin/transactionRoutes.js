import express from 'express';  
const router = express.Router();
import TransactionController from '../../controller/admin/TransactionController.js';
import authMiddleware from '../../middleware/authMiddleware.js'; // Import the middleware


// user transactions
router.get('/transaction-user', authMiddleware, TransactionController.getTransactionsByWalletId);

router.get('/transactions/date-range',authMiddleware,TransactionController.getTransactionsByDateRange)


router.post('/transaction-list', TransactionController.getAllTransactions);

export default router;