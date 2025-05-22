import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

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
    resume:{
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

},{timestamps:true})


// hash password

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return  next();
    }

    this.password = await bcrypt.hash(this.password,10)
    next();
})

// compare with hash password

userSchema.methods.comparePassword = async function(enteredPass){
    return await bcrypt.compare(enteredPass, this.password);
}

// genereting jsonwebtoken

userSchema.methods.generateJsonWebToken = function(){

    if (!process.env.JWT_SECRET_KEY) {
        throw new Error("JWT_SECRET_KEY is not defined");
      }

      
    return jwt.sign({
        id:this._id.toString()
    },
    process.env.JWT_SECRET_KEY,
    {
        expiresIn: process.env.JWT_EXPIRES
    }
    )
}


export const User = mongoose.model("User", userSchema)