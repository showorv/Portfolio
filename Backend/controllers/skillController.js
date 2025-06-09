import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import {v2 as cloudinary} from "cloudinary"
import {Skill} from "../models/skillModel.js"



export const postSkill= catchAsyncErrors(async(req,res,next)=>{

    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Svg required", 400))
    }

    const { svg } = req.files;
    const {name,proficiency} = req.body
    
    if(!name || !proficiency){
        return next(new ErrorHandler("skill name and proficiency is required", 400))
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(
        svg.tempFilePath,
        {folder: "SKILL_SVG"}
    );

    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error(
            "cloudinary error", cloudinaryResponse.error || "unknown cloudinary error"
        );
    }

   

    const setSkill = await Skill.create({
        name, 
        proficiency,
        svg:{
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        }})

        res.status(200).json({
            success: true,
            message:"skill added",
            setSkill
        })
})
export const deleteSkill= catchAsyncErrors(async(req,res,next)=>{
    const {id} = req.params

    const skill = await Skill.findById(id);

    if(!skill){
        return next(new ErrorHandler("skill is not found", 400))
    }
    const skillsvg = skill.svg.public_id
    await cloudinary.uploader.destroy(skillsvg)
    await skill.deleteOne();
    res.status(200).json({
        success: true,
        message:"skill deleted",
       
    })
})
export const updateSkill= catchAsyncErrors(async(req,res,next)=>{

    const {id} = req.params;

    let skill = await Skill.findById(id);

    if(!skill){
        return next(new ErrorHandler("skill is not found", 400))
    }

    const { proficiency} = req.body;
    
    
    skill = await Skill.findByIdAndUpdate(id, {proficiency},{
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message: "skill updated",
        skill
    })
})
export const getSkill= catchAsyncErrors(async(req,res,next)=>{
    const skills = await Skill.find().sort({createdAt: -1});
    res.status(200).json({
        success: true,
       data: skills
    })
})