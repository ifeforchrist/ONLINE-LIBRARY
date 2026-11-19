// BACKEND/ROUTER/BORROWER
import express from "express"
import { registerBorrower, loginBorrower } from "../controller/borrowerController.js"

const router = express.Router()
router.post("/register", registerBorrower)
router.post("/login", loginBorrower)

export default router