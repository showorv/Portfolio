
import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, "title is required"]
    },
    description:{
        type: String,
        required: [true, "description is required"]
    },
    timeline:{
        from: String,
        to: String
    }
})

export const Timeline = mongoose.model("Timeline", timelineSchema);