document.addEventListener("DOMContentLoaded", () => {

    // ---------------------------------
    // Order Type Sync (Synchronized)
    // ---------------------------------
    window.syncOrderTypeUI = function () {
        // If the orders modal is active, refresh it
        const modal = document.getElementById('orders-modal');
        if (modal && modal.classList.contains('active')) {
            openOrdersModal();
        }
    };

    // Initial sync
    if (window.cartManager) window.syncOrderTypeUI();

    // ---------------------------------
    // Modal Functions
    // ---------------------------------
    window.openOrdersModal = function () {
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
            html += '<div class="orders-list" style="margin-top: 20px;">';
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
                        <button class="btn-outline" style="flex: 1; border-color: #666; color: #666; padding: 12px; border-radius: 12px; cursor: pointer;" onclick="clearCartHandler()">Clear Cart</button>
                        <button class="btn-primary" style="flex: 2; border-radius: 12px; padding: 12px; box-shadow: none;" onclick="window.location.href='cart.html'">Go to Checkout</button>
                    </div>
                </div>
            `;
            html += '</div>';
        }

        body.innerHTML = html;
    }

    window.openContactModal = function () {
        document.getElementById('contact-modal').classList.add('active');
    }

    window.closeModal = function (id) {
        document.getElementById(id).classList.remove('active');
    }

    window.clearCartHandler = function () {
        if (window.cartManager) {
            window.cartManager.clearCart();
            openOrdersModal();
        }
    }


    // ---------------------------------
    // Cart Buttons & Quantity Sync Logic
    // ---------------------------------
    window.syncHomeCartButtons = function () {
        if (!window.cartManager) return;
        const cartItems = window.cartManager.getCart();

        const allContainers = document.querySelectorAll('.food-footer, .combo-details, .slide-content');
        allContainers.forEach(container => {
            const parentCard = container.closest('.food-card, .combo-wide-card, .slide-content');
            if (!parentCard) return;
            const titleEl = parentCard.querySelector('h3') || parentCard.querySelector('.slide-title');
            if (!titleEl) return;

            const itemName = titleEl.textContent;
            const itemId = 'item-' + itemName.toLowerCase().replace(/\s+/g, '-');
            const cartItem = cartItems.find(i => i.id === itemId);

            const addBtn = container.querySelector('.btn-add-cart, .btn-combo-add');
            // If it doesn't have an add btn that we control, skip
            if (!addBtn && !container.querySelector('.qty-control-wrapper')) return;

            let qtyControl = container.querySelector('.qty-control-wrapper');

            if (cartItem) {
                // Item in cart, show qty control, hide add btn
                if (addBtn) addBtn.style.display = 'none';

                if (!qtyControl) {
                    qtyControl = document.createElement('div');
                    qtyControl.className = 'qty-control-wrapper';
                    // Apply styles inline so it looks good on the homepage/combopage
                    qtyControl.style.display = 'flex';
                    qtyControl.style.alignItems = 'center';
                    qtyControl.style.background = 'var(--bg-color)';
                    qtyControl.style.borderRadius = 'var(--radius-sm)';
                    qtyControl.style.padding = '4px 8px';

                    if (container.classList.contains('combo-details')) {
                        qtyControl.style.width = '100%';
                        qtyControl.style.justifyContent = 'space-between';
                        qtyControl.style.marginTop = 'auto';
                        qtyControl.style.padding = '10px';
                    }

                    qtyControl.innerHTML = `
                        <button class="qty-btn dec-btn" style="background:transparent; border:none; color:var(--primary-color); font-size:18px; font-weight:600; cursor:pointer; width:30px;" onclick="window.cartManager.updateQuantity('${itemId}', 'decrement'); window.syncHomeCartButtons();">-</button>
                        <span class="qty-val" style="font-weight:600; width:40px; text-align:center;">${cartItem.qty}</span>
                        <button class="qty-btn inc-btn" style="background:transparent; border:none; color:var(--primary-color); font-size:18px; font-weight:600; cursor:pointer; width:30px;" onclick="window.cartManager.updateQuantity('${itemId}', 'increment'); window.syncHomeCartButtons();">+</button>
                    `;

                    if (addBtn && addBtn.parentNode) {
                        addBtn.parentNode.insertBefore(qtyControl, addBtn.nextSibling);
                    } else {
                        container.appendChild(qtyControl);
                    }
                } else {
                    qtyControl.querySelector('.qty-val').textContent = cartItem.qty;
                }
            } else {
                // Not in cart
                if (addBtn) {
                    if (container.classList.contains('combo-details')) {
                        addBtn.style.display = 'block';
                    } else {
                        addBtn.style.display = 'inline-block';
                    }
                }
                if (qtyControl) qtyControl.remove();
            }
        });

        // Let the global cartManager know UI changed (updates overall total and widget)
        if (window.cartManager) {
            window.cartManager.updateGlobalWidget();
        }
    };

    // Initial Sync
    window.syncHomeCartButtons();

    // Hook up Add buttons to trigger state changes
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-add-cart') || e.target.classList.contains('btn-combo-add')) {
            const btn = e.target;
            e.preventDefault();

            const parentCard = btn.closest('.food-card') || btn.closest('.combo-wide-card') || btn.closest('.slide-content');
            let itemName = "Item";
            let isVeg = true;

            if (parentCard) {
                const titleEl = parentCard.querySelector('h3') || parentCard.querySelector('.slide-title');
                if (titleEl) itemName = titleEl.textContent;

                if (itemName.toLowerCase().includes('chicken') || itemName.toLowerCase().includes('mutton') || itemName.toLowerCase().includes('non-veg')) {
                    isVeg = false;
                }
            }

            const price = parseInt(btn.getAttribute("data-price"));
            if (!price) return;

            if (window.cartManager) {
                window.cartManager.addItem({
                    name: itemName,
                    price: price,
                    isVeg: isVeg
                });
                window.syncHomeCartButtons();
            }
        }
    });

    // ---------------------------------
    // Highlights Slider Logic
    // ---------------------------------
    const sliderWrapper = document.getElementById('highlights-slider');
    const dots = document.querySelectorAll('.slider-dot');
    const btnPrev = document.getElementById('slide-prev');
    const btnNext = document.getElementById('slide-next');

    if (sliderWrapper) {
        let currentSlide = 0;
        const totalSlides = 3;
        let slideInterval;

        const updateSlider = () => {
            sliderWrapper.style.transform = `translateX(-${currentSlide * 33.333}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentSlide].classList.add('active');
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        };

        const startAutoSlide = () => {
            slideInterval = setInterval(nextSlide, 5000);
        };

        const resetAutoSlide = () => {
            clearInterval(slideInterval);
            startAutoSlide();
        };

        btnNext.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });

        btnPrev.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateSlider();
                resetAutoSlide();
            });
        });

        startAutoSlide();
    }

});
