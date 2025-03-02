const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role; // Role is included in the token payload

        // Check if the user's role is allowed
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ error: 'Access denied. You do not have permission to perform this action.' });
        }

        next(); // Proceed to the next middleware or route handler
    };
};

export default roleMiddleware;