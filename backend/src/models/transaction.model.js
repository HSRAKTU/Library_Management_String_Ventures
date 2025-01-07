import mongoose, { Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

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
  borrowDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  returnDate: {
    type: Date
  }
}, { timestamps: true });

transactionSchema.plugin(mongooseAggregatePaginate)

export const Transaction =  mongoose.model('Transaction', transactionSchema);