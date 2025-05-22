import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import { User} from "../models/userModel.js"
import {v2 as cloudinary} from "cloudinary"
import { generateToken } from "../utils/jwtToken.js";


export const register = catchAsyncErrors(async(req,res,next)=>{
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Avatar and resume are required", 400))
    }

    const { avatar, resume } = req.files;
    // console.log(avatar,resume);
    const cloudinaryForAvatar = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        {folder: "AVATARS"}
    );

    if(!cloudinaryForAvatar || cloudinaryForAvatar.error){
        console.error(
            "cloudinary error", cloudinaryForAvatar.error || "unknown cloudinary error"
        );
    }

    const cloudinaryForResume = await cloudinary.uploader.upload(
        resume.tempFilePath,
        {folder: "RESUME"}
    );

    if(!cloudinaryForResume || cloudinaryForResume.error){
        console.error(
            "cloudinary error", cloudinaryForResume.error || "unknown cloudinary error"
        );
    }

    const {
        fullName,
        email,
        phone,
        aboutMe,
        password,
        portfolioURL,
        githubURL,
        facebookURL,
        linkedInURL,
    } = req.body

    const user = await User.create({
        fullName,
        email,
        phone,
        aboutMe,
        password,
        portfolioURL,
        githubURL,
        facebookURL,
        linkedInURL,
        avatar: {
            public_id: cloudinaryForAvatar.public_id,
            url: cloudinaryForAvatar.secure_url
        },
        resume: {
            public_id: cloudinaryForResume.public_id,
            url: cloudinaryForResume.secure_url
        },
    });

    // res.status(200).json({
    //     success: true,
    //     message: "User created successfully"
    // })

    generateToken(user,"user created successfully",200,res)
})


export const login = catchAsyncErrors(async(req,res,next)=>{
    const {email,password} = req.body;

    if(!email || !password){
        return next(new ErrorHandler("email and password required",400))
    }

    const user = await User.findOne({email}).select("+password")

    if(!user){
        return next(new ErrorHandler("invalid credentials",400))
    }

    const isPassWord = await user.comparePassword(password);
    if(!isPassWord){
        return next(new ErrorHandler("invalid credentials",400))
    }

    generateToken(user,"Login successful", 200,res)
})

export const logout = catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("token","",{
        expires: new Date(Date.now()),
        httpOnly: true
    }).json({
        success: true,
        message:"logout "
    })
})