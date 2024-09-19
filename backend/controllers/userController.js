import {
    addUserAndHashpwd,
    fetchAllUsers,
    fetchHashpwd,
    fetchUserById, fetchUserByNameOrEmail,
    updateUser
} from "../models/userModel.js";
import * as console from "node:console";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {mapUserReqToDb, mapUserReqtoUserCredentials} from "../mappers/userMapper.js";
import dotenv from "dotenv";
import * as process from "node:process";

//getting JWT_SECRET and expiresIn
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d'

//Created user
export const createUser = async (req, res, next) => {
    try {
        const userReq = req.body;

        console.log('Creating new user: ', userReq);

        let user;
        let userCredentials;
        try {
            // Map the user request to the database format
            user = mapUserReqToDb(userReq);
            // Map the user request to the user credentials object for db
            userCredentials = mapUserReqtoUserCredentials(userReq);
        } catch (error) {
            // Return an error response if mapping fails
            return res.status(400).json({ success: false, error: error.message });
        }

        // Added the hash password
        userCredentials.password_hash = await bcrypt.hash(userCredentials.password, 10);
        // Removed the plain password
        delete userCredentials.password;
        // Add the user and the hashed password to the database
        const userDb = await addUserAndHashpwd(user, userCredentials);

        res.status(201).json({ success: true, data: userDb });
    } catch (error) {
        next(error);
    }
};

export const getHashpwd = async (req, res, next) => {
    try {
        const userReq = req.body;
        if (!userReq.usernameOrEmail || !userReq.password) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }
        // Search for a user by username or email
        const user = await fetchUserByNameOrEmail(userReq);

        // If the user is not found
        if (!user) {
            return res.status(400).json({ success: false, error: "Invalid username or email" });
        }
        // Search for the hashed user password in the hashpwd table
        const userPassword = await db('hashpwd')
            .where('user_id', user.id)
            .first();

        if (!userPassword) {
            return res.status(400).json({ success: false, error: "Password not found for the user" });
        }

        // Comparing the entered password with the hashed password
        const isMatch = await bcrypt.compare(password, userPassword.password_hash);

        if (!isMatch) {
            return res.status(400).json({ success: false, error: "Incorrect password" });
        }
        // JWT Token Generation
        const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        // Returning a successful response with a token
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token
        });
    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await fetchAllUsers();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await fetchUserById(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

export const changeUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = req.body;
        const updatedUser = await updateUser(userId, user);
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        next(error);
    }
}