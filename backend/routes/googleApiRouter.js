import express from "express";
import {getAllPoints, addPoint, addFeeding, googleApiKey} from "../controllers/googleApiController.js";
import {checkTokenExists} from "../middleware/commonMiddleware.js";


export const routerGoogleApi = express.Router();

routerGoogleApi.get('/map_points', getAllPoints);
routerGoogleApi.post('/add_point', checkTokenExists, addPoint);
routerGoogleApi.post('/feedings', checkTokenExists, addFeeding);
routerGoogleApi.get('/config', googleApiKey)

