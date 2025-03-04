import Owner from '../../model/admin/Owner.js';
import Wallet from '../../model/admin/Wallet.js';
import sequelize from '../../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const OwnerController = {
    // Create a new client/website
    createClient:  async (req, res) => {
        const transaction = await sequelize.transaction(); // Start a transaction
        try {
            const {
                client_name,
                website_name,
                domain_name,
                website_ui,
                initial_balance,
                country,
                logo,
                favicon,
                game_providers,
                subscription_plan,
                platform_configurations,
                payment_methods,
                site_email_address,
                password,
                role,
                account_status,
            } = req.body;

            // Create a new owner
            const owner = await Owner.create({
                client_name,
                website_name,
                domain_name,
                website_ui,
                country,
                logo,
                favicon,
                game_providers,
                subscription_plan,
                platform_configurations,
                payment_methods,
                site_email_address,
                password,
                role,
                account_status,
            }, { transaction });

            // Create a wallet for the owner with the initial balance
            await Wallet.create({
                user_id: owner.owner_id,
                user_type: 'Owner',
                balance: parseFloat(initial_balance), // Set the initial balance
                coin_type: 'USD',
                username: owner.client_name,
            }, { transaction });

            await transaction.commit(); // Commit the transaction
            res.status(201).json({ success: true, data: owner });
        } catch (error) {
            await transaction.rollback(); // Rollback the transaction on error
            console.error('Error in registerOwner:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },


    // Update a client/website
    updateClient: async (req, res) => {
        try {
            const { ownerId } = req.params;
            const updateData = req.body;

            // Find and update the client/website
            const client = await Owner.findOne({ where: { owner_id: ownerId } });
            if (!client) {
                return res.status(404).json({ error: 'Client not found' });
            }

            await client.update(updateData);
            res.status(200).json({ success: true, data: client });
        } catch (error) {
            console.error('Error in updateClient:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Get all clients/websites
    getAllClients: async (req, res) => {
        try {
            const clients = await Owner.findAll();
            res.status(200).json({ success: true, data: clients });
        } catch (error) {
            console.error('Error in getAllClients:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Get a specific client/website
    getClient: async (req, res) => {
        try {
            const { ownerId } = req.params;

            const client = await Owner.findOne({ where: { owner_id: ownerId } });
            if (!client) {
                return res.status(404).json({ error: 'Client not found' });
            }

            res.status(200).json({ success: true, data: client });
        } catch (error) {
            console.error('Error in getClient:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Delete a client/website
    deleteClient: async (req, res) => {
        try {
            const { ownerId } = req.params;

            const client = await Owner.findOne({ where: { owner_id: ownerId } });
            if (!client) {
                return res.status(404).json({ error: 'Client not found' });
            }

            await client.destroy();
            res.status(200).json({ success: true, message: 'Client deleted successfully' });
        } catch (error) {
            console.error('Error in deleteClient:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },
};

export default OwnerController; // Ensure this is exported