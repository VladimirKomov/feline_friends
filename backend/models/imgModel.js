import * as console from "node:console";
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';
import {db} from "../config/db.js";

// Destructure environment variables
const {MY_BUCKET_NAME, CAT_HOLDER, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION} = process.env

// Initialize the S3 client
const s3 = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});

// Function to upload a file to S3
export const uploadToS3 = async (fileBuffer, origin_name, type) => {
    // Define parameters for the S3 upload
    const uploadParams = {
        Bucket: MY_BUCKET_NAME,
        Key: `${CAT_HOLDER}/${Date.now()}_${origin_name}`, // Unique key for the file
        Body: fileBuffer, // File buffer to be uploaded
        ContentType: 'jpeg', // MIME type of the file
    }

    try {
        // Send the PutObjectCommand to S3
        await s3.send(new PutObjectCommand(uploadParams));
        // Generate URL for accessing the uploaded file
        const fileUrl = `https://${MY_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
        console.log('File uploaded successfully:', fileUrl);
        return fileUrl; // Return the URL of the uploaded file
    } catch (error) {
        console.error('Error uploading file:', error);
        return {error: 'Failed to upload file'}; // Return an error message or object
    }
};

// Function to create a cat record in the database
export const createCat = async (cat) => {
    try {
        // Insert cat record and retrieve the inserted ID
        const [catIdObject] = await db("cats").insert(cat).returning("id");
        const catId = catIdObject.id;
        console.log('addUser to db: ', JSON.stringify(cat));
        return catId; // Return the ID of the newly created cat
    } catch (error) {
        console.error('Error adding user to db: ', error);
        throw error; // Rethrow the error for handling by the caller
    }
}

// Function to get all cat records from the database
export const allCats = async () => {
    try {
        // Query the database for all cats, limited to 6 results
        const cats = await db('cats')
            .select('*')
            .limit(6);
        console.log('allCats - Cats were obtained from the database');
        return cats; // Return the list of cats
    } catch (error) {
        console.error('Error obtaining cats from db: ', error);
        throw error; // Rethrow the error for handling by the caller
    }
};
