import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import bcrypt from 'bcryptjs';
import Wallet from './Wallet.js'; // Import Wallet model

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
        },
    },
});

export default User;