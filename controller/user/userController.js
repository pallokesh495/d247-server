import User from '../../model/admin/User.js';

const UserController = {
    createUser: async (req, res) => {
        try {
            const userData = req.body;
            const user = await User.create(userData);
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

 
};

export default UserController;