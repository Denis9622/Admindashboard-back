import express from 'express';
import Order from '../models/order.js';
import Customer from '../models/customer.js';

const router = express.Router();

router.get('/',  async (req, res) => {
  try {
    const orders = await Order.find().populate('customer', 'name email');
    res.json(orders);
  } catch (error) {
    console.error('Server error while fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/',  async (req, res) => {
  try {
    const { customerId, address, products, orderDate, price, status } =
      req.body;

    if (!customerId)
      return res.status(400).json({ message: 'customerId is required' });

    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(400).json({ message: 'Customer not found' });

    const newOrder = new Order({
      customer: customer._id,
      address,
      products,
      orderDate,
      price,
      status,
    });
    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Server error while creating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id',  async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.json(updatedOrder);
  } catch (error) {
    console.error('Server error while updating order:', error);
    res.status(500).json({ message: 'Update error' });
  }
});

router.delete('/:id',  async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (error) {
    console.error('Server error while deleting order:', error);
    res.status(500).json({ message: 'Delete error' });
  }
});

export default router;
