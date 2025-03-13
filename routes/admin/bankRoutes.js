import express from 'express';
const router = express.Router();
import BankController from '../../controller/admin/bankController.js'; // Adjust the path as needed
import authMiddleware from '../../middleware/authMiddleware.js'; // Adjust the path as needed

// Create a new bank
router.post('/bank/create', authMiddleware,  BankController.createBank);

// Get bank details by bank_id
router.get('/bank/:bank_id', authMiddleware, BankController.getBankDetails);

// Update all fields of a bank
router.put('/bank/:bank_id', authMiddleware, BankController.updateBankDetails);

// Update only the exchange rate of a bank
router.patch('/bank/:bank_id/exchange-rate', authMiddleware, BankController.updateExchangeRate);

// Delete a bank by bank_id
router.delete('/bank/:bank_id', authMiddleware, BankController.deleteBank);

export default router;