import Wallet from '../../model/admin/Wallet.js';

const WalletService = {
    creditBalance: async (userId, amount, coinType = 'USD') => {
        try {
            console.log('Service - creditBalance:', { userId, amount, coinType }); // Debugging log

            // Parse amount as a number
            const parsedAmount = parseFloat(amount);
            if (isNaN(parsedAmount)) {
                throw new Error('Invalid amount');
            }

            const wallet = await Wallet.findOne({ 
                where: { user_id: userId, user_type: 'Owner' }, // Add user_type
            });

            // If wallet doesn't exist, create one
            if (!wallet) {
                wallet = await Wallet.create({ user_id: userId, balance: 0.0, coin_type: coinType });
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

    debitBalance: async (userId, amount, coinType = 'USD') => {
        try {
            console.log('Service - debitBalance:', { userId, amount, coinType }); // Debugging log

            // Parse amount as a number
            const parsedAmount = parseFloat(amount);
            if (isNaN(parsedAmount)) {
                throw new Error('Invalid amount');
            }

            const wallet = await Wallet.findOne({ 
                where: { user_id: userId, user_type: 'Owner' }, // Add user_type
            });

            // If wallet doesn't exist, create one
            if (!wallet) {
                wallet = await Wallet.create({ user_id: userId, balance: 0.0, coin_type: coinType });
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

    getBalance: async (userId) => {
        try {
            console.log('Service - getBalance:', { userId }); // Debugging log
            const wallet = await Wallet.findOne({ 
                where: { user_id: userId, user_type: 'Owner' }, // Add user_type
            });
            return wallet ? parseFloat(wallet.balance) : 0;
        } catch (error) {
            console.error('Error in getBalance service:', error);
            throw error;
        }
    }
};

export default WalletService;