import express from 'express';
import Product from '../models/product.js';

const router = express.Router();

// 📌 GET: Получить список товаров
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// 📌 POST: Добавить новый товар
router.post('/',  async (req, res) => {
  try {
    const { name, category, stock, suppliers, price } = req.body;
    const newProduct = new Product({ name, category, stock, suppliers, price });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// 📌 PUT: Обновить товар
router.put('/:id',  async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка обновления' });
  }
});

// 📌 DELETE: Удалить товар
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Товар удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка удаления' });
  }
});

export default router;
