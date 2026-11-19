import jwt from "jsonwebtoken"
import Borrower from "../models/borrower.js"
import bcrypt from "bcryptjs"

const createToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "7d"})
}

const registerBorrower = async(req, res)=>{
    try{
        const {name, email, password} = req.body
    if(!name || !email || !password){
        return res.status(400).json({message: "please provide email, password and name"})
    }
    if(password.length < 6){
        return res.status(400).json({message: "password length too short"})
    }
    const exist = await Borrower.findOne({email})
    if(exist){
        return res.status(400).json({message: "email already exist"})

    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newBorrower = await Borrower.create({name, email, password: hashedPassword})

    const token = createToken(newBorrower._id)

    return res.status(201).json({success:true, token, message: "Registation completed, please Login"})

    }catch(error){
        console.log(error);
        return res.status(500).json({message: error.meassage})
    }
    
}

const loginBorrower = async(req, res)=>{
    try {

    const {email, password} = req.body
    const borrower = await Borrower.findOne({email})

    if(!borrower){
        return res.status(400).json({meassage: "unknown email"})
    }

    const isMatch = await bcrypt.compare(password, borrower.password)

    if(!isMatch){
        return res.status(400).json({success: false, meassage: "invalid passowrd"})
    }

    const token = createToken(borrower._id)
    return res.status(200).json({success: true, token: token, message:"Login Successfull"})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message:error.message})
    }
    
}

export {registerBorrower, loginBorrower}