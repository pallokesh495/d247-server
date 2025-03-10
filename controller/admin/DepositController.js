import Deposit from '../../model/admin/Deposit.js';
import User from '../../model/user/User.js';

const DepositController = {
  // Create a deposit
  async createDeposit(req, res) {
    try {
      const {
        accountHolderName,
        accountNumber,
        ifscCode,
        upiId,
        depositAmount,
        transactionNumber,
        currency,
        bank,
        paymentMethod,
      } = req.body;

      // Get the user_id from the token
      const userId = req.user.user_id;

      // Fetch user details
      const user = await User.findOne({ where: { user_id: userId } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Get the uploaded file path (if any)
      const paymentScreenshot = req.file ? req.file.path : null;

      // Create the deposit
      const deposit = await Deposit.create({
        user_id: userId, // Use the user_id from the token
        accountHolderName,
        accountNumber,
        ifscCode,
        upiId,
        depositAmount,
        transactionNumber,
        currency,
        bank,
        paymentMethod,
        paymentScreenshot,
        status: 'In Queue', // Default status
      });

      res.status(201).json({ message: 'Deposit created successfully', deposit });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating deposit', error: error.message });
    }
  },

  // Update deposit status (Admin only)
  async updateDepositStatus(req, res) {
    try {
      const { deposit_id, status } = req.body;

      // Check if the user is an admin
      if (req.user.role !== 'Agent' && req.user.role !== 'Owner') {
        return res.status(403).json({ message: 'Access denied. Only admins can update deposit status.' });
      }

      // Find the deposit
      const deposit = await Deposit.findByPk(deposit_id);
      if (!deposit) {
        return res.status(404).json({ message: 'Deposit not found' });
      }

      // Update the status
      deposit.status = status;
      await deposit.save();

      res.status(200).json({ message: 'Deposit status updated successfully', deposit });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating deposit status', error: error.message });
    }
  },

  // Get all deposits (Admin only)
  async getAllDeposits(req, res) {
    try {
      // Check if the user is an admin
      if (req.user.role !== 'Agent' && req.user.role !== 'Owner') {
        return res.status(403).json({ message: 'Access denied. Only admins can view all deposits.' });
      }

      const deposits = await Deposit.findAll();
      res.status(200).json({ deposits });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching deposits', error: error.message });
    }
  },

  // Get deposits related to a specific user
  async getUserDeposits(req, res) {
    try {
      const userId = req.user.user_id; // Get user_id from the token

      // Fetch deposits for the user
      const deposits = await Deposit.findAll({
        where: { user_id: userId },
      });

      res.status(200).json({ deposits });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching user deposits', error: error.message });
    }
  },
};

export default DepositController;