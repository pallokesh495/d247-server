import Transaction from '../../model/admin/Transaction.js'
import Wallet from '../../model/admin/Wallet.js';

const TransactionController = {
    // Fetch transactions by wallet_id
    getTransactionsByWalletId: async (req, res) => {
        try {
      // fetching wallet id from user details
            let loggedInUserId = req.user.user_id;
            let loggedInUserRole = req.user.role;

            if (loggedInUserRole === "agent") loggedInUserRole = "Agent";
            if (loggedInUserRole === "master") loggedInUserRole = "Master";
            if (loggedInUserRole === "owner") loggedInUserRole = "owner";
            if (loggedInUserRole === "user") loggedInUserRole = "User";

            const wallet = await Wallet.findOne({
                where: { user_id: loggedInUserId, user_type: loggedInUserRole },
            });


            const  wallet_id  =  wallet.wallet_id;

            // Input validation
            if (!wallet_id) {
                return res.status(400).json({ error: 'Missing required field: wallet_id' });
            }

            // Fetch transactions for the given wallet_id
            const transactions = await Transaction.findAll({
                where: { wallet_id },
                order: [['id', 'DESC']], // Order by id in descending order (newest first)
            });

            // Return the transactions in the response
            res.status(200).json({ success: true, data: transactions });
        } catch (error) {
            console.error('Error in getTransactionsByWalletId:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Fetch all transactions (optional)
    getAllTransactions: async (req, res) => {
        try {
            const transactions = await Transaction.findAll({
                order: [['id', 'DESC']], // Order by id in descending order (newest first)
            });

            // Return the transactions in the response
            res.status(200).json({ success: true, data: transactions });
        } catch (error) {
            console.error('Error in getAllTransactions:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },
};

export default TransactionController;