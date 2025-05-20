import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: [ true, "name is required"]
    },
    email:{
        type: String,
        required: [ true, "email is required"]
    },
    phone:{
        type: String,
        required: [ true, "phone is required"]
    },
    aboutMe:{
        type: String,
        required: [ true, "about me is required"]
    },
    password:{
        type: String,
        required: [ true, "password is required"],
        minLength: [6, "password must be contain 6 characters"],
        select: false
    },

    avatar:{
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        }
    },

    portfolioURL: {
        type: String,
        required: [ true, "portfolio url  is required"]
    },
    githubURL: String,
    facebookURL: String,
    linkedInURL: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date

})


export const User = mongoose.model("User", userSchema)