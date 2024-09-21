import * as console from "node:console";
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';
import {db} from "../config/db.js";

const {MY_BUCKET_NAME, CAT_HOLDER, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION} = process.env

const s3 = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});

export const uploadToS3 = async (fileBuffer, origin_name, type) => {
    const uploadParams = {
        Bucket: MY_BUCKET_NAME,
        Key: `${CAT_HOLDER}/${Date.now()}_${origin_name}`,
        Body: fileBuffer,
        ContentType: 'jpeg',
    }

    try {
        await s3.send(new PutObjectCommand(uploadParams));
        // Генерируем URL для доступа к загруженному файлу
        const fileUrl = `https://${MY_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
        console.log('File uploaded successfully:', fileUrl);
        return fileUrl; // Возвращаем URL загруженного файла
    } catch (error) {
        console.error('Error uploading file:', error);
        return {error: 'Failed to upload file'}; // Можно вернуть специфичное сообщение или объект ошибки
    }
};

export const createCat = async (cat) => {
    try {
        const [catIdObject] = await db("cats").insert(cat).returning("id");
        const catId = catIdObject.id;
        console.log('addUser to db: ', JSON.stringify(cat));
        return catId
    } catch (error) {
        console.error('Error adding user to db: ', error);
        throw error;
    }
}

export const allCats = async () => {
    try {
        const cats = await db('cats').select('*');
        console.log('allCats - Cats were obtained from the database');
        return cats
    } catch (error) {
        console.error('Error adding user to db: ', error);
        throw error;
    }
}