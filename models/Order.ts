import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  product: {
    name: String,
    price: Number,
    variant: Object,
    quantity: Number
  },
  customer: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zipCode: String
  },
  payment: {
    cardNumber: String,
    status: { type: String, enum: ['approved', 'declined', 'error'] }
  },
  total: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);