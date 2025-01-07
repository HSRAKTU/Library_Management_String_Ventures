import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';
import {ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        console.log("User:",user);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh & access token:",error)
    }
}

const checkUsernameAvailability = asyncHandler(async (req, res) =>{
    const { username } = req.query;

    const user = await User.findOne({username});
    console.log("user doc:", user);
    if(!user){
        return res
        .status(200)
        .json(
            new ApiResponse(200,username, "Username is available")
        )
    }
   
    throw new ApiError(400, "Username already taken", ["Username already taken"])
})

const registerUser = asyncHandler(async (req, res) => {
    const {fullName, email, username, password, contactNumber} = req.body;
    if(
        [fullName, email, username, password, contactNumber].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required.")
    }

    //validation
    const existedUser = await User.findOne({
        $or: [{ username },{ email }]
    })
    if(existedUser){
        throw new ApiError(409, "user with email or username already exists", ["user with email or username already exists"])
    }

    const user = await User.create({
        fullName,
        email,
        password,
        username: username.toLowerCase(),
        contactNumber
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    //crafting Response
    console.log("New User created")
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully!")
    )
    
})

const loginUser = asyncHandler(async (req,res) => {
    
    const {identifier, password} = req.body;

    if(!identifier){
        throw new ApiError(400,"username or email is required!");
    }

    const user = await User.findOne({
        $or: [{ username: identifier }, { email: identifier }]
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }
    // Generate tokens
    
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged in successfully"
            )
        );
    
})

const getCurrentUser = asyncHandler(async (req, res) => {
        const user = req.user; // The user data attached by the verifyJWT middleware
        console.log("user:", user)
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({
            success: true,
            user,
        });
})
const logoutUser = asyncHandler(async (req,res) =>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            }
        },
        {
            new : true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    };

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200, {}, "User logged out successfully."));
})

const refreshAccessToken = asyncHandler(async (req,res) =>{
    const incomingRT = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRT){
        throw new ApiError(401, "Unauthorised Request!!");
    }
    
    try {
        const decodedToken = jwt.verify(
            incomingRT,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id);
        if(!user){
            throw new ApiError(401, "Invalid Refresh Token!!");
        }
    
        if(incomingRT !== user?.refreshToken){
            throw new ApiError(401, "Refresh Token is expired!!");
        }
    
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id);
    
        return res
        .status(200)
        .cookie("accessToken",accessToken, options)
        .cookie("refreshToken",newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, newRefreshToken},
                "Tokens Refreshed, User logged In again"
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid refresh Token")
    }

})
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    checkUsernameAvailability,
    getCurrentUser
};