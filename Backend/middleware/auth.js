import { User } from "../models/userModel.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import  jwt  from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("user not authenticated",400))
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.user = await User.findById(decode.id);
    next()
})