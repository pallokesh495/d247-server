import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
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
    },
    account_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    hooks: {
        afterCreate: async (owner) => {
            // Automatically create a wallet for the owner
            await Wallet.create({
                user_id: owner.owner_id, // Use owner.owner_id
                user_type: 'Owner', // Add user_type
                balance: 0.0, // Initialize balance to 0
                coin_type: 'USD', // Default coin type
            });
        },
    },
});

export default Owner;