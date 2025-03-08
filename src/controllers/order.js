import Order from '../models/order.js';
import Customer from '../models/customer.js';
import createHttpError from 'http-errors';


export async function createOrder(req, res) {
  try {
    console.log('Полученные данные:', req.body);

    const { customerId, address, products, orderDate, price, status } =
      req.body;

    if (!customerId)
      return res.status(400).json({ message: 'customerId обязателен' });

    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(400).json({ message: 'Клиент не найден' });

    const newOrder = await Order.create({
      customer: customer._id, // ✅ Теперь сохраняем ObjectId клиента
      address,
      products,
      orderDate,
      price,
      status,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Ошибка создания заказа:', error);
    res.status(500).json({ message: 'Ошибка создания заказа' });
  }
}



export async function getAllOrders(req, res) {
  try {
    const orders = await Order.find().populate('customer'); // ✅ Подтягиваем данные клиента
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка загрузки заказов' });
  }
}

// 📌 Получить всех клиентов (GET)
export async function getAllCustomers(req, res, next) {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    next(createHttpError(500, 'Ошибка загрузки клиентов'));
  }
}