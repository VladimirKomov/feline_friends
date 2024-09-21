import sharp from 'sharp';
import fs from 'fs';
import {uploadToS3, createCat, allCats} from "../models/imgModel.js";
import console from "node:console";

// Handler to upload and process an image
export const uploadImage = async (req, res) => {
    try {
        const file = req.file; // File uploaded via multer

        if (!file) {
            return res.status(400).json({error: 'No file uploaded'});
        }

        // Process the image (resize to 300x300)
        const processedImage = await sharp(file.buffer).resize({width: 300, height: 300}).toBuffer();

        // Save the processed image to the filesystem for test
        // fs.writeFile('processed-image.jpg', processedImage, (err) => {
        //     if (err) {
        //         console.error('Error saving image:', err);
        //     } else {
        //         console.log('Image cropped successfully!');
        //     }
        // });

        // Upload the processed image to S3
        const urlImg = await uploadToS3(processedImage, file.originalname, file.type);
        if (urlImg.error) {
            console.error({error: urlImg.error});
            return res.status(400).json({success: false, error: urlImg.error});
        }
        console.log(urlImg);
        return res.status(200).json({success: true, data: urlImg});
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({error: 'Failed to upload image'});
    }
};

// Handler to add a cat to the database
export const addCatDB = async (req, res) => {
    try {
        const catReq = req.body;
        console.log('Creating new cat: ', catReq);
        const point = await createCat(catReq);
        if (point.error) {
            console.error({error: catReq.error});
            return res.status(400).json({success: false, error: catReq.error});
        }
        res.status(200).json({success: true, data: catReq});
    } catch (error) {
        next(error);
    }
}

// Handler to get all cats from the database
export const getAllCats = async (req, res, next) => {
    try {
        console.log('Getting all cats');
        const allCatsList = await allCats();
        if (allCatsList.error) {
            console.error({error: allCatsList.error});
            return res.status(400).json({success: false, error: allCatsList.error});
        }
        res.status(200).json({success: true, data: allCatsList});
    } catch (error) {
        next(error);
    }
}
