import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js'; // Adjust the path as needed

const Bank = sequelize.define('Bank', {
    bank_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    bank_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    account_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    account_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure account numbers are unique
    },
    ifsc: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    upi_id: {
        type: DataTypes.STRING,
        allowNull: true, // UPI ID is optional
    },
    BEP20: {
        type: DataTypes.STRING,
        allowNull: true, // BEP20 address is optional
    },
    TRC20: {
        type: DataTypes.STRING,
        allowNull: true, // TRC20 address is optional
    },
    ERC20: {
        type: DataTypes.STRING,
        allowNull: true, // ERC20 address is optional
    },
    exchange_rate: {
        type: DataTypes.DECIMAL(15, 2), // Suitable for exchange rates
        allowNull: false,
        defaultValue: 0.0, // Default exchange rate
    },
}, {
    tableName: 'banks', // Optional: Custom table name
    timestamps: true, // Adds createdAt and updatedAt fields
});

export default Bank;