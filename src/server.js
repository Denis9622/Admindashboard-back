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
import productRoutes from './routes/productsRoutes.js';
import orderRoutes from './routes/ordersRoutes.js';
import customersRoutes from './routes/customersRoutes.js';
import suppliersRoutes from './routes/suppliersRoutes.js';

import dashboardRoutes from './routes/dashboardRoutes.js';




dotenv.config();
const app = express();
app.use(
  cors({
    credentials: true,
    origin: [
      'http://localhost:5173',
      'https://admindashboard-nine-azure.vercel.app',
    ],
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use((err, req, res, next) => {
  console.error('Ошибка:', err.message);
  res
    .status(err.status || 500)
    .json({ message: err.message || 'Внутренняя ошибка сервера' });
});




app.post('/api/register', createUserController);
app.post('/api/login', loginUserController);
app.post('/api/logout', logoutUserController);
app.post('/api/refresh', refreshTokenController);



const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
