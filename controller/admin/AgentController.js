import Agent from '../../model/admin/Agent.js';
import sequelize from '../../config/db.js';

const AgentController = {
    // Register a new agent
    registerAgent: async (req, res) => {
        const transaction = await sequelize.transaction(); // Start a transaction
        try {
            const { name, email, password, role } = req.body;

            // Check if the email is already registered
            const existingAgent = await Agent.findOne({ where: { email } });
            if (existingAgent) {
                return res.status(400).json({ success: false, error: 'Email already registered' });
            }

            // Create a new agent
            const agent = await Agent.create({
                name,
                email,
                password,
                role,
            }, { transaction });

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
            const { agentId } = req.params;

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
    updateAgent: async (req, res) => {
        try {
            const { agentId } = req.params;
            const updateData = req.body;

            // Find and update the agent
            const agent = await Agent.findOne({ where: { agent_id: agentId } });
            if (!agent) {
                return res.status(404).json({ success: false, error: 'Agent not found' });
            }

            await agent.update(updateData);
            res.status(200).json({ success: true, data: agent });
        } catch (error) {
            console.error('Error in updateAgent:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

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
};

export default AgentController;