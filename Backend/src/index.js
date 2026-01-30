import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { SERVER_PORT } from './config/serverConfig.js';
import { connectDB } from './config/dbConnection.js';
import apiRouter from './routes/apiRouter.js';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}))

app.get('/', (_, res) => {
    res.send('Hello, World!');
});

app.use('/api', apiRouter);

app.listen(SERVER_PORT, () => {
    connectDB();
    console.log(`Server is running on port ${SERVER_PORT}`);
})