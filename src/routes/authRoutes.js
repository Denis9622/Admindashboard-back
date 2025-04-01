import express from 'express';
import {
  createUserController,
  loginUserController,
  logoutUserController,
  refreshTokenController,
} from '../controllers/authController.js';
import { validateBody } from '../middleware/validateBody.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';
import { ctrlWrapper } from '../middleware/ctrlWrapper.js';

const router = express.Router();

// Маршрут для регистрации пользователя
router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(createUserController),
);

// Маршрут для входа пользователя
router.post(
  '/login',
  validateBody(loginSchema),
  ctrlWrapper(loginUserController),
);

// Маршрут для выхода пользователя
router.post('/logout', ctrlWrapper(logoutUserController));

// Маршрут для обновления токена
router.post('/refresh', ctrlWrapper(refreshTokenController));

export default router;
