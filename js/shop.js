// Shop Page JavaScript
// ============================================

const initShop = () => {
    console.log('Initializing Shop Page...');
    gsap.registerPlugin(ScrollTrigger);

    // ============================================
    // PAGINATION & VISIBILITY LOGIC
    // ============================================
    // ============================================
    // PAGINATION & VISIBILITY LOGIC
    // ============================================
    let currentPage = 1;
    const itemsPerPage = 8;
    let currentFilter = 'all';
    let searchQuery = '';
    let currentSort = 'default';

    const productsGrid = document.getElementById('products-grid');
    const paginationContainer = document.getElementById('pagination');
    const noResults = document.getElementById('no-results');
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');

    if (!productsGrid) return;

    const updateProductVisibility = () => {
        const products = Array.from(document.querySelectorAll('.products-grid .product-card'));

        // 1. Filter products (Category + Search)
        let filteredProducts = products.filter(product => {
            const category = product.dataset.category;
            const name = product.querySelector('h3')?.innerText.toLowerCase() || '';
            const notes = product.querySelector('.product-notes')?.innerText.toLowerCase() || '';

            const matchesFilter = (currentFilter === 'all' || category === currentFilter);
            const matchesSearch = name.includes(searchQuery) || notes.includes(searchQuery);

            return matchesFilter && matchesSearch;
        });

        // 2. Sort products
        if (currentSort === 'price-low') {
            filteredProducts.sort((a, b) => {
                const priceA = parseInt(a.querySelector('.product-price').innerText.replace('$', ''));
                const priceB = parseInt(b.querySelector('.product-price').innerText.replace('$', ''));
                return priceA - priceB;
            });
        } else if (currentSort === 'price-high') {
            filteredProducts.sort((a, b) => {
                const priceA = parseInt(a.querySelector('.product-price').innerText.replace('$', ''));
                const priceB = parseInt(b.querySelector('.product-price').innerText.replace('$', ''));
                return priceB - priceA;
            });
        }

        // 3. Hide all products
        products.forEach(p => {
            p.style.display = 'none';
            p.classList.remove('visible');
            gsap.set(p, { opacity: 0, y: 20, scale: 0.95 });
        });

        // 4. Handle No Results
        if (filteredProducts.length === 0) {
            if (noResults) noResults.style.display = 'block';
            if (paginationContainer) paginationContainer.style.display = 'none';
        } else {
            if (noResults) noResults.style.display = 'none';
            if (paginationContainer) paginationContainer.style.display = 'flex';

            // 5. Show products for current page
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

            paginatedProducts.forEach((product, index) => {
                product.style.display = 'block';
                // Move to correct position in DOM if sorted
                productsGrid.appendChild(product);

                gsap.to(product, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: 'power2.out',
                    onComplete: () => product.classList.add('visible')
                });
            });
        }

        renderPagination(filteredProducts.length);
    };

    // Event Listeners
    if (searchInput) {
        searchInput.oninput = (e) => {
            searchQuery = e.target.value.toLowerCase();
            currentPage = 1;
            updateProductVisibility();
        };
    }

    if (sortSelect) {
        sortSelect.onchange = (e) => {
            currentSort = e.target.value;
            currentPage = 1;
            updateProductVisibility();
        };
    }

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('reset-filters')) {
            if (searchInput) searchInput.value = '';
            searchQuery = '';
            currentFilter = 'all';
            currentSort = 'default';
            if (sortSelect) sortSelect.value = 'default';

            const filterBtns = document.querySelectorAll('.filter-btn');
            filterBtns.forEach(b => b.classList.remove('active'));
            const allBtn = document.querySelector('[data-filter="all"]');
            if (allBtn) allBtn.classList.add('active');

            currentPage = 1;
            updateProductVisibility();
        }
    });

    const renderPagination = (totalItems) => {
        if (!paginationContainer) return;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        paginationContainer.innerHTML = '';

        if (totalPages <= 1) return;

        // Prev Button
        const prevBtn = document.createElement('button');
        prevBtn.className = `pag-btn ${currentPage === 1 ? 'disabled' : ''}`;
        prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
        prevBtn.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                scrollToProducts();
                updateProductVisibility();
            }
        };
        paginationContainer.appendChild(prevBtn);

        // Page Numbers
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `pag-btn ${currentPage === i ? 'active' : ''}`;
            btn.innerText = i;
            btn.onclick = () => {
                currentPage = i;
                scrollToProducts();
                updateProductVisibility();
            };
            paginationContainer.appendChild(btn);
        }

        // Next Button
        const nextBtn = document.createElement('button');
        nextBtn.className = `pag-btn ${currentPage === totalPages ? 'disabled' : ''}`;
        nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
        nextBtn.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                scrollToProducts();
                updateProductVisibility();
            }
        };
        paginationContainer.appendChild(nextBtn);
    };

    const scrollToProducts = () => {
        window.lenis?.scrollTo('.products-section', { offset: -100, duration: 1 });
    };

    // Filter Buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.onclick = function () {
            currentFilter = this.dataset.filter;
            currentPage = 1;
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            scrollToProducts();
            updateProductVisibility();
        };
    });

    // Parallax Effect
    const handleParallax = (e) => {
        const cards = document.querySelectorAll('.products-grid .product-card.visible');
        cards.forEach(card => {
            const img = card.querySelector('.product-image img');
            if (img) {
                const rect = card.getBoundingClientRect();
                if (e.clientX > rect.left && e.clientX < rect.right && e.clientY > rect.top && e.clientY < rect.bottom) {
                    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
                    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
                    gsap.to(img, { x: x * 10, y: y * 10, duration: 0.3 });
                } else {
                    gsap.to(img, { x: 0, y: 0, duration: 0.3 });
                }
            }
        });
    };
    window.removeEventListener('mousemove', handleParallax);
    window.addEventListener('mousemove', handleParallax);

    // Initial State
    const products = document.querySelectorAll('.products-grid .product-card');
    products.forEach(p => gsap.set(p, { opacity: 0, y: 20, scale: 0.95 }));

    // Use requestAnimationFrame for better timing
    requestAnimationFrame(() => {
        setTimeout(updateProductVisibility, 100);
    });
};

// Auto-init for direct load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('products-grid')) {
            initShop();
        }
    });
} else {
    if (document.getElementById('products-grid')) {
        initShop();
    }
}
