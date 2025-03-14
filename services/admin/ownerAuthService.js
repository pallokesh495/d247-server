import Owner from '../../model/admin/Owner.js';
import TokenBlacklist from '../../model/admin/TokenBlacklist.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const AuthService = {
    login: async (site_email_address, password) => {
        const user = await Owner.findOne({ where: { site_email_address } });
        if (!user) throw new Error('User not found');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Invalid credentials');

        console.log(user, 'owner user id')

        // Generate a JWT token with user_id and role
        const token = jwt.sign(
            { user_id: user.owner_id, role: user.role }, // Ensure user_id is included
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        return token;
    },

    logout: async (token) => {
        // Decode the token to get its expiration time
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add the token to the blacklist
        await TokenBlacklist.create({
            token,
            expiresAt: new Date(decoded.exp * 1000), // Convert expiration time to a Date object
        });
    },
};

export default AuthService;