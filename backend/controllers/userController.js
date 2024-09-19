import {
    addUserAndHashpwd,
    fetchAllUsers,
    fetchHashpwd,
    fetchUserById,
    updateUser
} from "../models/userModel.js";
import * as console from "node:console";
import bcrypt from 'bcryptjs';
import {mapUserReqToDb, mapUserReqtoUserCredentials} from "../mappers/userMapper.js";

export const errorHandler = (err, req, res) => {
    console.error(err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        error: err.message || "Server Error",
    });
};

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
        const {username, password} = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }
        const user = await fetchHashpwd({username});
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: "Invalid credentials" });
        }
        res.status(200).json({ success: true, data: user.username });
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