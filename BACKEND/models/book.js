// BACKEND/MODELS/BOOK.JS
import mongoose from "mongoose"
const BookSchema =  mongoose.Schema({  

 title :{type:String, required:[true,"book name is required"]},
 author:{type:String, required:[true, "author is required"]},
 genre:{type:String, required:[true, "gener is requried"]},
 rating:{type:Number, required:[true,"rating is required"]},
 category:{type:String },
 description:{type:String},
 coverImage:{type:String},
 language:{type:String},
 pages:{type:Number},
 publishedYear:{type:Number},
 published:{type:String},
 status:{
   type:String,
   enum:["available", "borrowed", "reserved"],
   default:"available"
 },


 createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Borrower",
    required: true,
 },
},
 { timestamps : true },
)
 

export default mongoose.model("Book",  BookSchema)