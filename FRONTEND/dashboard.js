document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-box');
    const borrowedCountEl = document.getElementById('borrowed-count');
    const borrowedCount2 = document.getElementById('borrowed-count-2');
    const totalBooksEl = document.getElementById('total-books-count');

    const dashboardBooksEl = document.getElementById('dashboard-books');
    const allBooksEl = document.getElementById('all-books-list');
    const borrowedListEl = document.getElementById('borrowed-list');
    const categoryBooksEl = document.getElementById('category-books');

    let allBooks = [];
    let borrowedIds = new Set();

    const API = 'https://online-library-backend-three.vercel.app/api/book';

    const links = document.querySelectorAll('.sidebar ul li a');
    const sections = document.querySelectorAll('.page-section');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            document.querySelectorAll('.sidebar ul li').forEach(li => li.classList.remove('active'));
            link.parentElement.classList.add('active');
            sections.forEach(sec => sec.classList.remove('active-section'));
            document.querySelector(targetId).classList.add('active-section');
        });
    });

    function createBookCard(book) {
        const div = document.createElement('div');
        div.className = 'book';
        div.dataset.id = book._id;
        const isBorrowed = book.status === 'borrowed' || borrowedIds.has(book._id);
        div.innerHTML = `
            <img src="${book.coverImage || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'}" alt="${book.title}">
            <h4>${book.title}</h4>
            <p>${book.author}</p>
            <p style="font-size:12px; opacity:0.8;">${book.genre} • ${book.category || ''}</p>
            <p style="font-size:12px;">⭐ ${book.rating} / 5 • ${book.pages || ''} pages • ${book.publishedYear || ''}</p>
            <p style="font-size:12px;">${book.language || ''} • ${book.published || ''}</p>
            <p style="font-size:12px;">${book.description || ''}</p>
            <p style="font-size:12px;"><b>Status:</b> ${book.status}</p>
            <button>${isBorrowed ? 'Borrowed' : 'Borrow'}</button>
        `;
        const btn = div.querySelector('button');
        if (isBorrowed) btn.style.background = '#d312c3';
        btn.addEventListener('click', async () => {
            const newStatus = isBorrowed ? 'available' : 'borrowed';
            try {
                await fetch(`${API}/${book._id}/status`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus })
                });
                if (newStatus === 'borrowed') borrowedIds.add(book._id);
                else borrowedIds.delete(book._id);
                book.status = newStatus;
                renderBooks(allBooks);
            } catch (err) {
                console.log(err);
                if (isBorrowed) borrowedIds.delete(book._id);
                else borrowedIds.add(book._id);
                renderBooks(allBooks);
            }
        });
        return div;
    }

    function renderBooks(books) {
        dashboardBooksEl.innerHTML = '';
        books.slice(0, 5).forEach(b => dashboardBooksEl.appendChild(createBookCard(b)));
        allBooksEl.innerHTML = '';
        books.forEach(b => allBooksEl.appendChild(createBookCard(b)));
        borrowedListEl.innerHTML = '';
        const borrowedBooks = books.filter(b => b.status === 'borrowed' || borrowedIds.has(b._id));
        borrowedBooks.forEach(b => borrowedListEl.appendChild(createBookCard(b)));
        // Total always from allBooks, not from filtered search
        if (totalBooksEl) totalBooksEl.textContent = allBooks.length;
        const count = allBooks.filter(b => b.status === 'borrowed' || borrowedIds.has(b._id)).length;
        if (borrowedCountEl) borrowedCountEl.innerHTML = count + ' <small>for 1/3</small>';
        if (borrowedCount2) borrowedCount2.textContent = count;
    }

    async function loadBooks() {
        try {
            const res = await fetch(API);
            const data = await res.json();
            console.log('Books from backend:', data); // <-- check this in console
            allBooks = Array.isArray(data) ? data : [];
            renderBooks(allBooks);
        } catch (err) {
            console.log('Backend not running:', err);
            allBooks = [];
            renderBooks(allBooks);
        }
    }

    // Search - fixed
    searchInput.addEventListener('input', () => {
        const q = searchInput.value.toLowerCase().trim();
        console.log('Searching for:', q, 'in', allBooks.length, 'books'); // <-- check this
        if (!q) {
            renderBooks(allBooks);
            return;
        }
        const filtered = allBooks.filter(b =>
            (b.title + ' ' + b.author + ' ' + b.genre + ' ' + (b.category || '') + ' ' + (b.description || '')).toLowerCase().includes(q)
        );
        renderBooks(filtered);
    });

    document.querySelectorAll('#category-list .card').forEach(card => {
        card.addEventListener('click', () => {
            const cat = card.textContent.replace(/[^a-zA-Z ]/g, '').trim().toLowerCase();
            const filtered = allBooks.filter(b => (b.category || '').toLowerCase() === cat || (b.genre || '').toLowerCase() === cat);
            categoryBooksEl.innerHTML = '';
            filtered.forEach(b => categoryBooksEl.appendChild(createBookCard(b)));
        });
    });
    // ADD BOOK - form
    const addForm = document.getElementById('add-book-form');
    const addMsg = document.getElementById('add-book-msg');
    if (addForm) {
        addForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newBook = {
                title: document.getElementById('new-title').value.trim(),
                author: document.getElementById('new-author').value.trim(),
                genre: document.getElementById('new-genre').value.trim(),
                category: document.getElementById('new-category').value.trim() || "Fiction",
                rating: Number(document.getElementById('new-rating').value) || 4.5,
                pages: Number(document.getElementById('new-pages').value) || 200,
                publishedYear: Number(document.getElementById('new-year').value) || 2024,
                language: document.getElementById('new-language').value.trim() || "English",
                published: document.getElementById('new-publisher').value.trim() || "Unknown",
                coverImage: document.getElementById('new-cover').value.trim() || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
                description: document.getElementById('new-description').value.trim(),
                status: "available"
                // no createdBy - backend will fill it with Ife
            };
            try {
                const res = await fetch(API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newBook)
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Failed to add');
                addMsg.textContent = '✅ Book added: ' + data.title;
                addMsg.style.color = 'green';
                addForm.reset();
                await loadBooks(); // refresh dashboard + all books + total count
                // go to All Books to see it
                document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active-section'));
                document.getElementById('all-books').classList.add('active-section');
            } catch (err) {
                addMsg.textContent = '❌ ' + err.message;
                addMsg.style.color = 'red';
            }
        });
    }
    loadBooks();
});