import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'GoodsCatalog', required: true },
  quantity: { type: Number, required: true },
  // Store creator information with each ordered item
  creator: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: {
      district: String,
      sector: String,
      cell: String,
      village: String,
    }
  },
  // Store product details at time of purchase (snapshot)
  productDetails: {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: String, required: true },
    image: { type: String, required: true }
  }
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    orderNumber: { 
      type: String, 
      unique: true, 
      required: true,
      default: () => `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    },
    deliveryAddress: {
      district: String,
      sector: String,
      cell: String,
      village: String,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      default: 'COD',
    },
  },
  { timestamps: true }
);

// Index for better query performance
orderSchema.index({ 'items.creator.userId': 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;