import {db} from '../config/db.js';
import * as console from "node:console";

async function checkUserExists(trx, username, email) {
    const existingUser = await trx("users")
        .where({ username })
        .orWhere({ email })
        .first();

    return existingUser !== undefined;
}

export async function addUserAndHashpwd(user, hashpwd) {
    const trx = await db.transaction(); //start transaction
    try {
        // Check if the user with the given username or email already exists
        const userExists = await checkUserExists(trx, user.username, user.email);

        if (userExists) {
            await trx.rollback(); // Rollback the transaction if the user already exists
            throw new Error('User with this username or email already exists');
        }

        // Insert the user into the "users" table and return the new user ID
        const [userId] = await trx("users").insert(user).returning("id");
        console.log('added user=', userId);
        // Insert the hashed password into the "hashpwd" table
        await trx("hashpwd").insert({
            user_id: userId.id,
            password_hash: hashpwd.password_hash
        });

        await trx.commit(); // Commit the transaction if everything succeeds

        // Prepare the user data object to return
        const userData = {
            ...user,
            id: userId.id
        };

        console.log('addUser to db: ', JSON.stringify(userData));
        return userData; // Return the user data to the caller

    } catch (error) {
        await trx.rollback(); // Rollback the transaction if an error occurs
        console.error('Error adding user to db: ', error);
        throw error; // Re-throw the error to propagate it further
    }
};

export async function fetchUserByNameOrEmail(usernameOrEmail) {
    try {
        const user = await db('users')
            .where('username', usernameOrEmail)
            .orWhere('email', usernameOrEmail)
            .first();

        return user;
    } catch (error) {
        console.error('fetchHashpwd error: ', error);
        throw error;
    }
};

export async function fetchHashpwd(id) {
    try {
        const user = await db('hashpwd')
            .where('user_id', id)
            .first();

        return user;
    } catch (error) {
        console.error('fetchHashpwd error: ', error);
        throw error;
    }
};

export async function fetchAllUsers() {
    try {
        return await db("users").select("*");
    } catch (error) {
        console.error('fetchAllUsers error: ', error);
        throw error;
    }
};

export async function fetchUserById(userId) {
    try {
        return await db("users")
            .where('id', userId)
            .first();
    } catch (error) {
        console.error('fetchUserById error: ', error);
        throw error;
    }
};

export async function updateUser(userId, user) {
    try {
        return  await db("users")
            .where('id', userId)
            .update(user)
            .returning('*');
    } catch (error) {
        console.error('updateUser error: ', error);
        throw error;
    }
};