import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/serverConfig.js';

const isAuthenticated = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access",
            });
        };

        const decoded = jwt.verify(token, JWT_SECRET);

        if(!decoded) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access",
            });
        };

        req.id = decoded.userId;

        next();


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export default isAuthenticated;