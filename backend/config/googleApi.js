import dotenv from "dotenv";
import * as console from "node:console";
dotenv.config();

export const getGoogleApiKey = async (req, res, next) => {
    try {
        const {KEY_GOOGLEAPI} = process.env;
        return KEY_GOOGLEAPI;
    } catch (error) {
        next(error);
    }
};
