import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Withdrawal = sequelize.define('Withdrawal', {
    withdrawal_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Reference the Users table
            key: 'user_id',
        },
    },
    withdraw_currency: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    payment_method: {
        type: DataTypes.ENUM('BANK', 'UPI'), // Payment method: BANK or UPI
        allowNull: true, // Optional for USDT withdrawals
    },
    account_holder_name: {
        type: DataTypes.STRING,
        allowNull: true, // Optional, as it's only required for BANK withdrawals
    },
    account_number: {
        type: DataTypes.STRING,
        allowNull: true, // Optional, as it's only required for BANK withdrawals
    },
    ifsc_code: {
        type: DataTypes.STRING,
        allowNull: true, // Optional, as it's only required for BANK withdrawals
    },
    upi_id: {
        type: DataTypes.STRING,
        allowNull: true, // Optional, as it's only required for UPI withdrawals
    },
    wallet_address: {
        type: DataTypes.STRING,
        allowNull: true, // Optional, as it's only required for USDT withdrawals
    },
    chain_name: {
        type: DataTypes.STRING,
        allowNull: true, // Optional, as it's only required for USDT withdrawals
    },
    withdraw_amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    status: {
        type: DataTypes.ENUM('In Queue', 'Processing', 'Done', 'Wager Not Completed'),
        defaultValue: 'In Queue',
    },
}, {
    timestamps: false, // Disable Sequelize's default timestamps (createdAt, updatedAt)
});

export default Withdrawal;