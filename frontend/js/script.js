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
