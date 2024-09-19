//Validation email, used reqExp
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Mapping the user request to the user for db
export function mapUserReqToDb(userReq) {
    //Check if all required
    if (!userReq.name || !userReq.username || !userReq.email) {
        throw new Error("Missing required fields");
    }
    //Check email
    if (!isValidEmail(userReq.email)) {
        throw new Error("Invalid email format");
    }
    //Return userDb
    return {
        name: userReq.name,
        username: userReq.username,
        email: userReq.email
    };
}

// Mapping the user request to the user credentials.
// It returns the username and password (which will be hashed later).
export function mapUserReqtoUserCredentials(userReq) {
    // Check if the password is provided in the request
    if (!userReq.password) {
        throw new Error("Missing password field");
    }

    // Return the username and the plain password (not hashed yet)
    return {
        username: userReq.username,
        password: userReq.password
    };
}

//Mapping the userDB to the response
export function mapUserDbtoUserRes(userDb, token) {
    return {
        name: userDb.name,
        username: userDb.username,
        token
    };
}