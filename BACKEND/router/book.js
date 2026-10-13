// BACKEND/ROUTER/BORROWER.JS
const express = require("express")
const router = express.Router()
const Book = require("../models/book")



router.get('/:id', async( req, res)=>{
    try {
       const book = await Book.findById(req.params.id)
       if(!book){
       return res.status(404).json({ message: 'book not found'}) 
       }
       return res.status(200).json(book)
    } catch (error) {
       res.status(500).json({message: error.message}) 
    }
})


module.exports = router