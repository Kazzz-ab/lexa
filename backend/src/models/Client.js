import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, lowercase: true },
  phone: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
  },
  company: { type: String },
  clientType: { type: String, enum: ['individual', 'corporate'], default: 'individual' },
  referredBy: { type: String },
  notes: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

clientSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

export default mongoose.model('Client', clientSchema);
