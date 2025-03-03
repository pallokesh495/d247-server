import jwt from 'jsonwebtoken';
import TokenBlacklist from '../../model/admin/TokenBlacklist.js';

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        // Check if the token is blacklisted
        const blacklistedToken = await TokenBlacklist.findOne({ where: { token } });
        if (blacklistedToken) {
            return res.status(401).json({ error: 'Token invalidated. Please log in again.' });
        }

        // Verify the token and extract user details
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token from authMiddleware:', decoded); // Debugging log
        req.user = decoded; // Attach user details to the request object
        console.log('Request user from authMiddleware:', req.user); // Debugging log
        console.log('Request user_id from authMiddleware:', req.user.user_id); // Debugging log
        console.log('Request body from authMiddleware:', req.body);
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired. Please log in again.' });
        }
        console.error('Error in authMiddleware:', error); // Debugging log
        res.status(400).json({ error: 'Invalid token.' });
    }
};

export default authMiddleware;