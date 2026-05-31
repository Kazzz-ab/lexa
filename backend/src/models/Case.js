import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema({
  caseNumber: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  leadAttorney: { type: mongoose.Schema.Types.ObjectId, ref: 'Attorney', required: true },
  attorneys: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attorney' }],
  practiceArea: { type: String, required: true },
  caseType: { type: String, enum: ['litigation', 'corporate', 'family', 'criminal', 'real-estate', 'immigration', 'other'], default: 'other' },
  status: { type: String, enum: ['open', 'active', 'pending', 'closed', 'on-hold'], default: 'open' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  openedAt: { type: Date, default: Date.now },
  closedAt: { type: Date },
  courtDate: { type: Date },
  description: { type: String },
  notes: { type: String },
  documents: [{ name: String, url: String, uploadedAt: Date }],
}, { timestamps: true });

export default mongoose.model('Case', caseSchema);
