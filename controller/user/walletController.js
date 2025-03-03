import WalletService from '../../services/admin/WalletService.js';

const WalletController = {
    

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