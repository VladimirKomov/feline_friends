import knex from "knex";
import dotenv from "dotenv";

// Load environment variables from a .env file
dotenv.config();
// Extract the environment variables needed to
const {PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT} = process.env;

// Export the database configuration
export const db = knex({
    client: 'pg',
    connection: {
        host: PGHOST,
        database: PGDATABASE,
        user: PGUSER,
        password: PGPASSWORD,
        port: PGPORT,
        ssl: {rejectUnauthorized: false}
    }
});