import { asyncHandler } from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose, { isValidObjectId } from 'mongoose';
import { Transaction } from '../models/transaction.model.js';
import { Book } from '../models/book.model.js';

/*
    borrow,
    return
*/

const borrowBook = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { bookId } = req.body;

    if (!bookId) {
        throw new ApiError(400, "Book ID is required");
    }

    if (!isValidObjectId(bookId)) {
        throw new ApiError(400, "Invalid BookId");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const book = await Book.findById(bookId).session(session);

        if (!book) {
            throw new ApiError(404, "Book not found");
        }

        if (book.quantity === 0) {
            throw new ApiError(400, "Book is currently unavailable");
        }
        // Check for existing borrow transaction (with return date null)
        const existingBorrowTransaction = await Transaction.findOne({
            userId,
            bookId,
            returnDate: { $exists: false }
        }).session(session);

        if (existingBorrowTransaction) {
            throw new ApiError(400, "This book is already borrowed by you!");
        }

        const transaction = await Transaction.create(
            [{ userId, bookId }],
            { session }
        );

        const updatedBook = await Book.findByIdAndUpdate(
            bookId,
            { $inc: { quantity: -1 } },
            { new: true, session }
        );

        if (!updatedBook) {
            throw new ApiError(500, "Failed to update book quantity");
        }

        await session.commitTransaction();

        return res
            .status(200)
            .json(new ApiResponse(200, transaction[0], "Book borrowed successfully!"));
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
});

const returnBook = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { bookId } = req.body;

    if (!bookId) {
        throw new ApiError(400, "Book ID is required");
    }

    if (!isValidObjectId(bookId)) {
        throw new ApiError(400, "Invalid BookId");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const matchingBorrowTransactions = await Transaction.find({
            userId,
            bookId,
            returnDate: { $exists: false }
        }).sort({borrowDate: -1}).session(session);

        if (matchingBorrowTransactions.length === 0) {
            throw new ApiError(400, "No borrow transaction found for this book by this user");
        }

        if (matchingBorrowTransactions.length > 1) {
            console.error("Multiple open borrow transactions found for user", userId, "and book", bookId);
            throw new ApiError(500, "Data integrity issue: Multiple open borrow transactions found. Please contact support."); // Or a more appropriate error message for the client
        }

        const lastBorrowTransaction = matchingBorrowTransactions[0];

        if (!lastBorrowTransaction) {
            throw new ApiError(400, "No borrow transaction found for this book by this user");
        }

        const book = await Book.findById(bookId).session(session);

        if (!book) {
            throw new ApiError(404, "Book not found");
        }

        const updatedBook = await Book.findByIdAndUpdate(
            bookId,
            { $inc: { quantity: 1 } },
            { new: true, session }
        );

        if (!updatedBook) {
            throw new ApiError(500, "Failed to update book quantity");
        }

        lastBorrowTransaction.returnDate = Date.now();
        await lastBorrowTransaction.save({ session });

        await session.commitTransaction();

        return res
            .status(200)
            .json(new ApiResponse(200, lastBorrowTransaction, "Book returned successfully!"));
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
})

const getUserTransactionHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { page = 1, limit = 10, includeReturned = true } = req.query; // Get 'returned' parameter

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid User Id");
    }

    const pipeline = [
        {
            $match: { userId: userId } // Match transactions for the user
        }
    ];

    // Filter by returned status
    if (includeReturned === 'false') {
        pipeline.push({
            $match: { returnDate: { $exists: false } } // Pending return books
        });
    }

    // Sort by borrowDate (newest first)
    pipeline.push({
        $sort: { borrowDate: -1 }
    });

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };

    try {
        const transactions = await Transaction.aggregatePaginate(Transaction.aggregate(pipeline), options);

        if (!transactions || transactions.totalDocs === 0) {
            return res.status(200).json(new ApiResponse(200, {transactions: [], ...transactions}, "No transactions found"));
        }

        return res
        .status(200)
        .json(new ApiResponse(200, transactions, "User transaction history fetched successfully"));
    } catch (error) {
        console.error("Error fetching user transaction history:", error);
        throw new ApiError(500, "Failed to fetch user transaction history"); // More informative error for server logs
    }
});

export {
    borrowBook,
    returnBook,
    getUserTransactionHistory
}