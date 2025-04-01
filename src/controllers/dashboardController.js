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
  } catch {
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
  } catch {
    res.status(500).json({ message: 'Ошибка загрузки клиентов' });
  }
}

// 📌 Получить доходы и расходы по датам
export async function getIncomeExpenses(req, res) {
  try {
    const { startDate, endDate } = req.query;

    // Валидация дат
    let dateFilter = {};
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({
          message: 'Invalid date format',
        });
      }

      dateFilter = {
        orderDate: {
          $gte: start,
          $lte: end,
        },
      };
    }

    // Получение заказов с безопасным доступом к данным
    const orders = await Order.find(dateFilter).populate('customer');
    const orderTransactions = orders.map((order) => ({
      type: 'Income',
      name: order.customer?.name || 'Unknown Customer',
      amount: order.price || 0,
      date: order.orderDate,
    }));

    // Получение расходов с безопасным доступом к данным
    const expenses = await Supplier.find(dateFilter);
    const expenseTransactions = expenses.map((expense) => ({
      type: 'Expense',
      name: expense.company || 'Unknown Supplier',
      amount: -Math.abs(expense.amount || 0),
      date: expense.deliveryDate,
    }));

    // Сортировка транзакций по дате
    const transactions = [...orderTransactions, ...expenseTransactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );

    console.log('Transactions prepared:', transactions);
    res.status(200).json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      message: 'Error fetching transactions',
      details: error.message,
    });
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
  } catch {
    next(createHttpError(500, 'Ошибка загрузки клиентов с их тратами'));
  }
}


// 📌 Получить все заказы (для Dashboard и страницы Orders)
export async function getAllOrders(req, res) {
  try {
    const orders = await Order.find().populate('customer'); // ✅ Теперь подтягивает имя клиента
    res.status(200).json(orders);
  } catch {
    res.status(500).json({ message: 'Ошибка загрузки заказов' });
  }
}

