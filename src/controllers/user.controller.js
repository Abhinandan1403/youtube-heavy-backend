import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async(req, res) => {
    //user details from frontend .. see model what u need
    //validation .. username email sahi h ki ni
    //check if user already exits by email or username
    //check for image , avatar
    //upload to cloudinary
    //create user object - create entry in db
    // remove password nd refresh token field from respomse
    // check for user connection
    // return response

    const {fullname, email, username, password } = req.body
    console.log("email:", email);

    if(
        [fullname, email, username, password].some((field)=> field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(409, "User already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatar){
        throw new ApiError(400, "Avatar file required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar file required")
    }

    const user = User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = User.findById(user._id).select("-password -refreshToken")//password aur refreshToken hata diye

    if(!createdUser){
        throw new ApiError(500, "something went wrong while registering user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})

export {registerUser}