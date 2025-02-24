import express from 'express';
import {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../controllers/customersController.js';

const router = express.Router();

router.get('/', getAllCustomers); // Получить всех клиентов
router.post('/', createCustomer); // Добавить нового клиента
router.put('/:id', updateCustomer); // Обновить клиента
router.delete('/:id', deleteCustomer); // Удалить клиента

export default router;
