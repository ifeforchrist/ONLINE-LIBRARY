import mongoose from "mongoose";
import dotenv from "dotenv";
import Book from "../models/book.js";
import Borrower from "../models/borrower.js";

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected");

  await Book.deleteMany({});
  await Borrower.deleteMany({});

  
  const borrower = await Borrower.create({
    name: "Ife",
    email: "library@online.com",
    password: "123456"
  });
  console.log("Borrower created:", borrower._id);

  
  const books = [
    {
      title: "Atomic Habits",
      author: "James Clear",
      genre: "Self-Help",
      rating: 4.8,
      category: "Technology",
      description: "Tiny changes, remarkable results.",
      coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
      language: "English",
      pages: 320,
      publishedYear: 2018,
      published: "Penguin",
      status: "available",
      createdBy: borrower._id
    },
    {
      title: "The Alchemist",
      author: "Paulo Coelho",
      genre: "Fiction",
      rating: 4.7,
      category: "Fiction",
      description: "A boy follows his dream.",
      coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
      language: "English",
      pages: 208,
      publishedYear: 1988,
      published: "HarperCollins",
      status: "available",
      createdBy: borrower._id
    },
    {
      title: "Things Fall Apart",
      author: "Chinua Achebe",
      genre: "Fiction",
      rating: 4.9,
      category: "Fiction",
      description: "Story of Okonkwo in Nigeria.",
      coverImage: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400",
      language: "English",
      pages: 209,
      publishedYear: 1958,
      published: "Heinemann",
      status: "available",
      createdBy: borrower._id
    },
    {
      title: "Purple Hibiscus",
      author: "Chimamanda Ngozi Adichie",
      genre: "Fiction",
      rating: 4.8,
      category: "Fiction",
      description: "A family story in Nigeria.",
      coverImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400",
      language: "English",
      pages: 307,
      publishedYear: 2003,
      published: "Algonquin",
      status: "available",
      createdBy: borrower._id
    },
    {
      title: "Oliver Twist",
      author: "Charles Dickens",
      genre: "History",
      rating: 4.5,
      category: "History",
      description: "An orphan in London.",
      coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
      language: "English",
      pages: 368,
      publishedYear: 1838,
      published: "Penguin",
      status: "available",
      createdBy: borrower._id
    }
  ];

  await Book.insertMany(books);
  console.log("5 books added!");
  process.exit();
};

seed();