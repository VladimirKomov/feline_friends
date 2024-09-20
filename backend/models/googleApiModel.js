import * as console from "node:console";
import {db} from "../config/db.js";

export async function fetchAllPoints() {
    try {
        console.log(db("points").select("*"));
        return await db("points").select("*");
    } catch (error) {
        console.error('fetchAllUsers error: ', error);
        throw error;
    }
}


async function checkPoint(trx, latitude, longitude) {

    const existingPoint = await trx("points")
        .whereRaw(`
            (6371000 * acos(
                cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) +
                sin(radians(?)) * sin(radians(latitude))
            )) < 100
        `, [latitude, longitude, latitude])
        .first();
    return existingPoint;
}

export async function createPoint(point) {
    const trx = await db.transaction(); //start transaction
    try {
        // Check if the point with the given latitude and longitude
        const pointExists = await checkPoint(trx, point.latitude, point.longitude);
        console.log(pointExists);
        if (pointExists) {
            await trx.rollback(); // Rollback the transaction if the user already exists
            return {error: "There is already a point within a hundred meters"};
        }

            // Insert the user into the "users" table and return the new user ID
        const [pointId] = await trx("points").insert(point).returning("id");
        console.log('added point =', pointId);

        // await trx("usersPoint").insert({
        //     user_id: userId,
        //     point_id: pointId,
        // });

        await trx.commit(); // Commit the transaction if everything succeeds

        // Prepare the user data object to return
        const pointData = {
            ...point,
            id: pointId
        };

        console.log('addPoint to db: ', JSON.stringify(pointData));
        return pointData; // Return the user data to the caller

    } catch (error) {
        await trx.rollback(); // Rollback the transaction if an error occurs
        console.error('Error adding user to db: ', error);
        throw error; // Re-throw the error to propagate it further
    }
};