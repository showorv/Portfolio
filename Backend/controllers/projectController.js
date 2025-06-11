import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import { Project } from "../models/projectModel.js";
import {v2 as cloudinary} from "cloudinary"
export const  postProject= catchAsyncErrors(async(req,res,next)=>{
        if(!req.files || Object.keys(req.files).length === 0){
            return next(new ErrorHandler("image is required", 400));
        }

        const {image} = req.files
        const {  title,
            description,
            gitRepoLink,
            projectLink,
            technologies,
            stack,
            deploy} = req.body

            if(!title||
                !description||
                !gitRepoLink||
                !projectLink||
                !technologies||
                !stack||
                !deploy){
                    return next(new ErrorHandler("All fields required", 400));
                }

        const cloudinaryResponse = await cloudinary.uploader.upload(
            image.tempFilePath,
           { folder: "PROJECTS"}
        )

        if(!cloudinaryResponse || cloudinaryResponse.error){
            console.error(
                "cloudinary error", cloudinaryResponse.error || "unknown cloudinary error"
            );
        }
    
        const projects = await Project.create({
            title,
            description,
            gitRepoLink,
            projectLink,
            technologies,
            stack,
            deploy,
            image:{
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url
            }
         })

        res.status(200).json({
            success: true,
            message: "project added",
            projects
        })
})
export const  deleteProject= catchAsyncErrors(async(req,res,next)=>{

    const {id} = req.params

    const deleteProject = await Project.findById(id);

    if(!deleteProject){
        return next(new ErrorHandler("project not found", 400));
    }
    const projectImg = deleteProject.image.public_id

    await cloudinary.uploader.destroy(projectImg);
    await deleteProject.deleteOne();

    res.status(200).json({
        success: true,
        message:"project deleted",
       
    })

})
export const updateProject = catchAsyncErrors(async(req,res,next)=>{

    const newProject = {
        title: req.body.title,
        description: req.body.description,
        gitRepoLink: req.body.gitRepoLink,
        projectLink: req.body.projectLink,
        technologies: req.body.technologies,
        stack: req.body.stack,
        deploy: req.body.deploy
      
    }

    if(req.files && req.files.image){
        const image = req.files.image

        const project = await Project.findById(req.params.id);
        const projectImg = project.image.public_id
        await cloudinary.uploader.destroy(projectImg);

        const cloudinaryResponse = await cloudinary.uploader.upload(
            image.tempFilePath,
            {folder: "PROJECTS"}
        )

        newProject.image = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        }
    }

    const projects = await Project.findByIdAndUpdate(req.params.id, newProject,{
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message: "projects updated",
        projects
    })
})
export const getSingleProject = catchAsyncErrors(async(req,res,next)=>{
    const {id} = req.params

    const singleProject = await Project.findById(id);
    if(!singleProject){
        return next(new ErrorHandler("project not found", 400));
    }

    res.status(200).json({
        success: true,
        singleProject
    })
})
export const getProject = catchAsyncErrors(async(req,res,next)=>{
    const projects = await Project.find().sort({createdAt: -1});
    res.status(200).json({
        success: true,
       data: projects
    })
})