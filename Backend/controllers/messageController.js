import { Message } from "../models/messageModel.js";
import ErrorHandler from "../middleware/error.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";

export const createMessage = catchAsyncErrors(async(req,res,next)=>{

    const {name,subject,email,message} = req.body;

    if(!name || !subject || !email || !message){
        return next(new ErrorHandler("All fields are required",400))
    }

    const newMessage = await Message.create({name,subject,email,message})

    res.status(201).json({
        success:true,
        message: "Message sent successfully",
        data: newMessage
    });
});

export const getAllMessage = catchAsyncErrors(async(req,res,next)=>{

    const allMessage = await Message.find().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: allMessage,
    })
})

export const deleteMessage = catchAsyncErrors(async(req,res,next)=>{

    const { id } = req.params;
  const message = await Message.findById(id);

    if(!message){
        return next(new ErrorHandler("message not found",400));
    }

    await message.deleteOne();

    res.status(200).json({
        success: true,
        message: "Message deleted successfully",
    })
   
})