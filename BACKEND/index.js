// ENTRY POINT
import dotenv from "dotenv"
import  express from "express"
import cors from "cors"
import connectDB from "./config/db.js"
import bookRouter from "./router/book.js"
import borrowerRouter from"./router/borrower.js"

dotenv.config()
connectDB()
const app = express()
// FOR MIDDLEWARE
app.use(cors())
app.use(express.json())




app.get('/', (req, res) => {
  res.status(200).json({ 
    message: "API is running on 7001... It works!",
    books: "/api/book",
    borrowers: "/api/borrower"
  })
})

// API ROUTER
app.use("/api/book", bookRouter)
app.use("/api/borrower", borrowerRouter)

const port = process.env.PORT || 5000



app.listen(port, ()=>{
  console.log(`server running on port ${port} `);
  
})

export default app