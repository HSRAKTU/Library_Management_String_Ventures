import { ApiError } from "../utils/ApiError.js";

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error("Error:", err); // Log the error for debugging

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors || [],
        });
    }

    // Fallback for unhandled errors
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
        errors: [],
    });
};

export { errorHandler };
