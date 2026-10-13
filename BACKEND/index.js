// ENTRY POINT
require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const bookRouter = require("./router/book")
const borrowerRouter = require("./router/borrower")

const app = express()
const PORT = process.env.PORT || 7001

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

// CONNECTION TO DATABASE
mongoose
.connect(process.env.MONGODB_URI)
.then(() =>{
    console.log(" mongoDB connected")
    app.listen(PORT, () =>
        console.log(` server running at http://localhost:${PORT}`) 
    )
})
.catch((error) =>{
    console.error(" mongoDB connection error:", error.message)
    process.exit(1)
})