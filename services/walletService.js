import Wallet from '../model/admin/Wallet.js';
import Transaction from '../model/admin/Transaction.js';

const WalletService = {
    creditBalance: async (userId, amount, coinType = 'USD', role, transaction, loggedInUsername) => {
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
                transaction, // Pass the transaction to the query
            });
    
            // If wallet doesn't exist, throw an error
            if (!wallet) {
                throw new Error('Wallet not found');
            }
            console.log("______________________wallet",wallet)
    
            // Add the parsed amount to the balance
            wallet.balance = parseFloat(wallet.balance) + parsedAmount;
            await wallet.save({ transaction }); // Save with transaction
    
            // Save the transaction
            await Transaction.create({
                
                credit: wallet.username, // Receiver's username
                debit: loggedInUsername, // Sender's username
                amount: parsedAmount,
                balance: wallet.balance,
                wallet_id: wallet.wallet_id, // Wallet ID of the receiver
            }, { transaction });
    
            // Ensure only the last 1,000 transactions are kept
            await WalletService.cleanupTransactions(wallet.wallet_id, transaction);
    
            return wallet;
        } catch (error) {
            console.error('Error in creditBalance service:', error);
            throw error;
        }
    },

    debitBalance: async (userId, amount, coinType = 'USD', role, transaction, loggedInUsername) => {
        try {
            console.log('Service - debitBalance:', { userId, amount, coinType }); // Debugging log
    
            // Parse amount as a number
            const parsedAmount = parseFloat(amount);
            if (isNaN(parsedAmount)) {
                throw new Error('Invalid amount');
            }

            if (role === "agent") role = "Agent";
            if (role === "master") role = "Master";
            if (role === "owner") role = "owner";
            if (role === "user") role = "User";
    
            // Find the wallet
            const wallet = await Wallet.findOne({
                where: { user_id: userId, user_type: role },
                transaction, // Pass the transaction to the query
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
            await wallet.save({ transaction }); // Save with transaction
    
            // Save the transaction
            await Transaction.create({
                
                credit: loggedInUsername, // Receiver's username (logged-in user)
                debit: wallet.username, // Sender's username
                amount: parsedAmount,
                balance: wallet.balance,
                wallet_id: wallet.wallet_id, // Wallet ID of the sender
            }, { transaction });
    
            // Ensure only the last 1,000 transactions are kept
            await WalletService.cleanupTransactions(wallet.wallet_id, transaction);
    
            return wallet;
        } catch (error) {
            console.error('Error in debitBalance service:', error);
            throw error;
        }
    },
    // Function to keep only the last 1,000 transactions per wallet
    cleanupTransactions: async (wallet_id, transaction) => {
        try {
            // Find the total number of transactions for the wallet
            const count = await Transaction.count({
                where: { wallet_id: wallet_id },
                transaction,
            });

            // If there are more than 1,000 transactions, delete the oldest ones
            if (count > 1000) {
                const excess = count - 1000;
                const oldestTransactions = await Transaction.findAll({
                    where: { wallet_id: walletId },
                    order: [['date', 'ASC']],
                    limit: excess,
                    transaction,
                });

                // Delete the oldest transactions
                await Transaction.destroy({
                    where: { id: oldestTransactions.map(t => t.id) },
                    transaction,
                });
            }
        } catch (error) {
            console.error('Error in cleanupTransactions:', error);
            throw error;
        }
    },


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
                    username: wallet.username,
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