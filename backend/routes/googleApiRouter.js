import express from "express";
import {getAllPoints, addPoint, addFeeding, googleApiKey} from "../controllers/googleApiController.js";
import {tokenHandler} from "../middleware/commonMiddleware.js";



export const routerGoogleApi = express.Router();

routerGoogleApi.get('/map_points', getAllPoints);
routerGoogleApi.post('/add_point', tokenHandler, addPoint);
routerGoogleApi.post('/feedings', tokenHandler, addFeeding);
routerGoogleApi.get('/config', googleApiKey)

