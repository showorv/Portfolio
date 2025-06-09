import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import {Timeline} from "../models/timelineModel.js"



export const postTimeline = catchAsyncErrors(async(req,res,next)=>{
    
    const {title, description, from, to} = req.body

    const createTimeline = await Timeline.create(
        {title, 
        description, 
        timeline:{from, to}
        })

        res.status(200).json({
            success: true,
            message: "timeline added",
            createTimeline
        })

})
export const deleteTimeline = catchAsyncErrors(async(req,res,next)=>{

    const {id} = req.params
    const timeline = await Timeline.findById(id);
    if(!timeline){
        return next(new ErrorHandler("timeline not found", 400))
    }

    await timeline.deleteOne();
    res.status(200).json({
        success: true,
        message:"timeline deleted",
        timeline
    })
})
export const getTimeline = catchAsyncErrors(async(req,res,next)=>{

    const timeline = await Timeline.find().sort({createdAt: -1});
    res.status(200).json({
        success: true,
       data: timeline
    })
})