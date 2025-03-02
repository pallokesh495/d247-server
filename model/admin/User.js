import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import bcrypt from 'bcryptjs';
import Wallet from './Wallet.js'; // Import Wallet model
import Affiliate from './Affiliate.js'; // Import Affiliate model

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true, // Optional field
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true, // Optional field
    },
    coin_type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'USD', // Default coin type
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('Owner', 'User', 'Agent'),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive', 'Pending'),
        defaultValue: 'Pending',
    },
}, {
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        afterCreate: async (user) => {
            // Automatically create a wallet for the user
            await Wallet.create({ user_id: user.user_id, balance: 0.0, coin_type: user.coin_type });

            // Generate a unique referral code and link
            const referralCode = generateReferralCode(user.user_id);
            const referralLink = `http://yourapp.com/signup?ref=${referralCode}`;

            // Create an affiliate entry for the new user
            await Affiliate.create({
                uid: user.user_id,
                name: user.username,
                referral_link: referralLink,
                referral_code: referralCode,
                friends: 0, // Initialize friends count to 0
            });
        },
    },
});

// Function to generate a unique referral code
const generateReferralCode = (userId) => {
    const code = `REF${userId}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    return code;
};

export default User;