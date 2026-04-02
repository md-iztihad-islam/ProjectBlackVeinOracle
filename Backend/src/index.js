import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { SERVER_PORT } from './config/serverConfig.js';
import { connectDB } from './config/dbConnection.js';
import apiRouter from './routes/apiRouter.js';


const app = express();

// Allow larger payloads (e.g. base64 profile images from frontend forms)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
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