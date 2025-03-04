import AuthService from '../../services/admin/agentAuthService.js';

const AuthController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const token = await AuthService.login(email, password);
            res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    logout: async (req, res) => {
        try {
            const token = req.header('Authorization').replace('Bearer ', '');
            await AuthService.logout(token);
            res.status(200).json({ message: 'Logged out successfully.' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

export default AuthController;