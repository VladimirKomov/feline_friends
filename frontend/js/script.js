window.addEventListener('load', () => {
    initializeApp();
});

// Инициализация приложения
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

    // Событие для выхода из системы
    logoutButton?.addEventListener('click', () => {
        localStorage.clear();
        renderElements(loginButton, joinButton, logoutButton, infoTextElement);
    });

    // Событие на кнопку "Присоединиться"
    joinButton?.addEventListener('click', function() {
        window.location.href = '/register.html'; // Путь к странице регистрации
    });

    // Событие на кнопку "Войти"
    loginButton?.addEventListener('click', () => {
        loginForm.style.display = 'block';
    });

    // Закрытие формы логина
    closeButton?.addEventListener('click', () => {
        loginForm.style.display = 'none';
    });

    // Обработка формы логина
    loginFormElement?.addEventListener('submit', async function (event) {
        event.preventDefault();
        await handleLogin(loginForm, errorMessage, infoTextElement, loginButton, joinButton, logoutButton);
    });
}

// Функция выхода из системы
function logout() {
    // Очистка всех данных пользователя из localStorage
    localStorage.clear();

    // Можно перенаправить пользователя на страницу входа или главную страницу
    window.location.href = '/login.html'; // или '/index.html'

    // Также можно показать сообщение о выходе (необязательно)
    alert('You have been logged out.');
}

// Функция для проверки валидности токенов
async function checkTokenValidity(accessToken) {
    try {
        const response = await fetch('/users/check_token', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.ok; // Вернем true, если токен валиден
    } catch (error) {
        console.error('Error checking token:', error);
        return false; // Вернем false в случае ошибки
    }
}

// Функция для обновления accessToken через refreshToken
async function refreshAccessToken(refreshToken) {
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
            // Возвращаем новый accessToken
            return result.accessToken;
        } else {
            console.error('Error refreshing token:', result.message);
            return null; // Вернем null в случае ошибки
        }
    } catch (error) {
        console.error('Error during refresh token:', error);
        return null; // Вернем null в случае ошибки
    }
}

// Функция для обновления accessToken
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

// Функция для проверки авторизации пользователя
async function checkAuthorization() {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken) {
        const isTokenValid = await checkTokenValidity(accessToken);

        if (isTokenValid) {
            return true; // Токен действителен
        } else if (refreshToken) {
            const newAccessToken = await refreshAccessToken(refreshToken);
            if (newAccessToken) {
                localStorage.setItem('accessToken', newAccessToken);
                return true; // Токен успешно обновлён
            } else {
                console.error('Failed to refresh access token');
                return false; // Ошибка обновления токена
            }
        }
    }
    console.error('Authorization failed: no valid token');
    return false; // Пользователь не авторизован
}

export async function checkAndHandleAuthorization() {
    try {
        const isAuthorized = await checkAuthorization();
        if (isAuthorized) {
            return true; // Пользователь авторизован
        } else {
            // Пользователь не авторизован
            return false;
        }
    } catch (error) {
        console.error('Error during authorization check:', error);
        alert('An error occurred while checking authorization. Please try again.');
        return false;
    }
}


// Функция для отображения элементов интерфейса
function renderElements(loginButton, joinButton, logoutButton, infoTextElement) {
    const storedUsername = localStorage.getItem('username');
    console.log('Welcome ', storedUsername);

    if (storedUsername) {
        infoTextElement.innerHTML = `<p>Welcome back, ${storedUsername}!</p>`;
        loginButton.style.display = 'none'; // Скрываем кнопку логина
        joinButton.style.display = 'none'; // Скрываем кнопку "Присоединиться"
        logoutButton.style.display = 'block'; // Показываем кнопку "Выход"
    } else {
        // Если пользователь не залогинен
        loginButton.style.display = 'block'; // Показываем кнопку логина
        joinButton.style.display = 'block'; // Показываем кнопку "Присоединиться"
        infoTextElement.innerHTML = '<p>Complete Care for Tel Aviv Strays: From Food to Forever Homes</p>';
        logoutButton.style.display = 'none'; // Скрываем кнопку "Выход"
    }
}

// Обработчик формы логина
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
            // Сохранение токена и имени пользователя в localStorage
            localStorage.setItem('accessToken', result.data.accessToken);
            localStorage.setItem('refreshToken', result.data.refreshToken);
            localStorage.setItem('username', result.data.username);

            console.log('Logged in successfully!');
            // Закрытие формы логина
            loginForm.style.display = 'none';
            renderElements(loginButton, joinButton, logoutButton, infoTextElement);
        } else {
            // Показ сообщения об ошибке
            errorMessage.style.display = 'block';
            errorMessage.innerHTML = '<p>Invalid username or password.</p><p>Please try again.</p>';
        }
    } catch (error) {
        console.error('Error during login:', error);
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = '<p>Something went wrong.</p><p>Please try again.</p>';
    }
}

