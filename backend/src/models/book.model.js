import mongoose, { Schema } from 'mongoose';

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    publicationYear: {
      type: Number,
      required: true,
      min: 0, // Ensures valid year
    },
    thumbnail: {
      type: String, // URL or file path to the thumbnail image
    },
    quantity: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

export const Book = mongoose.model('Book', bookSchema);
