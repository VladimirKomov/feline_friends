CREATE TABLE users (
                       id SERIAL PRIMARY KEY,        -- Уникальный идентификатор пользователя
                       name VARCHAR(100) NOT NULL,   -- Имя пользователя
                       username VARCHAR(100) NOT NULL UNIQUE,  -- Уникальное имя пользователя
                       email VARCHAR(100) NOT NULL UNIQUE      -- Уникальный email
);

CREATE TABLE hashpwd (
                         id SERIAL PRIMARY KEY,
                         user_id INTEGER NOT NULL,
                         password_hash TEXT NOT NULL,
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE refresh_tokens (
                                id SERIAL PRIMARY KEY,         -- Уникальный идентификатор токена
                                user_id INTEGER NOT NULL,      -- Ссылка на пользователя
                                token TEXT NOT NULL,           -- Сам refresh token
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Время создания токена
                                expires_at TIMESTAMP NOT NULL, -- Время истечения срока действия
                                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE points (
    id SERIAL PRIMARY KEY,        -- Уникальный идентификатор пользователя
    name VARCHAR(100) NOT NULL,   -- Имя пользователя
    latitude DECIMAL(9, 6),       -- Широта
    longitude DECIMAL(9, 6),      -- Долгота
    number_of_cats INTEGER,       -- Количество кошек в точке
    created_at TIMESTAMP DEFAULT NOW()  -- Дата и время добавлени
);