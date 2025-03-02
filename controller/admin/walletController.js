import WalletService from '../../services/admin/WalletService.js';

const WalletController = {
    creditBalance: async (req, res) => {
        try {
            const { userId, amount, coinType } = req.body;
            const adminUserId = req.user.user_id; // Admin's userId from the token

            // Use the provided userId or fallback to the admin's userId
            const targetUserId = userId || adminUserId;

            // Input validation
            if (!amount) {
                return res.status(400).json({ error: 'Missing required field: amount' });
            }

            const wallet = await WalletService.creditBalance(targetUserId, amount, coinType);
            res.status(200).json({ success: true, data: wallet });
        } catch (error) {
            console.error('Error in creditBalance:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    debitBalance: async (req, res) => {
        try {
            const { userId, amount, coinType } = req.body;
            const adminUserId = req.user.user_id; // Admin's userId from the token

            // Use the provided userId or fallback to the admin's userId
            const targetUserId = userId || adminUserId;

            // Input validation
            if (!amount) {
                return res.status(400).json({ error: 'Missing required field: amount' });
            }

            const wallet = await WalletService.debitBalance(targetUserId, amount, coinType);
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

            const { userId } = req.body;
            const adminUserId = req.user.user_id; // Admin's userId from the token

            // Use the provided userId or fallback to the admin's userId
            const targetUserId = userId || adminUserId;

            const balance = await WalletService.getBalance(targetUserId);
            res.status(200).json({ success: true, data: balance });
        } catch (error) {
            console.error('Error in getBalance:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }
};

export default WalletController;