import {db} from '../config/db.js';
import console from "node:console";

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
            return { error: 'User with this username or email already exists' };
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
}

// Function to fetch a user by either username or email from the 'users' table
export async function fetchUserByNameOrEmail(usernameOrEmail) {
    try {
        // Query the 'users' table where username or email matches the input, return the first result
        return await db('users')
            .where('username', usernameOrEmail)
            .orWhere('email', usernameOrEmail)
            .first();
    } catch (error) {
        // Log any errors encountered during the query
        console.error('fetchUserByNameOrEmail error: ', error);
        throw error;
    }
}

// Function to fetch hashed password by user id from the 'hashpwd' table
export async function fetchHashpwd(id) {
    try {
        // Query the 'hashpwd' table where the user_id matches the input, return the first result
        return await db('hashpwd')
            .where('user_id', id)
            .first();
    } catch (error) {
        // Log any errors encountered during the query
        console.error('fetchHashpwd error: ', error);
        throw error;
    }
}

export async function insertToken(data) {
    try {
        await db("refresh_tokens").insert(data)
    } catch (error) {
        console.error('insertToken error: ', error);
        throw error;
    }
}

export async function fetchToken(data) {
    try {
        return await db("refresh_tokens")
            .where(data)
            .first();
    } catch (error) {
        console.error('fetchToken error: ', error);
        throw error;
    }
}


export async function fetchAllUsers() {
    try {
        return await db("users").select("*");
    } catch (error) {
        console.error('fetchAllUsers error: ', error);
        throw error;
    }
}

export async function fetchUserById(userId) {
    try {
        return await db("users")
            .where('id', userId)
            .first();
    } catch (error) {
        console.error('fetchUserById error: ', error);
        throw error;
    }
}
