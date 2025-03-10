import express from 'express';
import DepositController from '../../controller/admin/DepositController.js';
import authMiddleware from '../../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save files in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  },
});

const upload = multer({ storage: storage });

// User creates a deposit request (with file upload)
router.post('/deposit', authMiddleware, upload.single('paymentScreenshot'), DepositController.createDeposit);

// Admin updates the status of a deposit
router.put('/deposit-update', authMiddleware, DepositController.updateDepositStatus);

// Admin gets all deposits
router.get('/deposit-list', authMiddleware, DepositController.getAllDeposits);

// User gets their own deposits
router.get('/deposits', authMiddleware, DepositController.getUserDeposits);

export default router;