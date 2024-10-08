import express from "express";
import {
    checkTokenExists,
    createUser,
    getAllUsers,
    getHashpwd,
    getUser,
    refreshToken
} from "../controllers/userController.js";
import { tokenHandler } from "../middleware/commonMiddleware.js";

export const routerUser = express.Router();

routerUser.post('/register', createUser);
routerUser.post('/login', getHashpwd);
routerUser.post('/users/check_token', checkTokenExists);
routerUser.post('/users/refresh_token', refreshToken);
// Routes with middleware
routerUser.get('/users', tokenHandler, getAllUsers);
routerUser.get('/users/:id', tokenHandler, getUser);