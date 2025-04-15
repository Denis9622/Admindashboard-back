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

router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(createUserController),
);

router.post(
  '/login',
  validateBody(loginSchema),
  ctrlWrapper(loginUserController),
);

router.post('/logout', ctrlWrapper(logoutUserController));

router.post('/refresh', ctrlWrapper(refreshTokenController));

export default router;
