import express from "express";
import {uploadImage} from "../controllers/imgController.js";
import {upload} from "../config/multerConfig.js";

export const routerImg = express.Router();
routerImg.post('/uploadImg', upload.single('image'), uploadImage);