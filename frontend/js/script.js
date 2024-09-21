window.addEventListener('load', () => {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    const joinButton = document.getElementById('buttonJoinFriends');
    const loginButton = document.getElementById('login');
    const logoutButton = document.getElementById('logout');
    const loginForm = document.getElementById('loginForm');
    const closeButton = document.querySelector('.close');
    const errorMessage = document.getElementById('errorMessage');
    const loginFormElement = document.getElementById('loginFormElement');
    const infoTextElement = document.getElementById('infoText');

    renderElements(loginButton, joinButton, logoutButton, infoTextElement);

    // Logout event handler
    logoutButton?.addEventListener('click', () => {
        localStorage.clear();
        renderElements(loginButton, joinButton, logoutButton, infoTextElement);
    });

    // Event for the "Join" button
    joinButton?.addEventListener('click', function() {
        window.location.href = '/register.html'; // Path to registration page
    });

    // Event for the "Login" button
    loginButton?.addEventListener('click', () => {
        loginForm.style.display = 'block';
    });

    // Close login form
    closeButton?.addEventListener('click', () => {
        loginForm.style.display = 'none';
    });

    // Handle login form submission
    loginFormElement?.addEventListener('submit', async function (event) {
        event.preventDefault();
        await handleLogin(loginForm, errorMessage, infoTextElement, loginButton, joinButton, logoutButton);
    });
}

// Logout function
function logout() {
    // Clear all user data from localStorage
    localStorage.clear();

    // Redirect the user to the login page or main page
    window.location.href = '/login.html'; // or '/index.html'

    // Optionally show a logout message
    alert('You have been logged out.');
}

// Function to check token validity
async function checkTokenValidity(accessToken) {
    try {
        const response = await fetch('/users/check_token', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.ok; // Return true if the token is valid
    } catch (error) {
        console.error('Error checking token:', error);
        return false; // Return false in case of an error
    }
}

// Function to refresh the accessToken using the refreshToken
export async function refreshAccessToken(refreshToken) {
    try {
        const response = await fetch('/users/refresh_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken })
        });

        const result = await response.json();

        if (response.ok) {
            // Return the new accessToken
            return result.accessToken;
        } else {
            console.error('Error refreshing token:', result.message);
            return null;
        }
    } catch (error) {
        console.error('Error during refresh token:', error);
        return null;
    }
}

// Function to update the accessToken
async function updateAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
        const newAccessToken = await refreshAccessToken(refreshToken);

        if (newAccessToken) {
            localStorage.setItem('accessToken', newAccessToken);
            console.log('Access token updated successfully');
        } else {
            console.error('Failed to refresh access token');
            logout();
        }
    } else {
        console.error('No refresh token found');
        logout();
    }
}

// Function to check user authorization
async function checkAuthorization() {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken) {
        const isTokenValid = await checkTokenValidity(accessToken);

        if (isTokenValid) {
            return true; // Token is valid
        } else if (refreshToken) {
            const newAccessToken = await refreshAccessToken(refreshToken);
            if (newAccessToken) {
                localStorage.setItem('accessToken', newAccessToken);
                return true; // Token successfully refreshed
            } else {
                console.error('Failed to refresh access token');
                return false; // Token refresh failed
            }
        }
    }
    console.error('Authorization failed: no valid token');
    return false; // User is not authorized
}

export async function checkAndHandleAuthorization() {
    try {
        const isAuthorized = await checkAuthorization();
        if (isAuthorized) {
            return true; // User is authorized
        } else {
            // User is not authorized
            return false;
        }
    } catch (error) {
        console.error('Error during authorization check:', error);
        alert('An error occurred while checking authorization. Please try again.');
        return false;
    }
}


// Function to render UI elements
async function renderElements(loginButton, joinButton, logoutButton, infoTextElement) {

    const isAuthorized = await checkAndHandleAuthorization();

    if (isAuthorized) {
        const storedUsername = localStorage.getItem('username');
        console.log('Welcome ', storedUsername);
        infoTextElement.innerHTML = `<p>Welcome back, ${storedUsername}!</p>`;
        loginButton.style.display = 'none'; // Hide the login button
        joinButton.style.display = 'none'; // Hide the "Join" button
        logoutButton.style.display = 'block'; // Show the "Logout" button
    } else {
        // If the user is not logged in
        loginButton.style.display = 'block'; // Show the login button
        joinButton.style.display = 'block'; // Show the "Join" button
        infoTextElement.innerHTML = '<p>Complete Care for Tel Aviv Strays: From Food to Forever Homes</p>';
        logoutButton.style.display = 'none'; // Hide the "Logout" button
    }
}

// Login form handler
async function handleLogin(loginForm, errorMessage, infoTextElement, loginButton, joinButton, logoutButton) {
    const usernameOrEmail = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usernameOrEmail, password })
        });

        const result = await response.json();
        console.log('Get response', result);

        if (response.ok) {
            // Save the token and username in localStorage
            localStorage.setItem('accessToken', result.data.accessToken);
            localStorage.setItem('refreshToken', result.data.refreshToken);
            localStorage.setItem('username', result.data.username);

            console.log('Logged in successfully!');
            // Close the login form
            loginForm.style.display = 'none';
            renderElements(loginButton, joinButton, logoutButton, infoTextElement);
        } else {
            // Show error message
            errorMessage.style.display = 'block';
            errorMessage.innerHTML = '<p>Invalid username or password.</p><p>Please try again.</p>';
        }
    } catch (error) {
        console.error('Error during login:', error);
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = '<p>Something went wrong.</p><p>Please try again.</p>';
    }
}
