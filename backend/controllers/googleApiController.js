
import * as console from "node:console";
import {fetchAllPoints, createPoint} from "../models/googleApiModel.js";

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

