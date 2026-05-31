import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  case: { type: mongoose.Schema.Types.ObjectId, ref: 'Case' },
  attorney: { type: mongoose.Schema.Types.ObjectId, ref: 'Attorney' },
  invoiceNumber: { type: String, required: true, unique: true },
  billingType: { type: String, enum: ['hourly', 'flat-fee', 'retainer', 'contingency'], default: 'hourly' },
  lineItems: [{
    description: { type: String, required: true },
    hours: { type: Number },
    rate: { type: Number },
    amount: { type: Number, required: true },
  }],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'], default: 'draft' },
  dueDate: { type: Date },
  paidAt: { type: Date },
  notes: { type: String },
}, { timestamps: true });

export default mongoose.model('Invoice', invoiceSchema);
