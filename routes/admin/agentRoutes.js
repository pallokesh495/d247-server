import express from 'express';
const router = express.Router();
import AgentController from '../../controller/admin/AgentController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

// Register a new agent
router.post('/agent/register', AgentController.registerAgent);


// Get all agents (protected route)
router.get('/agent-list', authMiddleware, AgentController.getAllAgents);

// Get a specific agent by ID (protected route)
router.get('/agent/:agentId', authMiddleware, AgentController.getAgentById);

// Update an agent (protected route)
router.put('/agent/:agentId', authMiddleware, AgentController.updateAgent);

// Delete an agent (protected route)
router.delete('/agent/:agentId', authMiddleware, AgentController.deleteAgent);

export default router;