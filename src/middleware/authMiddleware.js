// authMiddleware.js
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import Session from '../models/session.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';

export const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Нет токена, авторизация отклонена' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const session = await Session.findOne({ accessToken: token });
    if (!session) {
      throw createHttpError(403, 'Сессия не найдена или недействительна');
    }

    if (new Date() > session.accessTokenValidUntil) {
      throw createHttpError(401, 'Маркер доступа истек');
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (
      error.name === 'TokenExpiredError' ||
      error.message === 'Маркер доступа истек'
    ) {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token required' });
      }

      const session = await Session.findOne({ refreshToken });
      if (!session) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }

      // Проверка срока действия refreshToken
      if (new Date() > session.refreshTokenValidUntil) {
        return res.status(403).json({ message: 'Refresh token expired' });
      }

      const newAccessToken = jwt.sign({ userId: session.userId }, JWT_SECRET, {
        expiresIn: '15m',
      });

      session.accessToken = newAccessToken;
      session.accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
      await session.save();

      res.setHeader('Authorization', `Bearer ${newAccessToken}`);
      req.user = jwt.verify(newAccessToken, JWT_SECRET);
      next();
    } else {
      res.status(401).json({ message: 'Токен недействителен' });
    }
  }
};
