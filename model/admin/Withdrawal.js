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
    bank: {
        type: DataTypes.STRING,
        allowNull: true, // Optional, as UPI ID can be used instead
    },
    account_holder_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    account_number: {
        type: DataTypes.STRING,
        allowNull: true, // Optional, as UPI ID can be used instead
    },
    ifsc_code: {
        type: DataTypes.STRING,
        allowNull: true, // Optional, as UPI ID can be used instead
    },
    upi_id: {
        type: DataTypes.STRING,
        allowNull: true, // Optional, as bank details can be used instead
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