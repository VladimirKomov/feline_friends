# Hi everyone 👋
## Here you will find a website to help volunteers who feed and help homeless cats in Tel Aviv

### The Feline Friends TA website can be found in the public domain at:
## Visit website: [Feline Friends TA](https://mighty-beach-70402-96eee71ac1d0.herokuapp.com/)

![N|Solid](https://img.icons8.com/?size=100&id=raZsEA7peQ1p&format=png&color=000000)

#### On the site, registered users can:
- See cat feeding locations on the map with the number of cats✨
- Mark feeding locations on the map✨
- Upload photos with descriptions of cats and health problems with reference to the point✨
- View the database of homeless animals added earlier✨

## Features
1. **Google Maps** is used for user interaction with the map via the **Maps JavaScript API**.
2. To store information about feeding points, **neon.tech** databases are used.
3. **Amazon S3** is used to store photos.
4. To increase the level of authorization reliability, two different **JWT (JSON Web Token)** are used, each of which performs its own role in the authentication and authorization process.

> Brief description of the libraries used
>
> 1. **@aws-sdk/client-s3** : AWS SDK for interacting with Amazon S3 service, used for uploading, downloading, and managing objects in S3 buckets.
> 2. **bcrypt** : Library for hashing passwords securely using the bcrypt algorithm.
> 3. **bcryptjs** : A JavaScript implementation of bcrypt for hashing passwords without the need for native bindings, making it more portable.
> 4. **cropperjs** : A JavaScript library for cropping images in the browser, allowing users to select and crop image areas.
> 5. **dotenv** : Module that loads environment variables from a `.env` file into `process.env`, simplifying environment configuration.
> 6. **express** : A web framework for Node.js used to build web applications and APIs with minimal configuration.
> 7. **express-validator** : Middleware for Express.js that provides validation and sanitization for handling user inputs.
> 8. **jsonwebtoken** : A library for generating and verifying JSON Web Tokens (JWTs), commonly used for authentication.
> 9. **knex** : A SQL query builder for Node.js, compatible with various databases like PostgreSQL, MySQL, and SQLite.
> 10. **multer** : Middleware for handling multipart/form-data, primarily used for uploading files in Node.js applications.
> 11. **pg** : A PostgreSQL client for Node.js that allows connecting to and interacting with PostgreSQL databases.
> 12. **sharp** : A high-performance image processing library for resizing, converting, and manipulating images.

### Technologies
- [JavaScript](https://www.w3schools.com/js/DEFAULT.asp)

![JavaScript](https://img.icons8.com/?size=100&id=108784&format=png&color=000000)

- Node.js

![Node.js](https://img.icons8.com/?size=100&id=33039&format=png&color=000000)

- [Neon.tech](https://neon.tech)

![Neon.tech](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY6nnndCqRbP7Vy7QtwR3DhU9N9JbCashZWg&s)

- [Maps JavaScript API](https://console.cloud.google.com/apis/api/maps-backend.googleapis.com/overview?hl=ru&project=numeric-mile-436012-t8)

![Google Maps](https://img.icons8.com/?size=100&id=21896&format=png&color=000000)

- HTML

![HTML](https://img.icons8.com/?size=100&id=20909&format=png&color=000000)

- CSS

![CSS](https://img.icons8.com/?size=100&id=7gdY5qNXaKC0&format=png&color=000000)

- Amazon S3

![Amazon S3](https://img.icons8.com/?size=100&id=33039&format=png&color=000000)

- JSON Web Token

![JSON Web Token](https://img.icons8.com/?size=100&id=rHpveptSuwDz&format=png&color=000000)

### Example `.env` file

Add a file named `.env` to the root of your project and copy the following settings into it (replace the values with your own):

```dotenv
PGHOST='ep-withered-tooth-a2vtyguj.eu-central-1.aws.neon.tech'
PGDATABASE='neondb'
PGUSER='neondb_owner'
PGPASSWORD='your_password'
PGPORT=5432
PORT=3000
JWT_SECRET='your_jwt_secret'
JWT_EXPIRES_IN='15m'
REFRESH_TOKEN_SECRET='your_refresh_token_secret'
REFRESH_TOKEN_EXPIRES_IN='7d'
KEY_GOOGLEAPI='your_google_api_key'
MY_BUCKET_NAME='your_bucket_name'
CAT_HOLDER='cats'
AWS_ACCESS_KEY_ID='your_aws_access_key_id'
AWS_SECRET_ACCESS_KEY='your_aws_secret_access_key'
AWS_REGION='eu-north-1'
```

## Database Schema

For information on how to create the database tables, refer to the `backend/config/create_tables.sql` file located in the project.