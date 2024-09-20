import * as console from "node:console";
import {fetchAllPoints, createPoint, createFeeding} from "../models/googleApiModel.js";
import {getGoogleApiKey} from "../config/googleApi.js";

export const getAllPoints = async (req, res, next) => {
    try {
        const points = await fetchAllPoints();
        res.status(200).json({ success: true, data: points });
    } catch (error) {
        next(error);
    }
};

export const addPoint = async (req, res, next) => {
    try {
        const pointReq = req.body;
        console.log('Creating new point: ', pointReq);
        const point = await createPoint(pointReq);
        if (point.error) {
            console.error({error: point.error});
            return res.status(400).json({ success: false, error: point.error });
        }
        res.status(200).json({ success: true, data: point });
    } catch (error) {
        next(error);
    }
};

export const addFeeding = async (req, res, next) => {
    try {
        const feedingReq = req.body;
        console.log(feedingReq);
        console.log('Creating new feeding: ', feedingReq);
        const feeding = await createFeeding(feedingReq);
        console.log(feeding);
        if (feeding.error) {
            console.error({error: feeding.error});
            return res.status(400).json({ success: false, error: feeding.error });
        }
        res.status(200).json({ success: true, data: feeding });
    } catch (error) {
        next(error);
    }
};

export const GoogleApiKey = async (req, res, next) => {
    try {
        const KEY_GOOGLEAPI = await getGoogleApiKey();
        // const KEY_GOOGLEAPI = "AIzaSyAUu1QWJo1RO-amirXAKXbyX_xJRWKWzwE";
        console.log(KEY_GOOGLEAPI);
        res.status(200).json({ success: true, data: KEY_GOOGLEAPI });
    } catch (error) {
        next(error);
    }
};
