import console from "node:console";
import dotenv from "dotenv";
import process from "node:process";
import jwt from 'jsonwebtoken';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const errorHandler = (err, req, res, next) => {
    console.error(err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        error: err.message || "Server Error",
    });
};

// Middleware for token verification
export const checkTokenExists = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // Check if the Authorization header was provided
    if (!authHeader) {
        return res.status(401).json({success: false, message: 'Authorization header is missing'});
    }

    const token = authHeader.split(' ')[1]; // Extract the token from the header

    // Check if the token was provided
    if (!token) {
        return res.status(401).json({success: false, message: 'Token is missing'});
    }

    // Verify the validity of the token
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({success: false, message: 'Token is invalid or expired'});
        }

        req.user = user;
        next();
    });
};
