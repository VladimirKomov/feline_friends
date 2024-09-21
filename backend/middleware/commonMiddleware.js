import console from "node:console";
import dotenv from "dotenv";
import process from "node:process";

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

// Middleware для проверки токена
export const checkTokenExists = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // Проверяем, был ли передан заголовок Authorization
    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1]; // Извлекаем сам токен из заголовка

    // Проверяем, был ли передан токен
    if (!token) {
        return res.status(401).json({ success: false, message: 'Token is missing' });
    }

    // Проверяем валидность токена
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Token is invalid or expired' });
        }

        // Если токен валиден, сохраняем информацию о пользователе в req.user
        req.user = user;
        next(); // Передаем управление следующему middleware или маршруту
    });
};