import { asyncHandler } from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { Book } from '../models/book.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

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
const getBook = asyncHandler(async(req, res) => {
    const bookId = req.body._id;
    
})

export {
    addBook,
}