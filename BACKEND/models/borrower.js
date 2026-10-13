//BACKEND/MODELS/BORROWER
const mongoose= require("mongoose")
const bcrypt = require("bcrypt")

const borrowerSchema = new mongoose.Schema({


    name :{type:String, required:[true,"name is required" ], trim: true},
    email :{type:String, required:[true,"email is required" ], unique: true, lowercase:true,},
    password :{type:String, required:[true," passord is required" ], minlength: 8},

})
borrowerSchema.pre("save", async function(){
    if(!this.isModified("password")) return
        const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
    
})  

borrowerSchema.methods.comparePassword = async function(candidatepassword){
    return bcrypt.compare(candidatepassword,this.password)
   }


    
module.exports = mongoose.model("Borrower", borrowerSchema)