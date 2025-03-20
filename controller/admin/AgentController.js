import Agent from '../../model/admin/Agent.js';
import sequelize from '../../config/db.js';
import bcrypt from 'bcryptjs';
import WalletService from '../../services/walletService.js';

const AgentController = {
      // Register a new agent
    registerAgent: async (req, res) => {
        
        const transaction = await sequelize.transaction(); // Start a transaction
        try {
            let { name, email, password, role, initialBalance } = req.body;
            const loggedInUserId = req.user.user_id; // Logged-in user's ID
            const loggedInUsername = req.user.username; // Logged-in user's username
            const loggedInUserRole = req.user.role; // Logged-in user's role

            // Check if the email is already registered
            const existingAgent = await Agent.findOne({ where: { email } });
            if (existingAgent) {
                return res.status(400).json({ success: false, error: 'Email already registered' });
            }

            if (role === "master") role = "Master";
            if (role === "agent") role = "Agent";

            // Create a new agent
            const agent = await Agent.create({
                name,
                email,
                password,
                role,
            }, { transaction });

            // Step 2: Create a wallet for the agent
            await WalletService.createWallet(agent.agent_id, role, transaction, agent.name); // Pass the agent's name as username

            // Step 3: Debit the logged-in user's balance and credit the initial balance to the agent
            if (initialBalance) {
                // Debit the logged-in user's balance
                await WalletService.debitBalance(loggedInUserId, initialBalance, 'USDT', loggedInUserRole, transaction, loggedInUsername);

                // Credit the initial balance to the agent
                await WalletService.creditBalance(agent.agent_id, initialBalance, 'USDT', role, transaction, loggedInUsername);
            }

            await transaction.commit(); // Commit the transaction
            res.status(201).json({ success: true, data: agent });
        } catch (error) {
            await transaction.rollback(); // Rollback the transaction on error
            console.error('Error in registerAgent:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Get all agents
    getAllAgents: async (req, res) => {
        try {
            const agents = await Agent.findAll();
            res.status(200).json({ success: true, data: agents });
        } catch (error) {
            console.error('Error in getAllAgents:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    
     // Get a specific agent by ID
     getAgentById: async (req, res) => {
        try {
            const agentId = req.user.user_id; // Fetch agentId from the authenticated user's token

            const agent = await Agent.findOne({ where: { agent_id: agentId } });
            if (!agent) {
                return res.status(404).json({ success: false, error: 'Agent not found' });
            }

            res.status(200).json({ success: true, data: agent });
        } catch (error) {
            console.error('Error in getAgentById:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Update an agent
    // updateAgent: async (req, res) => {
    //     try {
    //         const { agentId } = req.params;
    //         const updateData = req.body;

    //         // Find and update the agent
    //         const agent = await Agent.findOne({ where: { agent_id: agentId } });
    //         if (!agent) {
    //             return res.status(404).json({ success: false, error: 'Agent not found' });
    //         }

    //         await agent.update(updateData);
    //         res.status(200).json({ success: true, data: agent });
    //     } catch (error) {
    //         console.error('Error in updateAgent:', error);
    //         res.status(500).json({ success: false, error: error.message });
    //     }
    // },

    
        // Delete an agent
        deleteAgent: async (req, res) => {
            try {
                const { agentId } = req.params;
    
                const agent = await Agent.findOne({ where: { agent_id: agentId } });
                if (!agent) {
                    return res.status(404).json({ success: false, error: 'Agent not found' });
                }
    
                await agent.destroy();
                res.status(200).json({ success: true, message: 'Agent deleted successfully' });
            } catch (error) {
                console.error('Error in deleteAgent:', error);
                res.status(500).json({ success: false, error: error.message });
            }
        },
    updatePassword: async (req, res) => {

        

        const transaction = await sequelize.transaction(); // Start a transaction
        try {
            
            const  agentId  = req.user.user_id;
            
            const { currentPassword, newPassword } = req.body;

            if(!currentPassword || !newPassword)return res.status(400).json({ success: false, error: 'password fields cannoot be empty' });

            // Find the agent
            const agent = await Agent.findOne({ where: { agent_id: agentId } });
            if (!agent) {
                return res.status(404).json({ success: false, error: 'Agent not found' });
            }

            // Verify the current password
            const isPasswordValid = await bcrypt.compare(currentPassword, agent.password);
            if (!isPasswordValid) {
                return res.status(400).json({ success: false, error: 'Current password is incorrect' });
            }

          

            // Update the agent's password
            await agent.update({ password: newPassword }, { transaction });

            await transaction.commit(); // Commit the transaction
            res.status(200).json({ success: true, message: 'Password updated successfully' });
        } catch (error) {
            await transaction.rollback(); // Rollback the transaction on error
            console.error('Error in updatePassword:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },
};

export default AgentController;