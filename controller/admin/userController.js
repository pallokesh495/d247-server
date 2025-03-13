import User from '../../model/user/User.js';
import bcrypt from 'bcryptjs';
import sequelize from '../../config/db.js';
import WalletService from '../../services/walletService.js';

const UserController = {
    // Create a new user
    createUser: async (req, res) => {

       
        const transaction = await sequelize.transaction(); // Start a transaction
        
        try {
            const userData = req.body;
            const { initialBalance, ...userDetails } = userData;
            
            const loggedInUserId = req.user.user_id; // Logged-in user's ID
            const loggedInUsername = req.user.username; // Logged-in user's username
            const loggedInUserRole = req.user.role; // Logged-in user's role

            // Create a new user
            const user = await User.create(userDetails, { transaction });

            // Step 2: Create a wallet for the user
            await WalletService.createWallet(user.user_id, 'user', transaction, user.username); // Pass the user's username

            // Step 3: Debit the logged-in user's balance and credit the initial balance to the user
            if (initialBalance) {
                // Debit the logged-in user's balance
                await WalletService.debitBalance(loggedInUserId, initialBalance, 'default', loggedInUserRole, transaction, loggedInUsername);

                // Credit the initial balance to the user
                await WalletService.creditBalance(user.user_id, initialBalance, 'default', 'user', transaction, loggedInUsername);
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

            // Update the user's password (plain-text password is passed here)
            await user.update({ password: newPassword }, { transaction });

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
            };

            res.status(200).json({ success: true, user: userDetails });
        } catch (error) {
            console.error('Error in getUser:', error);
            res.status(500).json({ success: false, error: error.message });
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
    },  // Get a user by ID (fetched from req.user)
    getUser: async (req, res) => {
        try {
            const userId = req.user.user_id; // Assuming user ID is available in req.user
             const Role  = req.user.role;   // contain any user(OWNER, AGENT,MASTER, USER) who made request
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
                requestRole:Role,
            };

            res.status(200).json({ success: true, user: userDetails });
        } catch (error) {
            console.error('Error in getUser:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },
};

export default UserController;