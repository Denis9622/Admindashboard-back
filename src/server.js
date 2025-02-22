import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './db/connect.js';
import {
  createUserController,
  loginUserController,
  logoutUserController,
  refreshTokenController,
} from './controllers/authController.js';

dotenv.config();
const app = express();
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(cookieParser());

app.post('/api/register', createUserController);
app.post('/api/login', loginUserController);
app.post('/api/logout', logoutUserController);
app.post('/api/refresh', refreshTokenController);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
