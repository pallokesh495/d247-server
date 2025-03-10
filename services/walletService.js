import Wallet from '../model/admin/Wallet.js';

const WalletService = {
    creditBalance: async (userId, amount, coinType = 'USD', role) => {
        try {
            console.log('Service - creditBalance:', { userId, amount, coinType }); // Debugging log

            // Parse amount as a number
            const parsedAmount = parseFloat(amount);
            if (isNaN(parsedAmount)) {
                throw new Error('Invalid amount');
            }

            // Find the wallet
            const wallet = await Wallet.findOne({
                where: { user_id: userId, user_type: role },
            });

            // If wallet doesn't exist, throw an error
            if (!wallet) {
                throw new Error('Wallet not found');
            }

            // Add the parsed amount to the balance
            wallet.balance = parseFloat(wallet.balance) + parsedAmount;
            await wallet.save();
            return wallet;
        } catch (error) {
            console.error('Error in creditBalance service:', error);
            throw error;
        }
    },

    debitBalance: async (userId, amount, coinType = 'USD', role) => {
        try {
            console.log('Service - debitBalance:', { userId, amount, coinType }); // Debugging log

            // Parse amount as a number
            const parsedAmount = parseFloat(amount);
            if (isNaN(parsedAmount)) {
                throw new Error('Invalid amount');
            }

            // Find the wallet
            const wallet = await Wallet.findOne({
                where: { user_id: userId, user_type: role },
            });

            // If wallet doesn't exist, throw an error
            if (!wallet) {
                throw new Error('Wallet not found');
            }

            // Check for sufficient balance
            if (parseFloat(wallet.balance) < parsedAmount) {
                throw new Error('Insufficient balance');
            }

            // Subtract the parsed amount from the balance
            wallet.balance = parseFloat(wallet.balance) - parsedAmount;
            await wallet.save();
            return wallet;
        } catch (error) {
            console.error('Error in debitBalance service:', error);
            throw error;
        }
    },
//get balance
    getBalance: async (userId, role) => {
        try {
            console.log('Service - getBalance:', { userId }); // Debugging log

            const wallet = await Wallet.findOne({
                where: { user_id: userId, user_type: role },
            });

            if (wallet) {
                return {
                    balance: parseFloat(wallet.balance),
                    coin_type: wallet.coin_type,
                };
            } else {
                throw new Error("Wallet not found");
            }
        } catch (error) {
            console.error('Error in getBalance service:', error);
            throw error;
        }
    },

    // Get all wallets
    getAllWallets: async () => {
        try {
            const wallets = await Wallet.findAll();
            return wallets;
        } catch (error) {
            console.error('Error in getAllWallets service:', error);
            throw error;
        }
    },

    // Get wallets by role
    getWalletsByRole: async (role) => {
        try {
            const wallets = await Wallet.findAll({
                where: { user_type: role },
            });
            return wallets;
        } catch (error) {
            console.error('Error in getWalletsByRole service:', error);
            throw error;
        }
    },
};

export default WalletService;