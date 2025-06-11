import mongoose from "mongoose"

const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    gitRepoLink: String,
    projectLink: String,
    technologies: String,
    stack: String,
    deploy: String,
    image: {
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        }
    }
},{timestamps:true})


export const Project = mongoose.model("Project", projectSchema)