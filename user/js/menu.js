let menuItems = [];
let currentSearch = '';
let filterVegOnly = false;
let filterBestsellerOnly = false;

document.addEventListener('DOMContentLoaded', () => {
    console.log("User Menu Initializing...");
    if (!window.menuStorage) {
        console.error("menuStorage utility not found");
        return;
    }

    // Comprehensive list of categories
    const categories = [
        { id: "beverage", name: "Beverage", icon: "☕" },
        { id: "chaat", name: "Chaat", icon: "🥟" },
        { id: "indian-street-delight", name: "Indian Street Delight", icon: "🥙" },
        { id: "paratha", name: "Paratha", icon: "🫓" },
        { id: "south-indian", name: "South Indian", icon: "🌮" },
        { id: "thali", name: "Thali", icon: "🍱" },
        { id: "soup", name: "Soup", icon: "🥣" },
        { id: "bread", name: "Bread", icon: "🍞" },
        { id: "quick-bites", name: "Quick Bites", icon: "🍜" }
    ];

    // Systematic seeding
    window.menuStorage.seedData();

    // Load items
    menuItems = window.menuStorage.getMenuItems();
    console.log("User Menu Items Loaded:", menuItems.length);

    // Filter only available items for the user view and map them to categories
    window.currentMenuData = categories.map(cat => ({
        ...cat,
        items: menuItems.filter(item => {
            if (!item.category) return false;
            const itemCat = item.category.toLowerCase().trim();
            const catName = cat.name.toLowerCase().trim();
            const catId = cat.id.toLowerCase().trim();
            return (itemCat === catName || itemCat === catId);
        })
    })).filter(cat => cat.items.length > 0);

    console.log("Grouped Menu Categories:", window.currentMenuData.length);
    if (window.currentMenuData.length === 0) {
        console.warn("No items matched categories! Check category names in storage vs JS.");
    }

    renderSidebar();
    renderMenu();
    setupFilters();
    setupIntersectionObserver();

    // Scroll to hash anchor after menu is rendered (sections are injected dynamically)
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1); // e.g. "cat-thali"
        setTimeout(() => {
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 150); // Small delay to ensure DOM is painted
    }
});

function renderSidebar() {
    const list = document.getElementById('category-list');
    if (!list || !window.currentMenuData) return;
    let html = '';
    window.currentMenuData.forEach((cat, index) => {
        html += `
            <li class="cat-nav-item ${index === 0 ? 'active' : ''}">
                <a href="#cat-${cat.id}" class="cat-nav-link">${cat.name}</a>
            </li>
        `;
    });
    list.innerHTML = html;

    // Smooth scroll for sidebar links
    const links = list.querySelectorAll('.cat-nav-link');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElem = document.getElementById(targetId);
            if (targetElem) {
                targetElem.scrollIntoView({ behavior: 'smooth' });
                // Remove active class from all and add to current
                document.querySelectorAll('.cat-nav-item').forEach(el => el.classList.remove('active'));
                link.parentElement.classList.add('active');
            }
        });
    });
}

function renderMenu() {
    console.log("Rendering Menu...");
    const content = document.getElementById('menu-content');
    if (!content) {
        console.error("Menu content container NOT found!");
        return;
    }

    if (!window.currentMenuData || window.currentMenuData.length === 0) {
        console.warn("No menu data to render!");
        content.innerHTML = '<div class="empty-state">No categories found in menu.</div>';
        return;
    }

    const cart = window.cartManager ? window.cartManager.getCart() : [];
    let html = '';

    window.currentMenuData.forEach(cat => {
        let visibleItems = cat.items.filter(item => {
            // Robust property checks (default to true if missing)
            const isAvailable = item.available !== false;
            const isVeg = item.isVeg !== false;
            const isBestseller = item.bestseller === true;

            let matchSearch = true;
            if (currentSearch) {
                matchSearch = item.name.toLowerCase().includes(currentSearch);
            }

            let matchVeg = true;
            if (filterVegOnly) {
                matchVeg = isVeg;
            }

            let matchBestseller = true;
            if (filterBestsellerOnly) {
                matchBestseller = isBestseller;
            }

            return matchSearch && matchVeg && matchBestseller;
        });

        console.log(`Category ${cat.name}: ${visibleItems.length} items visible after filtering`);

        if (visibleItems.length > 0) {
            html += `<div class="menu-section" id="cat-${cat.id}">`;
            html += `<h2 class="menu-section-title">${cat.icon} ${cat.name}</h2>`;
            html += `<div class="menu-items-grid">`;

            visibleItems.forEach(item => {
                const itemId = item.id;
                const cartItem = cart.find(i => i.id === itemId);
                const isVegItem = item.isVeg !== false;

                html += `
                    <div class="dish-card ${!item.available ? 'out-of-stock' : ''}" style="${!item.available ? 'opacity: 0.7;' : ''}">
                        <div class="dish-info">
                            <div class="dish-header">
                                ${isVegItem ? '<div class="badge-veg" title="Vegetarian"></div>' : ''}
                                <h3 class="dish-name">${item.name}</h3>
                            </div>
                            <div class="dish-price">₹${item.price}</div>
                            <p class="dish-desc">${item.description || 'Authentic taste made with pure ingredients.'}</p>
                            ${item.bestseller ? `<div class="dish-tags"><span class="dish-tag">Bestseller ⭐</span></div>` : ''}
                        </div>
                        <div class="dish-visual">
                            ${item.image
                        ? `<img src="${item.image}" alt="${item.name}" class="dish-image">`
                        : `<div class="dish-visual-placeholder">${cat.icon}</div>`
                    }
                            <div class="action-container" style="margin-top: 10px;">
                                ${!item.available ? `
                                    <span style="color: #dc2626; font-weight: 700; font-size: 0.85rem; padding: 5px 10px; background: #fee2e2; border-radius: 4px;">Out of Stock</span>
                                ` : cartItem ? `
                                    <div class="qty-selector">
                                        <button class="qty-btn minus" data-id="${itemId}">-</button>
                                        <span class="qty-val">${cartItem.qty}</span>
                                        <button class="qty-btn plus" data-id="${itemId}">+</button>
                                    </div>
                                ` : `
                                    <button class="btn-add-item" data-id="${item.id}" data-price="${item.price}" data-name="${item.name}" data-veg="${isVegItem}">+ Add</button>
                                `}
                            </div>
                        </div>
                    </div>
                `;
            });

            html += `</div></div>`;
        }
    });

    if (html === '') {
        html = `<div class="empty-state">No matching dishes found. Try changing your search or filters.</div>`;
    }

    content.innerHTML = html;

    // Attach click events for "Add"
    const addBtns = content.querySelectorAll('.btn-add-item');
    addBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const price = parseInt(e.target.getAttribute('data-price'));
            const name = e.target.getAttribute('data-name');
            const id = e.target.getAttribute('data-id');
            const isVeg = e.target.getAttribute('data-veg') === 'true';

            if (window.cartManager) {
                window.cartManager.addItem({
                    id: id,
                    name: name,
                    price: price,
                    isVeg: isVeg
                });
                renderMenu(); // Re-render to show qty selector
            }
            showToast(`Added ${name} to cart`);
        });
    });

    // Attach Click events for Plus/Minus
    const minusBtns = content.querySelectorAll('.qty-btn.minus');
    minusBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            if (window.cartManager) {
                window.cartManager.updateQuantity(id, 'decrement');
                renderMenu();
            }
        });
    });

    const plusBtns = content.querySelectorAll('.qty-btn.plus');
    plusBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            if (window.cartManager) {
                window.cartManager.updateQuantity(id, 'increment');
                renderMenu();
            }
        });
    });

    // Re-attach observer after DOM change
    setupIntersectionObserver();
}

