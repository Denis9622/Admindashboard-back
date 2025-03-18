import User from '../models/user.js';
import Session from '../models/session.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';
const JWT_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '30d';

export async function createUserController(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createHttpError(409, 'Email in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Генерация токенов
    const accessToken = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    const refreshToken = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    await Session.create({
      userId: newUser._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      status: 201,
      message: 'User successfully registered!',
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function loginUserController(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createHttpError(400, 'Email и пароль обязательны');
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(401, 'Неправильный email или пароль');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createHttpError(401, 'Неправильный email или пароль');
    }

    const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    const refreshToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    await Session.create({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'None',
    });

    // ✅ Добавляем `user` в ответ
    res.status(200).json({
      status: 200,
      message: 'Пользователь успешно авторизован!',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function logoutUserController(req, res, next) {
  try {
    console.log('Cookies received in logout request:', req.cookies);

    let refreshToken = req.cookies.refreshToken;

    // 🔹 Проверяем localStorage как fallback
    if (!refreshToken && req.headers.authorization) {
      refreshToken = req.headers.authorization.replace('Bearer ', '');
    }

    if (!refreshToken) {
      console.error('🚨 Ошибка: Refresh token отсутствует!');
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const session = await Session.findOneAndDelete({ refreshToken });
    if (!session) {
      console.error('🚨 Ошибка: Сессия не найдена!');
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
    });

    console.log('✅ Logout successful, refresh token removed.');
    res.status(204).send();
  } catch (error) {
    console.error('Logout error:', error.message);
    next(error);
  }
}

export async function refreshTokenController(req, res, next) {
  try {
    let refreshToken = req.cookies.refreshToken;

    // 🔹 Проверяем заголовки как fallback
    if (!refreshToken && req.headers.authorization) {
      refreshToken = req.headers.authorization.replace('Bearer ', '');
    }

    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token required');
    }

    const session = await Session.findOne({ refreshToken });
    if (!session) {
      throw createHttpError(403, 'Invalid refresh token');
    }

    // Проверка срока действия refreshToken
    if (new Date() > session.refreshTokenValidUntil) {
      throw createHttpError(403, 'Refresh token expired');
    }

    const newAccessToken = jwt.sign({ userId: session.userId }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    session.accessToken = newAccessToken;
    session.accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
    await session.save();

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
}
