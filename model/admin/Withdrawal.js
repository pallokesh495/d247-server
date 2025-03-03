import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js'

const Withdrawal = sequelize.define('Withdrawal', {
    withdrawal_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Reference the Users table
            key: 'user_id',
        },
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    coin_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    wallet_address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('In Queue', 'Processing', 'Done', 'Wager Not Completed'),
        defaultValue: 'In Queue',
    },
});

export default Withdrawal;