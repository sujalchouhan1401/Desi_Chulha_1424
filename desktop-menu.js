const menuData = [
    {
        id: "beverage",
        name: "Beverage",
        icon: "☕",
        items: [
            { id: "bev-1", name: "Tea", price: 10, isVeg: true, tag: null },
            { id: "bev-2", name: "Kulhad Tea", price: 15, isVeg: true, tag: "Must Try" },
            { id: "bev-3", name: "Hot Coffee", price: 30, isVeg: true, tag: null },
            { id: "bev-4", name: "Cold Coffee", price: 50, isVeg: true, tag: "Bestseller" },
            { id: "bev-5", name: "Lassi Sweet", price: 50, isVeg: true, tag: null },
            { id: "bev-6", name: "Lassi Salty", price: 30, isVeg: true, tag: null }
        ]
    },
    {
        id: "chaat",
        name: "Chaat",
        icon: "🥟",
        items: [
            { id: "chaat-1", name: "Papadi Chaat", price: 70, isVeg: true, tag: null },
            { id: "chaat-2", name: "Papadi Bhalla Chaat", price: 80, isVeg: true, tag: null },
            { id: "chaat-3", name: "Dahi Patasi", price: 60, isVeg: true, tag: "Bestseller" },
            { id: "chaat-4", name: "Dahi Bhalla", price: 50, isVeg: true, tag: null },
            { id: "chaat-5", name: "Kaji Vada", price: 30, isVeg: true, tag: null },
            { id: "chaat-6", name: "Raj Kachori", price: 90, isVeg: true, tag: "Chef's Special" },
            { id: "chaat-7", name: "Aloo Tikki Chaat", price: 60, isVeg: true, tag: null }
        ]
    },
    {
        id: "indian-street-delights",
        name: "Indian Street Delights",
        icon: "🥙",
        items: [
            { id: "str-1", name: "Puri Bhaji", price: 60, isVeg: true, tag: null },
            { id: "str-2", name: "Poha", price: 40, isVeg: true, tag: null },
            { id: "str-3", name: "Bhel Puri", price: 50, isVeg: true, tag: null },
            { id: "str-4", name: "Pav Bhaji", price: 70, isVeg: true, tag: "Bestseller" },
            { id: "str-5", name: "Vada Pav", price: 50, isVeg: true, tag: "Must Try" },
            { id: "str-6", name: "Dabeli", price: 30, isVeg: true, tag: null },
            { id: "str-7", name: "Veg Pakoda", price: 60, isVeg: true, tag: null },
            { id: "str-8", name: "Cheela Besan", price: 40, isVeg: true, tag: null },
            { id: "str-9", name: "Cheela Suji", price: 40, isVeg: true, tag: null },
            { id: "str-10", name: "Popcorn", price: 50, isVeg: true, tag: null },
            { id: "str-11", name: "Chhole Bhature", price: 70, isVeg: true, tag: "Bestseller" },
            { id: "str-12", name: "Burger", price: 80, isVeg: true, tag: null },
            { id: "str-13", name: "Pizza", price: 99, isVeg: true, tag: null },
            { id: "str-14", name: "Samosa Chaat", price: 60, isVeg: true, tag: null },
            { id: "str-15", name: "Fruit Salad", price: 120, isVeg: true, tag: "Healthy" },
            { id: "str-16", name: "Fruit Salad Chaat", price: 130, isVeg: true, tag: null }
        ]
    },
    {
        id: "paratha",
        name: "Paratha",
        icon: "🫓",
        items: [
            { id: "par-1", name: "Aloo Paratha", price: 40, isVeg: true, tag: "Bestseller" },
            { id: "par-2", name: "Gobhi Paratha", price: 50, isVeg: true, tag: null },
            { id: "par-3", name: "Mooli Paratha", price: 50, isVeg: true, tag: null },
            { id: "par-4", name: "Paneer Paratha", price: 60, isVeg: true, tag: null },
            { id: "par-5", name: "Paneer Mawa Sweer Paratha", price: 70, isVeg: true, tag: "Sweet" },
            { id: "par-6", name: "Mater Paratha", price: 50, isVeg: true, tag: null },
            { id: "par-7", name: "Plain Paratha", price: 20, isVeg: true, tag: null }
        ]
    },
    {
        id: "south-indian",
        name: "South Indian",
        icon: "🌮",
        items: [
            { id: "sid-1", name: "Idli Sambher", price: 40, isVeg: true, tag: null },
            { id: "sid-2", name: "Dosa Masala", price: 80, isVeg: true, tag: "Bestseller" },
            { id: "sid-3", name: "Utpam", price: 60, isVeg: true, tag: null },
            { id: "sid-4", name: "Upama", price: 60, isVeg: true, tag: null }
        ]
    },
    {
        id: "soup",
        name: "Soup",
        icon: "🥣",
        items: [
            { id: "soup-1", name: "Tomatto Soup", price: 50, isVeg: true, tag: null },
            { id: "soup-2", name: "Sweetcorn Soup", price: 50, isVeg: true, tag: null },
            { id: "soup-3", name: "Hot Sure", price: 50, isVeg: true, tag: null },
            { id: "soup-4", name: "Mix Veg Soup", price: 50, isVeg: true, tag: "Healthy" }
        ]
    },
    {
        id: "bread",
        name: "Bread",
        icon: "🍞",
        items: [
            { id: "brd-1", name: "Bread Jem", price: 50, isVeg: true, tag: null },
            { id: "brd-2", name: "Bread Butter", price: 30, isVeg: true, tag: null },
            { id: "brd-3", name: "Aloo Sandwich", price: 40, isVeg: true, tag: null },
            { id: "brd-4", name: "Veg. Sandwich", price: 50, isVeg: true, tag: null },
            { id: "brd-5", name: "Veg Cheese Sandwich", price: 60, isVeg: true, tag: "Bestseller" }
        ]
    },
    {
        id: "quick-bites",
        name: "Quick Bites",
        icon: "🍜",
        items: [
            { id: "qb-1", name: "Maggi", price: 30, isVeg: true, tag: null },
            { id: "qb-2", name: "Veg. Maggi", price: 40, isVeg: true, tag: null },
            { id: "qb-3", name: "Cheese Maggi", price: 60, isVeg: true, tag: "Must Try" },
            { id: "qb-4", name: "Chowmein", price: 60, isVeg: true, tag: "Bestseller" }
        ]
    },
    {
        id: "combos",
        name: "Combos & Thali",
        icon: "🍱",
        items: [
            { id: "cmb-1", name: "Regular thali", price: 100, isVeg: true, tag: "Daily Need", desc: "Veg Seasonal, Daal, Rice, 4 Roti" },
            { id: "cmb-2", name: "Special Thali", price: 130, isVeg: true, tag: "Must Try", desc: "Paneer Veg, Daal, Rice, 4 Roti, Salad" },
            { id: "cmb-3", name: "Dall Bati (2 Pic)", price: 60, isVeg: true, tag: "Traditional" },
            { id: "cmb-4", name: "Dall Bati With Ghee (2 Pic)", price: 80, isVeg: true, tag: "Rich" }
        ]
    }
];

