import dotenv from "dotenv";
dotenv.config();

export const getGoogleApiKey = async (req, res, next) => {
    try {
        return process.env.KEY_GOOGLEAPI;
    } catch (error) {
        next(error);
    }
};
