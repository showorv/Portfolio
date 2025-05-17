import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
   name: {
        type: String,
        minLength: [2, "Name must contain 2 characters"]
    },
    subject: {
        type: String,
        minLength: [2, "subject must contain 2 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
      },
    message:{
        type: String,
        minLength: [2, "message must contain 2 characters"]
    }
},{ timestamps: true })


export const Message = mongoose.model("Message", messageSchema)