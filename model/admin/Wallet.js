import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Wallet = sequelize.define('Wallet', {
    wallet_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_type: {
        type: DataTypes.ENUM('Owner', 'User', 'Agent', 'Master'),
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false, // Ensure username is required
        unique: true, // Ensure username is unique
    },
    coin_type: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'USDT',
    },
    balance: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0.0,
    },
    inr_balance: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0.0,
    },
});

export default Wallet;