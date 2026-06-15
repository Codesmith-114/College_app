import { Schema, model } from 'mongoose';

const MarketplaceItemSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, default: 'books' }, // books, lab_gear, electronics, other
  sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  contactInfo: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['available', 'sold'], 
    default: 'available' 
  },
  createdAt: { type: Date, default: Date.now }
});

export const MarketplaceItem = model('MarketplaceItem', MarketplaceItemSchema);
