import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/Apiresponse.js";
const registerUser = asyncHandler( async (req,res)=> {
    // get user details from frontend
    // validation - not empty
    // check if user already exists : username,email check
    // check for images, check for avatar
    // upload them to cloudinary , avatar
    // create user object - create entry in db
    // remove password and refresh token field from repsonse (we dont want to give encrypted password and refresh token to user)
    // check for user creation
    // return res 

    const {fullName, email , username , password} = req.body
    console.log("email: ",email)


    if (
        [fullName , email , username , password].some((field)=>
        field?.trim() === "")
    ) {
        throw new ApiError(400 , "fAll fields are required!")
    }

    const existedUser = User.findOne({
        $or: [{username}, {email}]
    })
    if (existedUser) {
        throw new ApiError(409,"User with email or username already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path; //taking avatar from multer
    const coverImageLocalPath = req.files?.coverImage[0].path //taking cover Image

    if (!avatarLocalPath) {
        throw new ApiError(400,"Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400,"Avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar : avatar.url,
        coverImage : coverImage?.url || "" , //check for cover image (not necessarily required)
        email,
        password,
        username : username.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )
} )

export {registerUser}