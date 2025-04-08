import Joi from 'joi';


export const registerSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Zа-яА-ЯёЁ\s'-]{2,30}$/)
    .required()
    .messages({
      'string.pattern.base': 'Имя должно содержать только буквы и быть длиной от 2 до 30 символов.',
      'string.empty': 'Имя обязательно для заполнения.',
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Неверный формат email.',
      'string.empty': 'Email обязателен для заполнения.',
    }),
  phone: Joi.string()
    .pattern(/^\+?[0-9]{10,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'Номер телефона должен содержать от 10 до 15 цифр и может начинаться с +.',
      'string.empty': 'Номер телефона обязателен для заполнения.',
    }),
  password: Joi.string()
    .min(6)
    .pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).*$/)
    .required()
    .messages({
      'string.min': 'Пароль должен содержать минимум 6 символов.',
      'string.pattern.base': 'Пароль должен содержать хотя бы одну заглавную букву и один специальный символ.',
      'string.empty': 'Пароль обязателен для заполнения.',
    }),
});


export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
