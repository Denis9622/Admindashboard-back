import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  address: { type: String, required: true },
  amount: { type: Number, required: true }, 
  deliveryDate: { type: Date, required: true }, 
  status: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }, 
});

export default mongoose.model('Supplier', supplierSchema);
