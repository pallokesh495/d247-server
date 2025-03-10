import Withdrawal from '../../model/admin/Withdrawal.js';
import User from '../../model/user/User.js';

const WithdrawalController = {
    // User creates a withdrawal request
    createWithdrawal: async (req, res) => {
        try {
            const { withdraw_amount, withdraw_currency, bank, account_holder_name, account_number, ifsc_code, upi_id } = req.body;
            const userId = req.user.user_id; // Get userId from the token

            // Fetch user details
            const user = await User.findOne({ where: { user_id: userId } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Create a withdrawal request
            const withdrawal = await Withdrawal.create({
                userid: userId,
                withdraw_currency,
                bank,
                account_holder_name,
                account_number,
                ifsc_code,
                upi_id,
                withdraw_amount,
                status: 'In Queue', // Default status
            });

            res.status(201).json({ success: true, data: withdrawal });
        } catch (error) {
            console.error('Error in createWithdrawal:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Admin updates the status of a withdrawal
    updateWithdrawalStatus: async (req, res) => {
        try {
            const { withdrawalId, status } = req.body;

            // Check if the user is an admin
            if (req.user.role !== 'Agent' && req.user.role !== 'Owner') {
                return res.status(403).json({ error: 'Access denied. Only admins can update withdrawal status.' });
            }

            // Find the withdrawal request
            const withdrawal = await Withdrawal.findOne({ where: { withdrawal_id: withdrawalId } });
            if (!withdrawal) {
                return res.status(404).json({ error: 'Withdrawal not found' });
            }

            // Update the status
            withdrawal.status = status;
            await withdrawal.save();

            res.status(200).json({ success: true, data: withdrawal });
        } catch (error) {
            console.error('Error in updateWithdrawalStatus:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Get all withdrawals (for admin)
    getAllWithdrawals: async (req, res) => {
        try {
            // Check if the user is an admin
            if (req.user.role !== 'Agent' && req.user.role !== 'Owner') {
                return res.status(403).json({ error: 'Access denied. Only admins can view all withdrawals.' });
            }

            const withdrawals = await Withdrawal.findAll();
            res.status(200).json({ success: true, data: withdrawals });
        } catch (error) {
            console.error('Error in getAllWithdrawals:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Get withdrawals for a specific user
    getUserWithdrawals: async (req, res) => {
        try {
            const userId = req.user.user_id; // Get userId from the token

            const withdrawals = await Withdrawal.findAll({ where: { userid: userId } });
            res.status(200).json({ success: true, data: withdrawals });
        } catch (error) {
            console.error('Error in getUserWithdrawals:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },
};

export default WithdrawalController;