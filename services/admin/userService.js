import User from '../../model/admin/User.js';

const UserService = {
    createUser: async (userData) => {
        const user = await User.create(userData);
        return user;
    },
    getAllUsers: async () => {
        const users = await User.findAll();
        return users;
    }
};

export default UserService;   