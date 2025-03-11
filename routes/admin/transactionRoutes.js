import express from 'express';  
const router = express.Router();
import TransactionController from '../../controller/admin/TransactionController.js';
import authMiddleware from '../../middleware/authMiddleware.js'; // Import the middleware


// user transactions
router.get('/transaction-user', authMiddleware, TransactionController.getTransactionsByWalletId);


router.post('/transaction-list', TransactionController.getAllTransactions);

export default router;