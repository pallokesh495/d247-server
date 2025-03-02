import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const TokenBlacklist = sequelize.define('TokenBlacklist', {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

export default TokenBlacklist;