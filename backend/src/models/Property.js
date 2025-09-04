import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String, enum: ['buy', 'rent'], required: true },
  category: { type: String, enum: ['apartment', 'house', 'villa', 'condo'], required: true },
  location: {
    state: String,
    city: String,
    address: String,
    coordinates: { lat: Number, lng: Number }
  },
  details: {
    bedrooms: Number,
    bathrooms: Number,
    area: Number,
    plotSize: { length: Number, breadth: Number },
    plotNumber: String,
    distanceFromHighway: Number
  },
  images: [String],
  description: String,
  features: [String],
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sellerContact: {
    name: String,
    email: String,
    phone: String
  },
  status: { type: String, enum: ['available', 'sold', 'pending'], default: 'available' },
}, { timestamps: true });

export default mongoose.model('Property', propertySchema);


