import Withdrawal from '../../model/admin/Withdrawal.js';
import User from '../../model/user/User.js';

const WithdrawalController = {
    // User creates a withdrawal request
    createWithdrawal: async (req, res) => {
        try {
            const {
                withdraw_amount,
                withdraw_currency,
                payment_method,
                account_holder_name,
                account_number,
                ifsc_code,
                upi_id,
                wallet_address,
                chain_name,
            } = req.body;

            const userId = req.user.user_id; // Get userId from the token

            // Fetch user details
            const user = await User.findOne({ where: { user_id: userId } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Validate input based on withdrawal currency and payment method
            if (withdraw_currency === 'INR') {
                if (payment_method === 'BANK') {
                    if (!account_holder_name || !account_number || !ifsc_code) {
                        return res.status(400).json({ error: 'Please provide all bank details.' });
                    }
                } else if (payment_method === 'UPI') {
                    if (!upi_id) {
                        return res.status(400).json({ error: 'Please provide UPI ID.' });
                    }
                } else {
                    return res.status(400).json({ error: 'Invalid payment method for INR withdrawals.' });
                }
            } else if (withdraw_currency === 'USDT') {
                if (!wallet_address || !chain_name) {
                    return res.status(400).json({ error: 'Please provide wallet address and chain name.' });
                }
            } else {
                return res.status(400).json({ error: 'Invalid withdrawal currency.' });
            }

            // Create a withdrawal request
            const withdrawal = await Withdrawal.create({
                userid: userId,
                withdraw_currency,
                payment_method,
                account_holder_name,
                account_number,
                ifsc_code,
                upi_id,
                wallet_address,
                chain_name,
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
            if (req.user.role !== 'Agent' && req.user.role !== 'Owner'&& req.user.role !== 'Master') {
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
            if (req.user.role !== 'Agent' && req.user.role !== 'Owner'&& req.user.role !== 'Master') {
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