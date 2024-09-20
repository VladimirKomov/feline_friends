// Getting elements
const button = document.getElementById('buttonJoinFriends');
const loginButton = document.getElementById('login');
const loginForm = document.getElementById('loginForm');
const closeButton = document.querySelector('.close');
const errorMessage = document.getElementById('errorMessage');
const welcomeMessage = document.getElementById('welcomeMessage');
//we remove it or show it on the form
const joinButton = document.getElementById('buttonJoinFriends');
const infoTextElement = document.getElementById('infoText');

// Checking if the user is already logged in
window.addEventListener('load', () => {
    localStorage.clear();
    const storedUsername = localStorage.getItem('username');

    const welcomeMessage = document.getElementById('welcomeMessage');
    const loginButton = document.getElementById('login');
    const joinButton = document.getElementById('buttonJoinFriends');
    const infoTextElement = document.getElementById('infoText');

    if (storedUsername && welcomeMessage && loginButton && joinButton && infoTextElement) {
        // If the user is logged in, display the welcome message
        welcomeMessage.style.display = 'block'; // Show the welcome message
        welcomeMessage.innerHTML = `<p>Welcome back, ${storedUsername}!</p>`;
        loginButton.style.display = 'none'; // Hide the login button
        joinButton.style.display = 'none'; // Hide the join button
        infoTextElement.style.display = 'none'; // Hide the informational text
    } else {
        // If the user is not logged in, show the elements
        loginButton.style.display = 'block';
        joinButton.style.display = 'block';
        infoTextElement.style.display = 'block';
    }
});

// Adding an event listener for the click event
button.addEventListener('click', function() {
    // Redirecting to the registration page
    window.location.href = '/register.html'; // Change to the actual path to the registration page
});

// Displaying the login form when the "Login" button is clicked
loginButton.addEventListener('click', () => {
    loginForm.style.display = 'block';
});

// Closing the login form when the "X" button is clicked
closeButton.addEventListener('click', () => {
    loginForm.style.display = 'none';
});

// Handling form submission
const loginFormElement = document.getElementById('loginFormElement');
loginFormElement.addEventListener('submit', async function (event) {
    event.preventDefault(); // Preventing the default form behavior

    // Getting field values
    const usernameOrEmail = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // Send request to the server
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({usernameOrEmail, password})
        });

        const result = await response.json();
        console.log('Get response', result);
        if (response.ok) {
            // Saving the token and username in localStorage
            localStorage.setItem('accessToken', result.data.accessToken);
            localStorage.setItem('refreshToken', result.data.refreshToken);
            localStorage.setItem('username', result.data.username);
            console.log('Logged in successfully!');
            // Closing the login form
            loginForm.style.display = 'none';
            // Showing a welcome message on the main page
            welcomeMessage.style.display = 'block';
            welcomeMessage.innerHTML = `<p>Welcome, ${result.data.username}!</p>`;
        } else {
            // Showing an error message
            console.log('Unable to log in.', result.error);
            errorMessage.style.display = 'block';
            errorMessage.innerHTML = '<p>Invalid username or password.</p><p>Please try again.</p>';
        }
    } catch (error) {
        console.error(error);
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = '<p>Something went wrong.</p><p>Please try again.</p>';
    }
});


