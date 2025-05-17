class ErrorHandler extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err,req,res,next)=>{
    err.message = err.message || "Internal server error"
    err.statusCode = err.statusCode || 500

    if(err.code === 11000){
        const message = ` Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message,400)
    }
    if(err.name === "JsonWebTokenError"){
        const message = ` jsonwebtoken invalid,try again`
        err = new ErrorHandler(message,400)
    }
    if(err.name === "TokenExpiredError"){
        const message = ` json web token is expired`
        err = new ErrorHandler(message,400)
    }
    if(err.name === "CastError"){
        const message = ` Invalid ${err.path}`
        err = new ErrorHandler(message,400)
    }

    console.log(err);

    // log korle error er mddhe erros object akare. object er value sobgula k map method er maddhone multiple error " " diye join kore mnessage akare.

    const errorMessage = err.errors? Object.values(err.errors).map((error)=> error.message).join(" "): err.message;

    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage
    })
}


export default ErrorHandler;