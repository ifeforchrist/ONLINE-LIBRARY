# 📚 ONLINE LIBRARY

An Online Library System where users can register, login, search for books, and manage books.

## ✅ Current Status

- [x] Register Page
- [x] Login Page
- [x] Dashboard
- [x] Books browsing
- [x] Add Book
- [ ] Borrow Book 

## 🛠️ Tech Stack

- HTML, CSS, JavaScript
- Node.js, Express.js
- MongoDB + Mongoose
- JWT Auth + bcrypt

## 📁 Project Structure

ONLINE-LIBRARY/
├── BACKEND/
│   ├── config/ - database connection
│   ├── controller/ - borrowerController
│   ├── middleware/ - auth
│   ├── models/ - book, borrower
│   ├── router/ - book, borrower routes
│   ├── index.js
│   └── package.json
└── FRONTEND/
    ├── login.HTML, login.js
    ├── register.html, register.js, register.css
    ├── dashboard.html, dashboard.js, dashboard.css
    └── style.css

    
## 👩‍💻 Author

IfeforChrist - [@ifeforchrist](https://github.com/ifeforchrist)

## ▶️ How to Run

```bash
git clone https://github.com/ifeforchrist/ONLINE-LIBRARY.git
cd ONLINE-LIBRARY/BACKEND
npm install
npm start