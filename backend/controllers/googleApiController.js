import * as console from "node:console";
import {fetchAllPoints, createPoint, createFeeding} from "../models/googleApiModel.js";
import {getGoogleApiKey} from "../config/googleApi.js";

// Handler to get all points
export const getAllPoints = async (req, res, next) => {
    try {
        const points = await fetchAllPoints();
        res.status(200).json({success: true, data: points});
    } catch (error) {
        next(error);
    }
};

// Handler to add a new point
export const addPoint = async (req, res, next) => {
    try {
        const pointReq = req.body;
        console.log('Creating new point: ', pointReq);
        const user = req.user;
        console.log('addPoint-access is allowed', user);
        const point = await createPoint(pointReq);
        if (point.error) {
            console.error({error: point.error});
            return res.status(400).json({success: false, error: point.error});
        }
        res.status(200).json({success: true, data: point});
    } catch (error) {
        next(error);
    }
};

// Handler to add a feeding record
export const addFeeding = async (req, res, next) => {
    try {
        const feedingReq = req.body;
        const user = req.user;
        console.log('addFeeding-access is allowed', user);
        feedingReq.user_id = user.userId;
        console.log('Save-addFeeding: ', feedingReq);
        const feeding = await createFeeding(feedingReq);
        if (feeding.error) {
            console.error({error: feeding.error});
            return res.status(400).json({success: false, error: feeding.error});
        }
        res.status(200).json({success: true, data: feeding});
    } catch (error) {
        next(error);
    }
};

// Handler to get Google API key
export const googleApiKey = async (req, res, next) => {
    try {
        const KEY_GOOGLEAPI = await getGoogleApiKey();
        res.status(200).json({success: true, data: KEY_GOOGLEAPI});
    } catch (error) {
        next(error);
    }
};
