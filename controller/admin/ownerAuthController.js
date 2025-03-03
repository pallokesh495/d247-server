import AuthService from '../../services/admin/ownerAuthService.js';

const AuthController = {
    login: async (req, res) => {
        try {
            const { site_email_address, password } = req.body;

            const token = await AuthService.login(site_email_address, password);
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