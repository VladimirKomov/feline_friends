window.addEventListener('load', initializeApp);

// Initialize the application
async function initializeApp() {
    const joinButton = document.getElementById('buttonJoinFriends');
    const loginButton = document.getElementById('login');
    const logoutButton = document.getElementById('logout');
    const loginForm = document.getElementById('loginForm');
    const closeButton = document.querySelector('.close');
    const errorMessage = document.getElementById('errorMessage');
    const loginFormElement = document.getElementById('loginFormElement');
    const infoTextElement = document.getElementById('infoText');

    await renderElements(loginButton, joinButton, logoutButton, infoTextElement);

    // Logout event handler
    logoutButton?.addEventListener('click', handleLogout);

    // Event for the "Join" button
    joinButton?.addEventListener('click', () => {
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
    loginFormElement?.addEventListener('submit', async (event) => {
        event.preventDefault();
        await handleLogin(loginForm, errorMessage, infoTextElement, loginButton, joinButton, logoutButton);
    });
}

// Logout function
function handleLogout() {
    clearUserSession();
    window.location.href = '/index.html'; // Redirect to login or main page
}

// Clear user session
function clearUserSession() {
    localStorage.clear();
    alert('You have been logged out.');
}

// Function to handle login
async function handleLogin(loginForm, errorMessage, infoTextElement, loginButton, joinButton, logoutButton) {
    const usernameOrEmail = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await sendLoginRequest(usernameOrEmail, password);
        const result = await response.json();

        if (response.ok) {
            saveUserSession(result.data);
            loginForm.style.display = 'none';
            renderElements(loginButton, joinButton, logoutButton, infoTextElement);
        } else {
            displayErrorMessage(errorMessage, 'Invalid username or password. Please try again.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        displayErrorMessage(errorMessage, 'Something went wrong. Please try again.');
    }
}

// Send login request
async function sendLoginRequest(usernameOrEmail, password) {
    return fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usernameOrEmail, password }),
    });
}

// Save user session
function saveUserSession(data) {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('username', data.username);
    console.log('Logged in successfully!');
}

// Display error message
function displayErrorMessage(element, message) {
    element.style.display = 'block';
    element.innerHTML = `<p>${message}</p>`;
}

// Function to check token validity
async function checkTokenValidity(accessToken) {
    try {
        const response = await fetch('/users/check_token', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (response.status === 403) {
            console.log('Access token is invalid, trying to refresh...');
            const refreshToken = localStorage.getItem('refreshToken');
            const newAccessToken = await refreshAccessToken(refreshToken); // Попробуем обновить токен

            console.log('Get newAccessToken: ', newAccessToken);
            if (newAccessToken) {
                // Обновляем accessToken в localStorage
                localStorage.setItem('accessToken', newAccessToken);
                return true; // Токен успешно обновлен
            } else {
                return false; // Обновление токена не удалось
            }
        }

        return response.ok; // Если accessToken валиден
    } catch (error) {
        console.error('Error checking token:', error);
        return false;
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
            body: JSON.stringify({ refreshToken }),
        });

        const result = await response.json();
        return response.ok ? result.data : null;
    } catch (error) {
        console.error('Error during refresh token:', error);
        return null;
    }
}

// Function to check user authorization and refresh token if necessary
export async function checkAuthorization() {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken) {
        if (await checkTokenValidity(accessToken)) {
            return true;
        } else if (refreshToken) {
            console.log('Refresh token is expired.');
            const newAccessToken = await refreshAccessToken(refreshToken);
            if (newAccessToken) {
                localStorage.setItem('accessToken', newAccessToken);
                return true;
            }
        }
    }
    return false;
}

// Render UI elements based on authorization status
async function renderElements(loginButton, joinButton, logoutButton, infoTextElement) {
    const isAuthorized = await checkAuthorization();
    const storedUsername = localStorage.getItem('username');

    if (isAuthorized) {
        infoTextElement.innerHTML = `<p>Welcome back, ${storedUsername}!</p>`;
        loginButton.style.display = 'none';
        joinButton.style.display = 'none';
        logoutButton.style.display = 'block';
    } else {
        loginButton.style.display = 'block';
        joinButton.style.display = 'block';
        infoTextElement.innerHTML = '<p>Complete Care for Tel Aviv Strays: From Food to Forever Homes</p>';
        logoutButton.style.display = 'none';
    }
}
