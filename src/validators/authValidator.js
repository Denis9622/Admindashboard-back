import Joi from 'joi';


export const registerSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Zа-яА-ЯёЁ\s'-]{2,30}$/)
    .required()
    .messages({
      'string.pattern.base':
        'The name must contain only letters and be between 2 and 30 characters long.',
      'string.empty': 'Name is required.',
    }),
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format.',
    'string.empty': 'Email is required.',
  }),
  phone: Joi.string()
    .pattern(/^\+?[0-9]{10,15}$/)
    .required()
    .messages({
      'string.pattern.base':
        'Phone number must be between 10 and 15 digits and may start with +.',
      'string.empty': 'Phone number is required.',
    }),
  password: Joi.string()
    .min(6)
    .pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).*$/)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long.',
      'string.pattern.base':
        'Password must contain at least one uppercase letter and one special character.',
      'string.empty': 'Password is required.',
    }),
});


export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
