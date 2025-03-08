import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  amount: { type: Number, required: true }, // ✅ Добавили сумму закупки
  createdAt: { type: Date, default: Date.now }, // ✅ Чтобы фильтровать по дате
});

export default mongoose.model('Supplier', supplierSchema);
