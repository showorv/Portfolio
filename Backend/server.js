import express from "express";
import cors from "cors";
import 'dotenv/config'
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cloudinary from "cloudinary"
import { errorMiddleware } from "./middleware/error.js";
import messageRouter from "./router/messageRoutes.js"
import userRouter from "./router/userRoutes.js"
import timelineRouter from "./router/timelineRoutes.js"
import applicationRouter from "./router/applicationRoutes.js"
import skillRouter from "./router/skillRoutes.js"
import projectRouter from "./router/projectRoutes.js"




const app = express()

app.use(cors({
    origin:[ process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/temp/",
}))  // fileupload instead of multer to get link of image



const PORT = process.env.PORT || 9000;


// router for message

app.use("/api/v1/message", messageRouter)

// router for user

app.use("/api/v1/user", userRouter)

// timeline

app.use("/api/v1/timeline", timelineRouter)

app.use("/api/v1/application", applicationRouter)

app.use("/api/v1/skill", skillRouter)
app.use("/api/v1/project",projectRouter)


cloudinary.v2.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY ,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME
})



app.get("/" , (req,res)=>{
    res.send("hello backend")
})

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`server is running at ${PORT}`);
    })
})

app.use(errorMiddleware);