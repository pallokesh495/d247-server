import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    credit: {
        type: DataTypes.STRING, // Username of the user who is credited
        allowNull: true,
    },
    debit: {
        type: DataTypes.STRING, // Username of the user who is debited
        allowNull: true,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    wallet_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
});

export default Transaction;