import express from 'express';
import {
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from '../controllers/suppliersController.js';

const router = express.Router();

router.get('/', getAllSuppliers); // Получить всех поставщиков
router.post('/', createSupplier); // Добавить нового поставщика
router.put('/:id', updateSupplier); // Обновить поставщика
router.delete('/:id', deleteSupplier); // Удалить поставщика

export default router;
