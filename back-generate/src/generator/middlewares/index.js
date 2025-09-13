import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../templates/config/config.js';
import responseHandler from '../templates/utils/responseHandler.js';

/**
 * Authentication middleware
 * Verifies JWT token and sets user in request
 */
const authenticateUser = (req, res, next) => {
    // Skip authentication for development if needed
    if (process.env.NODE_ENV === 'development' && process.env.SKIP_AUTH === 'true') {
        req.user = { id: 'DEV_USER', role: 'admin' };
        return next();
    }

    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return responseHandler.unauthorized(res, 'No token provided');
        }

        const token = authHeader.split(' ')[1];
        
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Set user in request
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return responseHandler.unauthorized(res, 'Token expired');
        }
        return responseHandler.unauthorized(res, 'Invalid token');
    }
};

export default authenticateUser; 