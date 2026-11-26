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
    let bookToDelete = null;

    const API = 'https://online-library-backend-three.vercel.app/api/book';

    // --- DELETE POPUP LOGIC ---
    const deleteModal = document.getElementById('deleteModal');
    const deleteBookName = document.getElementById('deleteBookName');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

    function askDelete(id, title) {
        bookToDelete = id;
        if (deleteBookName) deleteBookName.textContent = title;
        if (deleteModal) deleteModal.style.display = 'flex';
    }

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => {
            bookToDelete = null;
            if (deleteModal) deleteModal.style.display = 'none';
        });
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', async () => {
            if (!bookToDelete) return;
            try {
                await fetch(`${API}/${bookToDelete}`, { method: 'DELETE' });
                if (deleteModal) deleteModal.style.display = 'none';
                bookToDelete = null;
                await loadBooks();
            } catch (err) {
                console.log(err);
                if (deleteModal) deleteModal.style.display = 'none';
            }
        });
    }
    // --- END DELETE POPUP ---

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
        ${isBorrowed 
          ? `<button class="return-btn" style="background:#2ecc71;">Return Book</button>` 
          : `<button class="borrow-btn">Borrow</button>`
        }
        <button class="delete-btn" style="background:#ff3b30;margin-top:5px;">Delete</button>
    `;

    // BORROW
    const borrowBtn = div.querySelector('.borrow-btn');
    if (borrowBtn) {
        borrowBtn.addEventListener('click', async () => {
            await fetch(`${API}/${book._id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'borrowed' })
            });
            borrowedIds.add(book._id);
            book.status = 'borrowed';
            renderBooks(allBooks);
        });
    }

    // RETURN
    const returnBtn = div.querySelector('.return-btn');
    if (returnBtn) {
        returnBtn.addEventListener('click', async () => {
            await fetch(`${API}/${book._id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'available' })
            });
            borrowedIds.delete(book._id);
            book.status = 'available';
            renderBooks(allBooks);
        });
    }

    const deleteBtn = div.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => askDelete(book._id, book.title));

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
        if (totalBooksEl) totalBooksEl.textContent = allBooks.length;
        const count = allBooks.filter(b => b.status === 'borrowed' || borrowedIds.has(b._id)).length;
        if (borrowedCountEl) borrowedCountEl.innerHTML = count + ' <small>for 1/3</small>';
        if (borrowedCount2) borrowedCount2.textContent = count;
    }

    async function loadBooks() {
        try {
            const res = await fetch(API);
            const data = await res.json();
            console.log('Books from backend:', data);
            allBooks = Array.isArray(data) ? data : [];
            renderBooks(allBooks);
        } catch (err) {
            console.log('Backend not running:', err);
            allBooks = [];
            renderBooks(allBooks);
        }
    }

    searchInput.addEventListener('input', () => {
        const q = searchInput.value.toLowerCase().trim();
        if (!q) { renderBooks(allBooks); return; }
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
                await loadBooks();
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