// Modal Toggle Functions
function openOrdersModal() {
    const modal = document.getElementById('orders-modal');
    const body = document.getElementById('orders-modal-body');
    const cart = window.cartManager ? window.cartManager.getCart() : [];

    modal.classList.add('active');
    let html = '';

    if (cart.length === 0) {
        html += `
            <div class="empty-orders">
                <span class="icon">🍱</span>
                <p>Nothing selected yet!</p>
                <p style="font-size: 14px; margin-top: 10px;">Select something delicious from the menu.</p>
            </div>
        `;
    } else {
        html += '<div class="orders-list">';
        cart.forEach(item => {
            html += `
                <div class="order-modal-item">
                    <div class="item-info">
                        <strong>${item.name}</strong> x ${item.qty}
                    </div>
                    <div class="item-total">₹${item.price * item.qty}</div>
                </div>
            `;
        });
        const totals = window.cartManager.getTotals();
        html += `
            <div class="modal-footer" style="margin-top: 20px; border-top: 2px solid #fdf2f0; padding-top: 15px;">
                <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 18px;">
                    <span>Grand Total</span>
                    <span>₹${totals.itemTotal}</span>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button class="btn-outline" style="flex: 1; border-color: #666; color: #666;" onclick="clearCartHandler()">Clear Cart</button>
                    <button class="btn-checkout-full" style="flex: 2; margin-top: 0;" onclick="window.location.href='cart.html'">Go to Checkout</button>
                </div>
            </div>
        `;
        html += '</div>';
    }

    body.innerHTML = html;
}

function clearCartHandler() {
    if (window.cartManager) {
        window.cartManager.clearCart();
        openOrdersModal();
        renderMenu(); // Re-render menu to reset quantity selectors
    }
}

// Global UI Sync function for this page
window.syncOrderTypeUI = function () {
    // If the modal is active, refresh it
    const modal = document.getElementById('orders-modal');
    if (modal && modal.classList.contains('active')) {
        openOrdersModal();
    }
}

function openContactModal() {
    const modal = document.getElementById('contact-modal');
    modal.classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
    }
});

function setupFilters() {
    const searchInput = document.getElementById('menu-search');
    const vegBtn = document.getElementById('filter-veg');
    const bestsellerBtn = document.getElementById('filter-bestseller');

    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase().trim();
        renderMenu();
    });

    vegBtn.addEventListener('click', () => {
        filterVegOnly = !filterVegOnly;
        vegBtn.classList.toggle('active', filterVegOnly);
        renderMenu();
    });

    bestsellerBtn.addEventListener('click', () => {
        filterBestsellerOnly = !filterBestsellerOnly;
        bestsellerBtn.classList.toggle('active', filterBestsellerOnly);
        renderMenu();
    });
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span style="color:#34A853">✓</span> ${message}`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function setupIntersectionObserver() {
    const sections = document.querySelectorAll('.menu-section');
    const navItems = document.querySelectorAll('.cat-nav-item');

    if (sections.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navItems.forEach(item => {
                    item.classList.remove('active');
                    const link = item.querySelector('.cat-nav-link');
                    if (link && link.getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-120px 0px -60% 0px',
        threshold: 0
    });

    sections.forEach(sec => observer.observe(sec));
}
