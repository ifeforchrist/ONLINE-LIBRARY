import mongoose from "mongoose";

const borrowerSchema =  mongoose.Schema({
    name: String,
    email:{type:String, unique:true},
    password:String

}, {timestamps: true})

export default mongoose.model("Borrower", borrowerSchema)