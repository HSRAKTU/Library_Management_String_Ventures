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
    bookFile: {
      type: String,
      required: true, // URL or file path to the book file
    },
    thumbnail: {
      type: String, // URL or file path to the thumbnail image
    },
    availabilityStatus: {
      type: Boolean,
      default: true, // True means available, False means borrowed
    },
  },
  { timestamps: true }
);

export default mongoose.model('Book', bookSchema);
