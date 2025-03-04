import WalletService from '../services/walletService.js';

const WalletController = {
    creditBalance: async (req, res) => {
        try {
            const { userId, amount, coinType, user_type } = req.body;

            // Input validation
            if (!amount) {
                return res.status(400).json({ error: 'Missing required field: amount' });
            }

            const wallet = await WalletService.creditBalance(userId, amount, coinType, user_type);
            res.status(200).json({ success: true, data: wallet });
        } catch (error) {
            console.error('Error in creditBalance:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    debitBalance: async (req, res) => {
        try {
            const { userId, amount, coinType, user_type } = req.body;

            // Input validation
            if (!amount) {
                return res.status(400).json({ error: 'Missing required field: amount' });
            }

            const wallet = await WalletService.debitBalance(userId, amount, coinType, user_type);
            res.status(200).json({ success: true, data: wallet });
        } catch (error) {
            console.error('Error in debitBalance:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    getBalance: async (req, res) => {
        try {
            console.log(req.body, 'req body from wallet controller:'); // Debugging log
            console.log(req.user, 'req user from wallet controller:'); // Debugging log

            // Extract userId and user_type from the request body
            const { userId, user_type } = req.body;

            // Use the provided userId or fallback to the authenticated user's userId
            const targetUserId = userId || req.user.user_id;

            // Use the provided user_type or fallback to the authenticated user's role
            const targetUserType = user_type || req.user.role;

            // Call the WalletService to get the balance
            const balance = await WalletService.getBalance(targetUserId, targetUserType);

            // Return the balance in the response
            res.status(200).json({ success: true, data: balance });
        } catch (error) {
            console.error('Error in getBalance:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Get all wallets
    getAllWallets: async (req, res) => {
        try {
            const wallets = await WalletService.getAllWallets();
            res.status(200).json({ success: true, data: wallets });
        } catch (error) {
            console.error('Error in getAllWallets:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Get wallets by role
    getWalletsByRole: async (req, res) => {
        try {
            const { role } = req.params; // Extract role from URL params

            const wallets = await WalletService.getWalletsByRole(role);
            res.status(200).json({ success: true, data: wallets });
        } catch (error) {
            console.error('Error in getWalletsByRole:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },
};

export default WalletController;