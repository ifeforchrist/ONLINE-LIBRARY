// BACKEND/MODELS/BOOK.JS
const mongoose = require("mongoose")
const BookSchema = new mongoose.Schema(

{    

 name :{type:String, required:[true,"book name is required"]},
 author:{type:String, required:[true, "author is required"]},
 genre:{type:String, required:[true, "gener is requried"]},
 rating:{type:Number, required:[true,"rating is required"]},

 createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Borrower",
    required: true,
 },
},
 { timestamps : true },
)
 BookSchema.index({name:"text", author:"text", genre:"text"})

module.exports = mongoose.model("Book",  BookSchema)