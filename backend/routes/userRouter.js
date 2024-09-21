import express from "express";
import {checkTokenExists, createUser, getHashpwd, refreshToken} from "../controllers/userController.js";


export const routerUser = express.Router();

routerUser.post('/register', createUser);
routerUser.post('/login', getHashpwd);
routerUser.post('/users/check_token', checkTokenExists);
routerUser.post('/users/refresh_token', refreshToken);
// routerUser.put('/users/:id', changeUser);