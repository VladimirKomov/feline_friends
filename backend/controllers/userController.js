import {
    addUserAndHashpwd, fetchAllUsers,
    fetchHashpwd, fetchToken, fetchUserById,
    fetchUserByNameOrEmail, insertToken
} from "../models/userModel.js";
import * as console from "node:console";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
    mapUserDbtoUserRes, mapUserDebtorUserSimpleRes,
    mapUserReqToDb,
    mapUserReqtoUserCredentials,
    mapUserTokenToTokenDb
} from "../mappers/userMapper.js";
import dotenv from "dotenv";
import * as process from "node:process";
import res from "express/lib/response.js";
import req from "express/lib/request.js";


//getting JWT_SECRET and expiresIn
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m'
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

//Created user
export const createUser = async (req, res, next) => {
    try {
        const userReq = req.body;

        console.log('Creating new user: ', userReq.name, userReq.username);

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
        const result = await addUserAndHashpwd(user, userCredentials);
        // Checking if an error return error
        if (result.error) {
            console.error({error: result.error});
            return res.status(400).json({ success: false, error: result.error });
        }
        console.log("Successfully created user:", result);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

//log in
export const getHashpwd = async (req, res, next) => {
    try {
        const userReq = req.body;
        if (!userReq.usernameOrEmail || !userReq.password) {
            console.error({error: "All fields are required"});
            return res.status(400).json({ success: false, error: "All fields are required" });
        }
        // Search for a userDb by username or email
        const userDb = await fetchUserByNameOrEmail(userReq.usernameOrEmail);

        // If the userDb is not found
        if (!userDb) {
            console.error({error: "Invalid username or email"});
            return res.status(400).json({ success: false, error: "Invalid username or email" });
        }
        // Search for the hashed userDb password in the hashpwd table
        const userPassword = await fetchHashpwd(userDb.id);

        if (!userPassword) {
            return res.status(400).json({ success: false, error: "Password not found for the userDb" });
        }

        // Comparing the entered password with the hashed password
        const isMatch = await bcrypt.compare(userReq.password, userPassword.password_hash);

        if (!isMatch) {
            return res.status(400).json({ success: false, error: "Incorrect password" });
        }
        // Generation of access token (short token)
        const accessToken = jwt.sign(
            { userId: userDb.id, username: userDb.username },
            JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        // Generation of refresh token (long token)
        const refreshToken = jwt.sign(
            { userId: userDb.id, username: userDb.username },
            REFRESH_TOKEN_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
        );
        //save token
        const tokenData = mapUserTokenToTokenDb(userDb.id, refreshToken, REFRESH_TOKEN_EXPIRES_IN);
        await insertToken(tokenData);

        // Returning a successful response with a token
        return res.status(200).json({
            success: true,
            data: mapUserDbtoUserRes(userDb, accessToken, refreshToken)
        });
    } catch (error) {
        next(error);
    }
};

export const checkTokenExists = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // Checking the Authorization header
    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1]; // get token

    // Checking the token
    if (!token) {
        return res.status(401).json({ success: false, message: 'Token is missing' });
    }

    // Checking the validity of the token
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Token is invalid or expired' });
        }

        // If the token is valid, we return the status 200
        return res.status(200).json({ success: true, data : user });
    });
}

export const refreshToken = async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ success: false, message: "Refresh token is required" });
    }

    //Checking for the refresh Token in the database (or temporary storage)
    const refreshTokenDB = await fetchToken({token: refreshToken});
    if (!refreshTokenDB) {
        return res.status(401).json({ success: false, message: "Refresh token is invalid or expired" });
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: "Refresh token is invalid or expired" });
        }

        //If refreshToken is valid, create a new accessstoken
        const newAccessToken = jwt.sign({ userId: user.userId, username: user.username }
            , JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        // Отправляем новый accessToken
        return res.status(200).json({
            success: true,
            data: newAccessToken
        });
    });
}

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await fetchAllUsers();
        const mappedUsers = users.map(user => mapUserDebtorUserSimpleRes(user))
        res.status(200).json({ success: true, data: mappedUsers });
    } catch (error) {
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await fetchUserById(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }
        const userRes = mapUserDebtorUserSimpleRes(user);
        res.status(200).json({ success: true, data: userRes });
    } catch (error) {
        next(error);
    }
}

