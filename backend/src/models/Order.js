import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  type: { type: String, enum: ['buy', 'rent'], required: true },
  amount: { type: Number, required: true },
  commission: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  paymentMethod: String,
  customerDetails: {
    name: String,
    email: String,
    phone: String,
    address: String
  },
  contractUrl: String,
  signerName: String,
  idVerified: Boolean,
  contractSigned: Boolean,
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);


