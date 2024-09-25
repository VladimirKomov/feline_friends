CREATE TABLE users (
                       id SERIAL PRIMARY KEY,        -- Unique identifier of the user
                       name VARCHAR(100) NOT NULL,   -- User's name
                       username VARCHAR(100) NOT NULL UNIQUE,  -- Unique username
                       email VARCHAR(100) NOT NULL UNIQUE      -- Unique email
);
CREATE TABLE hashpwd (
                         id SERIAL PRIMARY KEY,      -- Unique identifier of the password hash
                         user_id INTEGER NOT NULL,   -- Reference to the user
                         password_hash TEXT NOT NULL,-- Password hash
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp of creation
                         FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
CREATE TABLE refresh_tokens (
                                id SERIAL PRIMARY KEY,         -- Unique identifier of the token
                                user_id INTEGER NOT NULL,      -- Reference to the user
                                token TEXT NOT NULL,           -- The refresh token itself
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Token creation timestamp
                                expires_at TIMESTAMP NOT NULL, -- Expiry timestamp of the token
                                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE points (
                        id SERIAL PRIMARY KEY,        -- Unique identifier of the point
                        name VARCHAR(100) NOT NULL,   -- Point's name
                        latitude DECIMAL(9, 6),       -- Latitude
                        longitude DECIMAL(9, 6),      -- Longitude
                        number_of_cats INTEGER,       -- Number of cats at the point
                        created_at TIMESTAMP DEFAULT NOW()  -- Timestamp of creation
);
CREATE TABLE feedings (
                          id SERIAL PRIMARY KEY,        -- Unique identifier of the feeding record
                          user_id INTEGER NOT NULL,     -- Reference to the user
                          point_id INTEGER NOT NULL,    -- Reference to the point
                          feeding_timestamp TIMESTAMP NOT NULL,   -- Feeding timestamp
                          created_at TIMESTAMP DEFAULT NOW(),  -- Timestamp of creation
                          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                          FOREIGN KEY (point_id) REFERENCES points(id) ON DELETE CASCADE
);
CREATE TABLE cats (
                      id SERIAL PRIMARY KEY,                -- Unique identifier of the cat
                      point_id INTEGER NOT NULL REFERENCES points(id) ON DELETE CASCADE, -- Reference to the point
                      description TEXT,                    -- Cat description
                      health_issues TEXT,                  -- Cat health issues
                      created_at TIMESTAMP DEFAULT NOW(),  -- Timestamp of creation
                      image_url TEXT                       -- URL to the image in Amazon S3
);