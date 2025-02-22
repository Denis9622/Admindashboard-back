import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { getEnvVar } from '../utils/getEnvVar.js';

dotenv.config();

export const initMongoDB = async () => {
  try {
    // Используйте функцию getEnvVar для получения переменных окружения
    const user = getEnvVar('MONGODB_USER');
    const pwd = getEnvVar('MONGODB_PASSWORD');
    const url = getEnvVar('MONGODB_URL');
    const db = getEnvVar('MONGODB_DB');

    console.log('Connecting to MongoDB...');
    console.log('MONGODB_USER:', user);
    console.log('MONGODB_URL:', url);
    console.log('MONGODB_DB:', db);

    // Создайте строку подключения с полученными значениями
    await mongoose.connect(
      `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true },
    );
    console.log('🔥 MongoDB Connected!');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error);
    process.exit(1);
  }
};

export default initMongoDB;
