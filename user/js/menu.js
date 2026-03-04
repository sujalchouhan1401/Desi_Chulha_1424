const menuData = [
    {
        id: "beverage",
        name: "Beverage",
        icon: "☕",
        items: [
            { id: "bev-1", name: "Tea", price: 10, isVeg: true, tag: null, image: "../../images/menu/tea.jpg", desc: "Ek cup jo din bana de." },
            { id: "bev-2", name: "Kulhad Tea", price: 15, isVeg: true, tag: "Must Try", image: "../../images/menu/kulhad-tea.png", desc: "Desi vibes, kadak taste." },
            { id: "bev-3", name: "Hot Coffee", price: 30, isVeg: true, tag: null, image: "../../images/menu/hot-coffee.png", desc: "Sip karo, stress ko skip karo." },
            { id: "bev-4", name: "Cold Coffee", price: 50, isVeg: true, tag: "Bestseller", image: "../../images/menu/cold-coffee.png", desc: "Sip karo, heat ko beat karo." },
            { id: "bev-5", name: "Lassi Sweet", price: 50, isVeg: true, tag: null, image: "../../images/menu/lassi.png", desc: "Garmi ka meetha solution." },
            { id: "bev-6", name: "Lassi Salty", price: 30, isVeg: true, tag: null, image: "../../images/menu/lassi.png", desc: "Namak ka tadka, sukoon ka jhatka." }
        ]
    },
    {
        id: "chaat",
        name: "Chaat",
        icon: "🥟",
        items: [
            { id: "chaat-1", name: "Papadi Chaat", price: 70, isVeg: true, tag: null, image: "../../images/menu/papdi-chaat.jpg", desc: "har bite mein chatpata dhamaka" },
            { id: "chaat-2", name: "Papadi Bhalla Chaat", price: 80, isVeg: true, tag: null, image: "../../images/menu/papdi-bhalla-chaat.jpg", desc: "soft bhalla, crispy papdi aur chatpata swaad ka perfect combo." },
            { id: "chaat-3", name: "Dahi Patasi", price: 60, isVeg: true, tag: "Bestseller", image: "../../images/menu/dahi-patasi.jpg", desc: "Diet kal se… aaj toh Dahi Patasi hi sahi." },
            { id: "chaat-4", name: "Dahi Bhalla", price: 50, isVeg: true, tag: null, image: "../../images/menu/dahi-bhalla.jpg", desc: "Itna soft, bas dil bhi pighal jaye." },
            { id: "chaat-5", name: "Kaji Vada", price: 30, isVeg: true, tag: null, image: "../../images/menu/kaji-vada.jpg", desc: "Marwadi rasoi ka mashhoor swaad – Kaji Vada lajawab." },
            { id: "chaat-6", name: "Raj Kachori", price: 90, isVeg: true, tag: "Chef's Special", image: "../../images/menu/raj-kachori.jpg", desc: "Ye snack nahi, full-size surprise hai." },
            { id: "chaat-7", name: "Aloo Tikki Chaat", price: 60, isVeg: true, tag: null, image: "../../images/menu/aloo-tikki-chaat.jpg", desc: "Aloo Tikki – control system permanently fail." },
            { id: "chaat-8", name: "Samosa Chaat", price: 60, isVeg: true, tag: null, image: "../../images/menu/samosa-chaat.png", desc: "Teen sides ka snack, par bhookh chaar guna." },
            { id: "chaat-9", name: "Fruit Salad", price: 120, isVeg: true, tag: "Healthy", image: "../../images/menu/fruit-salad.jpg", desc: "Colorful bowl, powerful soul." },
            { id: "chaat-10", name: "Fruit Salad Chaat", price: 130, isVeg: true, tag: null, image: "../../images/menu/fruit-salad.jpg", desc: "Vitamin ka bomb, taste ka storm." }
        ]
    },
    {
        id: "indian-street-delights",
        name: "Indian Street Delights",
        icon: "🥙",
        items: [
            { id: "str-1", name: "Puri Bhaji", price: 60, isVeg: true, tag: null, image: "../../images/menu/puri-bhaji.png", desc: "Puri Bhaji – pet bhi happy, dil bhi happy." },
            { id: "str-2", name: "Poha", price: 40, isVeg: true, tag: null, image: "../../images/menu/poha.jpg", desc: "Haldi ka rang, sehat ke sang." },
            { id: "str-3", name: "Bhel Puri", price: 50, isVeg: true, tag: null, image: "../../images/menu/bhel-puri.jpg", desc: "Ek mutthi bhel, aur mood ho jaye swell." },
            { id: "str-4", name: "Pav Bhaji", price: 70, isVeg: true, tag: "Bestseller", image: "../../images/menu/pav-bhaji.png", desc: "taste ka asli Mumbaiya blast." },
            { id: "str-5", name: "Vada Pav", price: 50, isVeg: true, tag: "Must Try", image: "../../images/menu/vada-pav.png", desc: "snack itna famous ki log bhi brand ban gaye." },
            { id: "str-6", name: "Dabeli", price: 30, isVeg: true, tag: null, image: "../../images/menu/dabeli.jpg", desc: "masala itna zabardast, har bite mein blast." },
            { id: "str-7", name: "Veg Pakoda", price: 60, isVeg: true, tag: null, image: "../../images/menu/veg-pakoda.jpg", desc: "baarish ka official partner." },
            { id: "str-8", name: "Cheela Besan", price: 40, isVeg: true, tag: null, image: "../../images/menu/cheela-besan.jpg", desc: "Healthy bolke khate hain… par upar se chatni double." },
            { id: "str-9", name: "Cheela Suji", price: 40, isVeg: true, tag: null, image: "../../images/menu/cheela-suji.png", desc: "Sujal ka Suji Chilla – breakfast ka asli star." },
            { id: "str-10", name: "Popcorn", price: 50, isVeg: true, tag: null, image: "../../images/menu/popcorn.jpg", desc: "Picture shuru ho ya na ho, popcorn zaroori hai." },
            { id: "str-11", name: "Chhole Bhature", price: 70, isVeg: true, tag: "Bestseller", image: "../../images/menu/chole-bhature.jpg", desc: "Itna zabardast combo, diet bole – main chali." },
            { id: "str-12", name: "Burger", price: 80, isVeg: true, tag: null, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop", desc: "Messy hands, happy heart." },
            { id: "str-13", name: "Pizza", price: 99, isVeg: true, tag: null, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop", desc: "Ek slice mein history, har bite mein chemistry." }
        ]
    },
    {
        id: "paratha",
        name: "Paratha",
        icon: "🫓",
        items: [
            { id: "par-1", name: "Aloo Paratha", price: 40, isVeg: true, tag: "Bestseller", image: "../../images/menu/aloo-paratha.jpg", desc: "Gym skip karo, Aloo Paratha pick karo." },
            { id: "par-2", name: "Gobhi Paratha", price: 50, isVeg: true, tag: null, image: "../../images/menu/gobhi-paratha.jpg", desc: "jab sehat aur swaad saath aaye." },
            { id: "par-3", name: "Mooli Paratha", price: 50, isVeg: true, tag: null, image: "../../images/menu/mooli-paratha.jpg", desc: "khane mein royal, baad mein 'announcement' automatic." },
            { id: "par-4", name: "Paneer Paratha", price: 60, isVeg: true, tag: null, image: "../../images/menu/paneer-paratha.jpg", desc: "har bite mein shahi shaan." },
            { id: "par-5", name: "Paneer Mawa Sweer Paratha", price: 70, isVeg: true, tag: "Sweet", image: "../../images/menu/paneer-mawa-paratha.jpg", desc: "Har bite mein dessert wali delight." },
            { id: "par-6", name: "Mater Paratha", price: 50, isVeg: true, tag: null, image: "../../images/menu/matar-paratha.jpg", desc: "Hari matar ka tadka, breakfast ka dhamaka." },
            { id: "par-7", name: "Plain Paratha", price: 20, isVeg: true, tag: null, image: "../../images/menu/plain-paratha.png", desc: "Chai ho ya sabzi, Plain Paratha har jagah busy." }
        ]
    },
    {
        id: "south-indian",
        name: "South Indian",
        icon: "🌮",
        items: [
            { id: "sid-1", name: "Idli Sambhar", price: 40, isVeg: true, tag: null, image: "../../images/menu/idli-sambhar.jpg", desc: "Soft idli, spicy sambar – perfect harmony." },
            { id: "sid-2", name: "Dosa Masala", price: 80, isVeg: true, tag: "Bestseller", image: "../../images/menu/dosa-masala.jpg", desc: "Dosa ki thickness bilkul perfect… na zyada, na kam — bilkul uski 'mood swings' ki tarah." },
            { id: "sid-3", name: "Utpam", price: 60, isVeg: true, tag: null, image: "../../images/menu/utpam.jpg", desc: "Thick, tasty aur full veggie loaded." },
            { id: "sid-4", name: "Upama", price: 60, isVeg: true, tag: null, image: "../../images/menu/upama.jpg", desc: "Har spoon mein sukoon." }
        ]
    },
    {
        id: "soup",
        name: "Soup",
        icon: "🥣",
        items: [
            { id: "soup-1", name: "Tomato Soup", price: 50, isVeg: true, tag: null, image: "../../images/menu/tomato-soup.png", desc: "Ek cup aur thand ho gayi cup." },
            { id: "soup-2", name: "Sweetcorn Soup", price: 50, isVeg: true, tag: null, image: "../../images/menu/sweetcorn-soup.jpg", desc: "simple, smooth, satisfying." },
            { id: "soup-3", name: "Hot & Sour Soup", price: 50, isVeg: true, tag: null, image: "../../images/menu/hot-sure.jpg", desc: "ek sip mein fire bhi, desire bhi." },
            { id: "soup-4", name: "Mix Veg Soup", price: 50, isVeg: true, tag: "Healthy", image: "../../images/menu/mix-veg-soup.jpg", desc: "Ek bowl aur body bole thank you." }
        ]
    },
    {
        id: "bread",
        name: "Bread",
        icon: "🍞",
        items: [
            { id: "brd-1", name: "Bread Jam", price: 50, isVeg: true, tag: null, image: "../../images/menu/bread-jam.jpg", desc: "quick bhi, cute bhi." },
            { id: "brd-2", name: "Bread Butter", price: 30, isVeg: true, tag: null, image: "../../images/menu/bread-butter.jpg", desc: "simplicity ka smooth star." },
            { id: "brd-3", name: "Aloo Sandwich", price: 40, isVeg: true, tag: null, image: "../../images/menu/aloo-sandwich.png", desc: "Aloo ka swag, bread ka tag." },
            { id: "brd-4", name: "Veg. Sandwich", price: 50, isVeg: true, tag: null, image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=400&auto=format&fit=crop", desc: "Crisp veggies, cool mood." },
            { id: "brd-5", name: "Veg Cheese Sandwich", price: 60, isVeg: true, tag: "Bestseller", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=400&auto=format&fit=crop", desc: "Sabziyon ka swag, upar se cheese ka tag." }
        ]
    },
    {
        id: "quick-bites",
        name: "Quick Bites",
        icon: "🍜",
        items: [
            { id: "qb-1", name: "Maggi", price: 30, isVeg: true, tag: null, image: "../../images/menu/maggi.jpg", desc: "Jab bhookh ho emergency, Maggi hi frequency." },
            { id: "qb-2", name: "Veg. Maggi", price: 40, isVeg: true, tag: null, image: "../../images/menu/veg-maggi.jpg", desc: "2 minute mein healthy twist." },
            { id: "qb-3", name: "Cheese Maggi", price: 60, isVeg: true, tag: "Must Try", image: "../../images/menu/cheese-maggi.jpg", desc: "Melty magic, instant tragic." },
            { id: "qb-4", name: "Chowmein", price: 60, isVeg: true, tag: "Bestseller", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=400&auto=format&fit=crop", desc: "Ek plate aur hunger late." }
        ]
    },
    {
        id: "combos",
        name: "Thali",
        icon: "🍱",
        items: [
            { id: "cmb-1", name: "Regular thali", price: 100, isVeg: true, tag: "Daily Need", desc: "Roti , Chaval , Sabji, Daal, Salad", image: "../../images/menu/regular-thali.jpg" },
            { id: "cmb-2", name: "Special Thali", price: 130, isVeg: true, tag: "Must Try", desc: "Roti , Chaval , Special Sabji , Daal/Kadi , Sweet , Dahi , Salad", image: "../../images/menu/special-thali.jpg" },
            { id: "cmb-3", name: "Dall Bati (2 Pic)", price: 60, isVeg: true, tag: "Traditional", image: "../../images/menu/dal-bati.jpg", desc: "Jitna ghee, utna pyaar – yahi hai daal baati ka asli sanskaar." },
            { id: "cmb-4", name: "Dall Bati With Ghee (2 Pic)", price: 80, isVeg: true, tag: "Rich", image: "../../images/menu/dal-bati-ghee.jpg", desc: "Jitna ghee, utna pyaar – yahi hai daal baati ka asli sanskaar." }
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
    if (!content) return;
    let html = '';

    const cart = window.cartManager ? window.cartManager.getCart() : [];

    menuData.forEach(cat => {
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
                const itemId = item.id || 'item-' + item.name.toLowerCase().replace(/\s+/g, '-');
                const cartItem = cart.find(i => i.id === itemId);

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
                            ${item.image
                        ? `<img src="${item.image}" alt="${item.name}" class="dish-image">`
                        : `<div class="dish-visual-placeholder">${cat.icon}</div>`
                    }
                            <div class="action-container" style="margin-top: 10px;">
                                ${cartItem ? `
                                    <div class="qty-selector">
                                        <button class="qty-btn minus" data-id="${itemId}">-</button>
                                        <span class="qty-val">${cartItem.qty}</span>
                                        <button class="qty-btn plus" data-id="${itemId}">+</button>
                                    </div>
                                ` : `
                                    <button class="btn-add-item" data-id="${item.id}" data-price="${item.price}" data-name="${item.name}" data-veg="${item.isVeg}">+ Add</button>
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
