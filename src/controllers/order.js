import Order from '../models/order.js';
import Customer from '../models/customer.js';
import createHttpError from 'http-errors';


export async function createOrder(req, res) {
  try {
    console.log('Received data:', req.body);

    const { customerId, address, products, orderDate, price, status } =
      req.body;

    if (!customerId)
      return res.status(400).json({ message: 'customerId is required' });

    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(400).json({ message: 'Customer not found' });

    const newOrder = await Order.create({
      customer: customer._id,
      address,
      products,
      orderDate,
      price,
      status,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
}



export async function getAllOrders(req, res) {
  try {
    const orders = await Order.find().populate('customer'); 
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка загрузки заказов' });
  }
}

export async function getAllCustomers(req, res, next) {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    next(createHttpError(500, 'Ошибка загрузки клиентов'));
  }
}