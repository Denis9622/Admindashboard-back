import express from 'express';
import Order from '../models/order.js';
import Customer from '../models/customer.js';

const router = express.Router();

// 📌 GET: Получить список заказов с клиентами
router.get('/',  async (req, res) => {
  try {
    const orders = await Order.find().populate('customer', 'name email'); // ✅ Подтягиваем имя и email клиента
    res.json(orders);
  } catch (error) {
    console.error('Ошибка сервера при получении заказов:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// 📌 POST: Добавить новый заказ
router.post('/',  async (req, res) => {
  try {
    const { customerId, address, products, orderDate, price, status } =
      req.body;

    if (!customerId)
      return res.status(400).json({ message: 'customerId обязателен' });

    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(400).json({ message: 'Клиент не найден' });

    const newOrder = new Order({
      customer: customer._id, // ✅ Связь с клиентом
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
router.put('/:id',  async (req, res) => {
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
router.delete('/:id',  async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Заказ удален' });
  } catch (error) {
    console.error('Ошибка сервера при удалении заказа:', error);
    res.status(500).json({ message: 'Ошибка удаления' });
  }
});

export default router;
