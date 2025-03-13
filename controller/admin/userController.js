import User from '../../model/user/User.js';
import bcrypt from 'bcryptjs';
import sequelize from '../../config/db.js';
import WalletService from '../../services/walletService.js';
import Bank from '../../model/admin/Bank.js'; // Import the Bank model to fetch exchange rate

const UserController = {
    // Create a new user
    createUser: async (req, res) => {
        const transaction = await sequelize.transaction(); // Start a transaction
        const userData = req.body;
        const { initialBalance, coin_type="USDT", ...userDetails } = userData;
        console.log(coin_type,"@@@@@@@@@@@@@cointype")
        console.log(userData,"@@@@@@@@@@@@@userData")

        try {
            
            


            const loggedInUserId = req.user.user_id; // Logged-in user's ID
            const loggedInUsername = req.user.username; // Logged-in user's username
            const loggedInUserRole = req.user.role; // Logged-in user's role

            // Create a new user
            const user = await User.create(userDetails, { transaction });

            // Step 2: Create a wallet for the user
            await WalletService.createWallet(user.user_id, 'User', transaction, user.username);

            // Step 3: Handle initial balance
            if (initialBalance) {
                let amountToDebit = initialBalance;
                let amountToCredit = initialBalance;

                // If coinType is INR, fetch the exchange rate and convert the amount
                if (coin_type === 'INR') {
                    const bank = await Bank.findOne({
                        where: { bank_id: 1 }, // Assuming the exchange rate is stored in the first bank record
                        transaction,
                    });

                    if (!bank || !bank.exchange_rate) {
                        throw new Error('Exchange rate not found');
                    }

                    const exchangeRate = parseFloat(bank.exchange_rate);
                    amountToDebit = initialBalance / exchangeRate; // Convert INR to USDT for debit
                    amountToCredit = initialBalance; // Keep the amount in INR for credit
                }

                // Debit the logged-in user's balance (in USDT)
                await WalletService.debitBalance(
                    loggedInUserId,
                    amountToDebit,
                    'USDT', // Always debit in USDT
                    loggedInUserRole,
                    transaction,
                    loggedInUsername
                );

                // Credit the initial balance to the user (in INR or USDT based on coinType)
                await WalletService.creditBalance(
                    user.user_id,
                    amountToCredit,
                    coin_type, // Use the provided coinType (INR or USDT)
                    'User',
                    transaction,
                    loggedInUsername
                );
            }

            await transaction.commit(); // Commit the transaction
            res.status(201).json({ success: true, data: user });
        } catch (error) {
            await transaction.rollback(); // Rollback the transaction on error
            console.error('Error in createUser:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Get all users
    getAllUsers: async (req, res) => {
        try {
            const users = await User.findAll();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update password for user
    updatePassword: async (req, res) => {
        const transaction = await sequelize.transaction(); // Start a transaction
        try {
            const userId = req.user.user_id; // Assuming user ID is available in req.user
            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                return res.status(400).json({ success: false, error: 'Password fields cannot be empty' });
            }

            // Find the user
            const user = await User.findOne({ where: { user_id: userId } });
            if (!user) {
                return res.status(404).json({ success: false, error: 'User not found' });
            }

            // Verify the current password
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ success: false, error: 'Current password is incorrect' });
            }

            // Hash the new password before saving
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update the user's password
            await user.update({ password: hashedPassword }, { transaction });

            await transaction.commit(); // Commit the transaction
            res.status(200).json({ success: true, message: 'Password updated successfully' });
        } catch (error) {
            await transaction.rollback(); // Rollback the transaction on error
            console.error('Error in updatePassword:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Get a user by ID (fetched from req.user)
    getUser: async (req, res) => {
        try {
            const userId = req.user.user_id; // Assuming user ID is available in req.user
            const Role = req.user.role; // Contains the role of the user who made the request

            // Find the user by ID
            const user = await User.findOne({ where: { user_id: userId } });
            if (!user) {
                return res.status(404).json({ success: false, error: 'User not found' });
            }

            // Return the user details (excluding sensitive information like password)
            const userDetails = {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                requestRole: Role,
            };

            res.status(200).json({ success: true, user: userDetails });
        } catch (error) {
            console.error('Error in getUser:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },
};

export default UserController;