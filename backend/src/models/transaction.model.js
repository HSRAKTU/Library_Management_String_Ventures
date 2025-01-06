import mongoose, { Schema } from 'mongoose';

const transactionSchema = new Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book', // Reference the Book model
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  transactionType: {
    type: String,
    enum: ['borrow','return'],
    required: true
  },
  transactionDate: {
    type: Date,
    required: true,
    default: Date.now,
  }
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);