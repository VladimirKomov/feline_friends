import sharp from 'sharp';
import fs from 'fs';
import pkg from 'aws-sdk';
import {uploadToS3} from "../models/imgModel.js";
import console from "node:console";

export const uploadImage = async (req, res) => {
    try {
        const file = req.file; // Файл, загруженный через multer

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Применяем обработку изображения
        const processedImage = await sharp(file.buffer).resize({ width: 300, height: 300 }).toBuffer();
        fs.writeFile('processed-image.jpg', processedImage, (err) => {
            if (err) {
                console.error('Error saving image:', err);
            } else {
                console.log('Image cropped successfully!');
            }
        });

        const urlImg = await uploadToS3(processedImage, file.originalname, file.type);
        if (urlImg.error) {
            console.error({error: urlImg.error});
            return res.status(400).json({ success: false, error: urlImg.error });
        }
        console.log(urlImg);
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
            }
};

