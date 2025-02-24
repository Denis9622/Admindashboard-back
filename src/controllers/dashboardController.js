import Order from '../models/order.js';
import Customer from '../models/customer.js';
import Product from '../models/product.js';

// 📌 Получить статистику (Общее количество заказов, клиентов, продуктов)
export async function getDashboardStatistics(req, res) {
  try {
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalProducts = await Product.countDocuments();

    res.status(200).json({ totalOrders, totalCustomers, totalProducts });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка загрузки статистики' });
  }
}

// 📌 Получить список последних клиентов
export async function getRecentCustomers(req, res) {
  try {
    const recentCustomers = await Customer.find()
      .sort({ createdAt: -1 })
      .limit(5);
    res.status(200).json(recentCustomers);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка загрузки клиентов' });
  }
}

// 📌 Получить доходы и расходы по датам
export async function getIncomeExpenses(req, res) {
  try {
    const { startDate, endDate } = req.query;
    const orders = await Order.find({
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    const totalIncome = orders.reduce(
      (acc, order) => acc + order.totalPrice,
      0,
    );

    res.status(200).json({ totalIncome });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка загрузки доходов/расходов' });
  }
}
