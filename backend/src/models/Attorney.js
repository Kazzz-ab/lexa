import mongoose from 'mongoose';

const attorneySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  practiceAreas: [{ type: String, required: true }],
  barNumber: { type: String, required: true, unique: true },
  barAdmissionDate: { type: Date },
  hourlyRate: { type: Number, default: 0 },
  availableDays: {
    type: [String],
    enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  },
  workingHours: {
    start: { type: String, default: '09:00' },
    end: { type: String, default: '18:00' },
  },
  bio: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Attorney', attorneySchema);