let cartItemCount = 0;
let cartTotalAmount = 0;
let currentSearch = '';
let filterVegOnly = false;
let filterBestsellerOnly = false;

document.addEventListener('DOMContentLoaded', () => {
    renderSidebar();
    renderMenu();
    setupFilters();
    setupIntersectionObserver();
});

function renderSidebar() {
    const list = document.getElementById('category-list');
    let html = '';
    menuData.forEach((cat, index) => {
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
    const content = document.getElementById('menu-content');
    let html = '';

    menuData.forEach(cat => {
        // Filter items based on active filters
        let visibleItems = cat.items.filter(item => {
            let matchSearch = true;
            if (currentSearch) {
                matchSearch = item.name.toLowerCase().includes(currentSearch);
            }
            let matchVeg = true;
            if (filterVegOnly) {
                matchVeg = item.isVeg;
            }
            let matchBestseller = true;
            if (filterBestsellerOnly) {
                matchBestseller = item.tag && (item.tag.toLowerCase().includes('bestseller') || item.tag.toLowerCase().includes('must try'));
            }
            return matchSearch && matchVeg && matchBestseller;
        });

        if (visibleItems.length > 0) {
            html += `<div class="menu-section" id="cat-${cat.id}">`;
            html += `<h2 class="menu-section-title">${cat.icon} ${cat.name}</h2>`;
            html += `<div class="menu-items-grid">`;

            visibleItems.forEach(item => {
                html += `
                    <div class="dish-card">
                        <div class="dish-info">
                            <div class="dish-header">
                                ${item.isVeg ? '<div class="badge-veg"></div>' : ''}
                                <h3 class="dish-name">${item.name}</h3>
                            </div>
                            <div class="dish-price">₹${item.price}</div>
                            ${item.desc ? `<p class="dish-desc">${item.desc}</p>` : `<p class="dish-desc">Authentic taste made with pure ingredients.</p>`}
                            ${item.tag ? `<div class="dish-tags"><span class="dish-tag">${item.tag}</span></div>` : ''}
                        </div>
                        <div class="dish-visual">
                            <div class="dish-visual-placeholder">${cat.icon}</div>
                            <button class="btn-add-item" data-price="${item.price}" data-name="${item.name}">+ Add</button>
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
            addToCart(price, name);
        });
    });

    // Re-attach observer after DOM change
    setupIntersectionObserver();
}

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

function addToCart(price, name) {
    cartItemCount++;
    cartTotalAmount += price;
    updateCartWidget();
    showToast(`Added ${name} to cart`);
}

function updateCartWidget() {
    const widget = document.getElementById('desktop-cart-widget');
    const countEl = document.getElementById('cart-count');
    const totalEl = document.getElementById('widget-total');

    if (cartItemCount > 0) {
        widget.classList.remove('hidden');
        countEl.textContent = cartItemCount;
        totalEl.textContent = `₹${cartTotalAmount}`;
    } else {
        widget.classList.add('hidden');
    }
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
