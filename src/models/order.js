import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  address: { type: String, required: true },
  products: { type: [String], required: true },
  orderDate: { type: Date, required: true },
  price: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered'],
    default: 'Pending',
  },
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
