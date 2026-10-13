// BACKEND/MIDDLEWARE/AUTH.JS
const jwt = require("jsonwebtoken")
const Borrower = require("../models/borrower")

const secure = async(req, res, next)=>{
    try{
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
        { 
          token = req.headers.authorization.split(" ")[1]
        }

   if(!token){
    return res.status(401).json({success: false, message: "not authorized, no token"}) 
     }

 const decoded = jwt.verify(token, process.env.JWT_SECRET)
 req.borrower = await Borrower.findById(decoded.id).select("-password")
  if(!req.borrower){
    return res.status(401).json({success: false, message: "borrower not found"})
  }
    next()
  } catch (error) {
    return res.status(401).json({success: false, message: "not authorized"})
  }

    
}

module.exports= {secure}