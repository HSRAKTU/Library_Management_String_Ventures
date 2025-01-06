import { asyncHandler } from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { Book } from '../models/book.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { isValidObjectId } from 'mongoose';

/* 
    Add, Update, Read, Delete
*/

const addBook = asyncHandler(async (req, res) => {
    const {title, author, description, publicationYear,quantity} = req.body;

    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    if(!thumbnailLocalPath){
        throw new ApiError(400, "thumbnail file is required")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if(!thumbnail){
        throw new ApiError(400, "thumbnail file is required")
    }

    const book = await Book.create({
        title, 
        author, 
        description, 
        publicationYear,
        thumbnail: thumbnail.url,
        quantity
    })

    const createdBook = await Book.findById(book._id)

    if(!createdBook){
        throw new ApiError(500, "Something went wrong while adding the book")
    }

    return res.status(201).json(
        new ApiResponse(200, createdBook, "Book added successfully!")
    )
})

const getBookById = asyncHandler(async (req, res) => {
    const { bookId } = req.params; // Get bookId from params

    if (!bookId) {
        throw new ApiError(400, "Book ID is required");
    }
    if(!isValidObjectId(bookId)){
        throw new ApiError(400, "Invalid BookId")
    }
    const book = await Book.findById(bookId);

    if (!book) {
        throw new ApiError(404, "Book not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, book, "Book fetched successfully"));
});

const getAllBooks = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query } = req.query;
    const pipeline = [];

    if (query) {
        pipeline.push({
            $search: {
                index: "books",
                text: {
                    query: query,
                    path: ["title", "author", "description"],
                    fuzzy: {
                        maxEdits: 2,
                        prefixLength: 3
                    }
                }
            }
        });

        pipeline.push({
            $project: {
                _id: 1,
                title: 1,
                author: 1,
                description: 1,
                publicationYear: 1,
                thumbnail: 1,
                quantity: 1,
                createdAt: 1,
                updatedAt: 1,
                score: { $meta: "searchScore" },
            }
        });

        pipeline.push({
            $sort: {
                score: { $meta: "searchScore" }
            }
        });
    }

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };

    const books = await Book.aggregatePaginate(Book.aggregate(pipeline), options);

    if (!books || books.totalDocs === 0) {
        return res.status(200).json(new ApiResponse(200, { books: [], ...books }, "No books found"));
    }

    return res.status(200).json(new ApiResponse(200, books, "Books fetched successfully"));
});


const updateBook = asyncHandler(async (req, res) => {
    const { bookId } = req.params;
    const { title, author, description, publicationYear, quantity } = req.body;

    if (!bookId) {
        throw new ApiError(400, "Book ID is required");
    }

    const book = await Book.findById(bookId);

    if (!book) {
        throw new ApiError(404, "Book not found");
    }

    let thumbnail = book.thumbnail; // Keep existing thumbnail if not updated
    if (req.files?.thumbnail) {
        const thumbnailLocalPath = req.files.thumbnail[0].path;
        const newThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
        if (!newThumbnail) {
            throw new ApiError(500, "Failed to upload new thumbnail");
        }
        thumbnail = newThumbnail.url;
    }

    const updatedBook = await Book.findByIdAndUpdate(
        bookId,
        {
            title,
            author,
            description,
            publicationYear,
            thumbnail,
            quantity
        },
        { new: true }
    );

    if (!updatedBook) {
        throw new ApiError(500, "Failed to update book");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, updatedBook, "Book updated successfully"));
});

const deleteBook = asyncHandler(async (req, res) => {
    const { bookId } = req.params;

    if (!bookId) {
        throw new ApiError(400, "Book ID is required");
    }

    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
        throw new ApiError(404, "Book not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, { deletedBook }, "Book deleted successfully"));
});


export {
    addBook,
    getBookById,
    getAllBooks,
    updateBook,
    deleteBook
}