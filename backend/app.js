import express from "express";
import {routerUser} from "./routes/userRouter.js";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import {errorHandler} from "./middleware/commonMiddleware.js";
import {routerGoogleApi} from "./routes/googleApiRouter.js";

// Defining ways to work with .html
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

// Setting the static folder as 'frontend'
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// starting with the index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});


app.use(express.json());
app.use('/', routerUser);
app.use('/api', routerGoogleApi);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));