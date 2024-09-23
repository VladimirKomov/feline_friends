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

CREATE TABLE feedings (
                          id SERIAL PRIMARY KEY,        -- Уникальный идентификатор записи кормления
                          user_id INTEGER NOT NULL,     -- Ссылка на пользователя
                          point_id INTEGER NOT NULL,    -- Ссылка на точку
                          feeding_timestamp TIMESTAMP NOT NULL,   -- Дата и время кормления
                          created_at TIMESTAMP DEFAULT NOW(),  -- Дата и время создания записи
                          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                          FOREIGN KEY (point_id) REFERENCES points(id) ON DELETE CASCADE
);

CREATE TABLE cats (
                      id SERIAL PRIMARY KEY,                -- Уникальный идентификатор кота
                      point_id INTEGER NOT NULL REFERENCES points(id) ON DELETE CASCADE, -- Идентификатор точки, на которую ссылается кот
                      description TEXT,                    -- Описание кота
                      health_issues TEXT,                  -- Проблемы со здоровьем кота
                      created_at TIMESTAMP DEFAULT NOW(),  -- Дата и время добавления записи
                      image_url TEXT                       -- Ссылка на изображение в Amazon S3
);

