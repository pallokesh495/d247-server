import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Deposit = sequelize.define('Deposit', {
    deposit_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    accountHolderName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    accountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ifscCode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    upiId: {
        type: DataTypes.STRING,
        allowNull: true, // UPI ID can be optional
    },
    depositAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    transactionNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'USDT',
    },
    bank: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    paymentMethod: {
        type: DataTypes.ENUM('CRYPTO','BANK','UPI'),
        allowNull: false,
    },
    paymentScreenshot: {
        type: DataTypes.STRING, // Assuming this will store a URL or file path
        allowNull: true, // Optional, as not all payment methods may require a screenshot
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('In Queue', 'Processing', 'Done', 'Wager Not Completed'),
        defaultValue: 'In Queue',
    },
});

export default Deposit;