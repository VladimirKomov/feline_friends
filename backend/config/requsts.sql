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

