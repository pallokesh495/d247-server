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
    coin_type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'USD', // Default coin type
    },
    balance: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0.0,
    },
});

export default Wallet;