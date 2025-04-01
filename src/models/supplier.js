import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  address: { type: String, required: true },
  amount: { type: Number, required: true }, // Сумма закупки
  deliveryDate: { type: Date, required: true }, // Дата доставки
  status: { type: String, required: true }, // Статус
  createdAt: { type: Date, default: Date.now }, // Дата создания записи
});

export default mongoose.model('Supplier', supplierSchema);
