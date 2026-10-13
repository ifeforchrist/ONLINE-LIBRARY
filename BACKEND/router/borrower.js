// BACKEND/ROUTER/BORROWER
const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const Borrower = require("../models/borrower")
const bcrypt = require('bcrypt')
const {secure} = require("../middleware/auth.js")




router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const borrower = new Borrower({ name, email, password: hashedPassword });
        await borrower.save();

        return res.status(201).json({ message: 'registration completed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const foundborrower = await Borrower.findOne({ email });

        if (!foundborrower) {
            return res.status(401).json({ message: 'invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, foundborrower.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'invalid credentials' });
        }

        const token = jwt.sign(
            { id: foundborrower._id, email: foundborrower.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: 'login successful',
            borrower: { id: foundborrower._id, name: foundborrower.name },
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




module.exports = router