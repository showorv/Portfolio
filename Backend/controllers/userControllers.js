import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import { User} from "../models/userModel.js"
import {v2 as cloudinary} from "cloudinary"
import { generateToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";


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


export const getUser = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})

export const updateUser = catchAsyncErrors(async(req,res,next)=>{

    const newUser = {
        fullName:req.body.fullName,
        email:req.body.email,
        phone:req.body.phone,
        aboutMe:req.body.aboutMe,
        portfolioURL:req.body.portfolioURL,
        githubURL:req.body.githubURL,
        facebookURL:req.body.facebookURL,
        linkedInURL:req.body.linkedInURL,
    }
    if(req.files && req.files.avatar){
        const avatar = req.files.avatar
        const user = await User.findById(req.user.id)
        const avatarId = user.avatar.public_id
        await cloudinary.uploader.destroy(avatarId);
        const cloudinaryResponse = await cloudinary.uploader.upload(
            avatar.tempFilePath,
            {folder: "AVATARS"}
        );

        newUser.avatar = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        }
    }
    if(req.files && req.files.resume){
        const resume = req.files.resume
        const user = await User.findById(req.user.id)
        const resumeId = user.resume.public_id
        await cloudinary.uploader.destroy(resumeId);
        const cloudinaryResponse = await cloudinary.uploader.upload(
            resume.tempFilePath,
            {folder: "RESUME"}
        );

        newUser.resume = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUser,{
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message: "user updated",
        user
    })
})

// update password

export const updatePassword = catchAsyncErrors(async(req,res,next)=>{

    const {currentPassword, newPassword, confirmPassword} = req.body;

    if(!currentPassword || !newPassword || !confirmPassword){
        return next(new ErrorHandler("please fill up all", 400))
    }

    //get the user
    const user = await User.findById(req.user.id).select("+password");

    const isPassMatched = await user.comparePassword(currentPassword);

    if(!isPassMatched){
        return next(new ErrorHandler("Incorrect current password", 400))
    }

    if(newPassword !== confirmPassword){
        return next(new ErrorHandler("confirm password do not matched", 400))
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
        success: true,
        message:"Password updated"
    });
})


// get profile portfolio frontend because no need to sign in anyone

export const getPortfolioProfile = catchAsyncErrors(async(req,res,next)=>{
    const id = "682f687c95191e76a0ceb282"
    const user = await User.findById(id);
    res.status(200).json({
        success: true,
        user
    })
})


export const forgotPassword = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findOne({email: req.body.email});
    if(!user){
        return next(new ErrorHandler("user not found", 400))
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave: false})
    const resetPasswordUrl = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;
    const message =`Your reset password token is: \n\n ${resetPasswordUrl} \n\n if you've not requested for this please ignore`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Personal portfolio dashboard password recovery",
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })
    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
       await user.save()
       return next(new ErrorHandler(error.message, 500))
    }
})