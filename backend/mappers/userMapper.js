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
export function mapUserDbtoUserRes(userDb, accessToken, refreshToken) {
    return {
        name: userDb.name,
        username: userDb.username,
        accessToken,
        refreshToken
    };
}

//Mapping the userDB to the response simple
export function mapUserDebtorUserSimpleRes(userDb) {
    return {
        id: userDb.id,
        name: userDb.name,
        username: userDb.username,
    };
}

//Mapping the token to save to db
export function mapUserTokenToTokenDb(userId, refreshToken, expiresIn) {
    return {
        user_id: userId,
        token: refreshToken,
        expires_at: getExpirationDate(expiresIn)
    };
}

//get expiry date
function getExpirationDate(expiresIn) {
    const match = expiresIn.match(/^(\d+)([dhm])$/); // Searching for a number and 'd', 'h', 'm'
    if (!match) {
        throw new Error('Invalid format for expiresIn');
    }
    const timeValue = parseInt(match[1]); // Numeric value
    const timeUnit = match[2]; // Time unit ('d', 'h', 'm')
    let expirationDate;
    switch (timeUnit) {
        case 'd':
            expirationDate = new Date(Date.now() + timeValue * 24 * 60 * 60 * 1000);
            break;
        case 'h':
            expirationDate = new Date(Date.now() + timeValue * 60 * 60 * 1000);
            break;
        case 'm':
            expirationDate = new Date(Date.now() + timeValue * 60 * 1000);
            break;
        default:
            throw new Error('Unsupported time unit in REFRESH_TOKEN_EXPIRES_IN');
    }
    return expirationDate;
}