import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Affiliate = sequelize.define('Affiliate', {
    uid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
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
    referral_link: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    referral_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    friends: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
});

export default Affiliate;