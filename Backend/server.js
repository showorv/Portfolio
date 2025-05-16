import express from "express";
import cors from "cors";
import 'dotenv/config'
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

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


app.get("/" , (req,res)=>{
    res.send("hello backend")
})

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`server is running at ${PORT}`);
    })
})
