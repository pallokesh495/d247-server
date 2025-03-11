import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import bcrypt from 'bcryptjs'; // For password hashing
import Wallet from './Wallet.js'; // Import Wallet model

const Agent = sequelize.define('Agent', {
    agent_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure email is unique
        validate: {
            isEmail: true, // Validate email format
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('master', 'agent'), // Enum for role
        allowNull: false,
    },
}, {
    hooks: {
        beforeCreate: async (agent) => {
            if (agent.password) {
                const salt = await bcrypt.genSalt(10);
                agent.password = await bcrypt.hash(agent.password, salt);
            }
        },
        beforeUpdate: async (agent) => {
            if (agent.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                agent.password = await bcrypt.hash(agent.password, salt);
            }
        },
        afterCreate: async (agent, options) => {
            console.log(`Creating wallet for agent with ID: ${agent.agent_id}`);
            const initialBalance = options.initialBalance || 0.0; // Default to 0.0 if not provided
            await Wallet.create({
                user_id: agent.agent_id,
                user_type: agent.role === 'master' ? 'Master' : 'Agent',
                username: agent.name, // Use agent's name as the username
                balance: initialBalance,
                coin_type: 'USD',
            });
        },
    },
});

export default Agent;