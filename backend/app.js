import express from "express";
import {routerUser} from "./routes/userRouter.js";
import {errorHandler} from "./controllers/userController.js";
import dotenv from "dotenv";


const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/', routerUser);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));