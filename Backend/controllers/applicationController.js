import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import {v2 as cloudinary} from "cloudinary"
import { Application } from "../models/applicationModel.js";


export const postApplication = catchAsyncErrors(async(req,res,next)=>{

    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Svg required", 400))
    }

    const { svg } = req.files;
    const {name} = req.body
    
    if(!name){
        return next(new ErrorHandler("application name is required", 400))
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(
        svg.tempFilePath,
        {folder: "APPLICATION_SVG"}
    );

    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error(
            "cloudinary error", cloudinaryResponse.error || "unknown cloudinary error"
        );
    }

   

    const application = await Application.create({
        name, 
        svg:{
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        }})

        res.status(200).json({
            success: true,
            message:"application added",
            application
        })
})
export const deleteApplication = catchAsyncErrors(async(req,res,next)=>{
    const {id} = req.params

    const application = await Application.findById(id);

    if(!application){
        return next(new ErrorHandler("application is not found", 400))
    }
    const appliationsv = application.svg.public_id
    await cloudinary.uploader.destroy(appliationsv)
    await application.deleteOne();
    res.status(200).json({
        success: true,
        message:"application deleted",
       
    })

})
export const getApplication = catchAsyncErrors(async(req,res,next)=>{
    const application = await Application.find().sort({createdAt: -1});
    res.status(200).json({
        success: true,
       data: application
    })
})