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
        const userExists = await checkUserExists(trx, user.username, user.email);

        if (userExists) {
            await trx.rollback();
            throw new Error('User with this username or email already exists');
        }

        // create user and get id
        const [userId] = await trx("users").insert(user).returning("id");
        console.log('added user=', userId);
        // add id userId from db, password_hash
        await trx("hashpwd").insert({
            user_id: userId.id,
            password_hash: hashpwd.password_hash
        });

        await trx.commit();

        // data for return
        const userData = {
            ...user,
            id: userId.id
        };

        console.log('addUser to db: ', JSON.stringify(userData));
        return userData;

    } catch (error) {
        await trx.rollback();
        console.error('Error adding user to db: ', error);
        throw error;
    }
};


export async function fetchHashpwd(userHashpwd) {
    try {
        const data = await db("hashpwd")
            .where(userHashpwd)
            .first();
        if (!data) {
            console.log('User not found: ', userHashpwd);
            return null;
        } else {
            console.log('User found: ', data);
        }
        return data;
    } catch (error) {
        console.error('fetchHashpwd error: ', error);
        throw error;
    }
};

export async function fetchAllUsers() {
    try {
        const data = await db("users").select("*");
        return data;
    } catch (error) {
        console.error('fetchAllUsers error: ', error);
        throw error;
    }
};

export async function fetchUserById(userId) {
    try {
        const data = await db("users")
            .where('id', userId)
            .first();
        return data;
    } catch (error) {
        console.error('fetchUserById error: ', error);
        throw error;
    }
};

export async function updateUser(userId, user) {
    try {
        const data = await db("users")
            .where('id', userId)
            .update(user)
            .returning('*');
        return data;
    } catch (error) {
        console.error('updateUser error: ', error);
        throw error;
    }
};