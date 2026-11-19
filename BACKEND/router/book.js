import express from "express";
import Book from "../models/book.js";

const router = express.Router();

// ADD A NEW BOOK
router.post("/", async (req, res) => {
  try {
    let data = { ...req.body };
    // If frontend doesn't send createdBy, use first borrower (Ife)
    if (!data.createdBy) {
      const Borrower = (await import("../models/borrower.js")).default;
      const firstBorrower = await Borrower.findOne();
      if (!firstBorrower) return res.status(400).json({ message: "No borrower found. Run seed first." });
      data.createdBy = firstBorrower._id;
    }
    const newBook = new Book(data);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// GET ALL BOOKS For  search & filter
router.get("/", async (req, res) => {
  try {
    const { genre, category, search } = req.query;
    let filter = {};
    if (genre) filter.genre = genre;
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: "i" };

    const books = await Book.find(filter).populate("createdBy", "name email");
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ONE BOOK
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("createdBy", "name email");
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE A BOOK
router.put("/:id", async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedBook) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


/// CHANGE STATUS - borrow / return
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const book = await Book.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE A BOOK
router.delete("/:id", async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: "Book not found" });
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;