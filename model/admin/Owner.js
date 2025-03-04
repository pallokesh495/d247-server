import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import bcrypt from 'bcryptjs'; // For password hashing
import Wallet from './Wallet.js'; // Import Wallet model

const Owner = sequelize.define('Owner', {
    owner_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    client_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    website_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    domain_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    website_ui: {
        type: DataTypes.ENUM('BC GAMES', 'NANO GAMES'),
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    logo: {
        type: DataTypes.STRING, // Store the file path or URL
        allowNull: false,
    },
    favicon: {
        type: DataTypes.STRING, // Store the file path or URL
        allowNull: false,
    },
    game_providers: {
        type: DataTypes.JSON, // Store as JSON for multiple providers
        allowNull: false,
    },
    subscription_plan: {
        type: DataTypes.ENUM('1 Month Plan', '2 Month Plan', '3 Month Plan'),
        allowNull: false,
    },
    platform_configurations: {
        type: DataTypes.JSON, // Store as JSON for multiple configurations
        allowNull: false,
    },
    payment_methods: {
        type: DataTypes.JSON, // Store as JSON for multiple payment methods
        allowNull: false,
    },
    site_email_address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure email is unique
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('Owner'),
        allowNull: false,
    },
    account_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    hooks: {
        beforeCreate: async (owner) => {
            if (owner.password) {
                const salt = await bcrypt.genSalt(10);
                owner.password = await bcrypt.hash(owner.password, salt);
            }
        },
        beforeUpdate: async (owner) => {
            if (owner.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                owner.password = await bcrypt.hash(owner.password, salt);
            }
        },
        // afterCreate: async (owner) => {
        //     console.log(`Creating wallet for owner with ID: ${owner.owner_id}`);
        //     await Wallet.create({
        //         user_id: owner.owner_id,
        //         user_type: 'Owner',
        //         username: owner.client_name, // Use client_name as the username
        //         balance: 0.0,
        //         coin_type: 'USD',
        //     });
        // },
    },
});

export default Owner;