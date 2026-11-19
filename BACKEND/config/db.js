import mongoose from "mongoose"

const connectDB = async() =>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Database connected successfully : ${conn.connection.host} ${conn.connection.name}`);
    } catch(error) {
        console.log(`database failed : ${error.message}`);
    }
}

export default connectDB