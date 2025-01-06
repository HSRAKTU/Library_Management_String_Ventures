import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyAdmin = asyncHandler( async(req,res,next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select("-password -refreshToken");
        
        if(user.role != 'admin'){
            throw new ApiError(401, "Unauthorised Access to library");
        }
    
        req.user = user; 
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorised Access, Role is not admin");
    }
})