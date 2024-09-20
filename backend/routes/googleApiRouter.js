import express from "express";
import {getAllPoints, addPoint, addFeeding, GoogleApiKey} from "../controllers/googleApiController.js";
import {getGoogleApiKey} from "../config/googleApi.js";


export const routerGoogleApi = express.Router();

routerGoogleApi.get('/map_points', getAllPoints);
routerGoogleApi.post('/add_point', addPoint);
routerGoogleApi.post('/feedings', addFeeding);
routerGoogleApi.get('/config', GoogleApiKey)

