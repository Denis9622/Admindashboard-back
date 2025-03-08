import Order from '../models/order.js';
import Customer from '../models/customer.js';
import Product from '../models/product.js';
import Supplier from '../models/supplier.js';
import createHttpError from 'http-errors';

// 📌 Получить статистику (Общее количество заказов, клиентов, продуктов, поставщиков)
export async function getDashboardStatistics(req, res) {
  try {
    const totalProducts = await Product.countDocuments();
    const totalSuppliers = await Supplier.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalOrders = await Order.countDocuments();

    res
      .status(200)
      .json({ totalProducts, totalSuppliers, totalCustomers, totalOrders });
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
    let { startDate, endDate } = req.query;

    // Если даты не переданы — берем все данные
    const dateFilter =
      startDate && endDate
        ? { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } }
        : {};

    // Получаем заказы (доходы) и закупки (расходы)
    const orders = await Order.find(dateFilter);
    const expenses = await Supplier.find(dateFilter);

    // Формируем список транзакций
    const transactions = [
      ...orders.map((order) => ({
        type: 'Income',
        name: order.customerName,
        amount: order.price,
      })),
      ...expenses.map((expense) => ({
        type: 'Expense',
        name: expense.company,
        amount: -expense.amount, // Минус для расходов
      })),
    ];

    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка загрузки транзакций' });
  }
}





export async function getCustomersWithSpent(req, res, next) {
  try {
    const customers = await Customer.find();

    // Считаем сумму заказов для каждого клиента
    const customersWithSpent = await Promise.all(
      customers.map(async (customer) => {
        const orders = await Order.find({ customer: customer._id }); // ✅ Ищем заказы клиента
        const totalSpent = orders.reduce((sum, order) => sum + order.price, 0); // ✅ Складываем сумму всех заказов

        return {
          ...customer.toObject(),
          totalSpent,
        };
      }),
    );

    res.status(200).json(customersWithSpent);
  } catch (error) {
    next(createHttpError(500, 'Ошибка загрузки клиентов с их тратами'));
  }
}


// 📌 Получить все заказы (для Dashboard и страницы Orders)
export async function getAllOrders(req, res) {
  try {
    const orders = await Order.find().populate('customer'); // ✅ Теперь подтягивает имя клиента
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка загрузки заказов' });
  }
}

