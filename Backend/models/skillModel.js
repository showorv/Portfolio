
import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
    name: String,
    proficiency: String,
    svg:{
        public_id:{
            type: String,
            required:true
        },
        url:{
            type: String,
            required: true
        }
    }
},{timestamps:true})

export const Skill = mongoose.model("Skill", skillSchema);