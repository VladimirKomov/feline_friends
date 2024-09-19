import express from "express";
import {changeUser, createUser, getAllUsers, getHashpwd, getUser} from "../controllers/userController.js";


export const routerUser = express.Router();

routerUser.post('/register', createUser);
routerUser.post('/login', getHashpwd);
routerUser.get('/users', getAllUsers);
routerUser.get('/users/:id', getUser);
routerUser.put('/users/:id', changeUser);