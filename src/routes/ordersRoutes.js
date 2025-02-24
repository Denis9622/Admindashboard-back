import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import Order from '../models/order.js';

const router = express.Router();

// 📌 GET: Получить список заказов
router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error('Ошибка сервера при получении заказов:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// 📌 POST: Добавить новый заказ
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { userInfo, address, products, orderDate, price, status } = req.body;
    const newOrder = new Order({
      userInfo,
      address,
      products,
      orderDate,
      price,
      status,
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Ошибка сервера при добавлении заказа:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// 📌 PUT: Обновить заказ
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.json(updatedOrder);
  } catch (error) {
    console.error('Ошибка сервера при обновлении заказа:', error);
    res.status(500).json({ message: 'Ошибка обновления' });
  }
});

// 📌 DELETE: Удалить заказ
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Заказ удален' });
  } catch (error) {
    console.error('Ошибка сервера при удалении заказа:', error);
    res.status(500).json({ message: 'Ошибка удаления' });
  }
});

export default router;
