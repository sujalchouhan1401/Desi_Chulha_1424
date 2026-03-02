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
        const currentType = window.cartManager ? window.cartManager.getOrderType() : 'delivery';

        modal.classList.add('active');

        let html = '';

        // Add Order Type Switcher at the top of modal
        html += `
            <div class="cart-card" style="padding: 15px; margin-bottom: 20px; box-shadow: none; border: 1px solid #fdf2f0;">
                <h3 style="font-size: 16px; margin-bottom: 15px;">🍱 Select Order Type</h3>
                <div class="order-types" id="modal-order-type-selector" style="display: flex; gap: 10px;">
                    <div class="order-type ${currentType === 'delivery' ? 'active' : ''}" data-type="delivery" style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 8px; text-align: center; cursor: pointer;">
                        <span class="type-icon">🛵</span>
                        <div class="type-name" style="font-size: 12px; font-weight: 600;">Delivery</div>
                    </div>
                    <div class="order-type ${currentType === 'dinein' ? 'active' : ''}" data-type="dinein" style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 8px; text-align: center; cursor: pointer;">
                        <span class="type-icon">🍽️</span>
                        <div class="type-name" style="font-size: 12px; font-weight: 600;">Dine In</div>
                    </div>
                    <div class="order-type ${currentType === 'pickup' ? 'active' : ''}" data-type="pickup" style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 8px; text-align: center; cursor: pointer;">
                        <span class="type-icon">🛍️</span>
                        <div class="type-name" style="font-size: 12px; font-weight: 600;">Pickup</div>
                    </div>
                </div>
            </div>
        `;

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

        // Attach listeners to modal order types
        const modalTypeBtns = body.querySelectorAll('.order-type');
        modalTypeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.getAttribute('data-type');
                if (window.cartManager) {
                    window.cartManager.setOrderType(type);
                }
            });
        });
    }

    window.openContactModal = function () {
        document.getElementById('contact-modal').classList.add('active');
    }

    window.closeModal = function (id) {
        document.getElementById(id).classList.remove('active');
    }

    window.clearCartHandler = function () {
        if (confirm('Are you sure you want to clear your entire cart?')) {
            if (window.cartManager) {
                window.cartManager.clearCart();
                openOrdersModal();
            }
        }
    }


    // ---------------------------------
    // Sticky Cart Logic
    // ---------------------------------
    const addCartBtns = document.querySelectorAll(".btn-add-cart, .btn-combo-add");

    addCartBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();

            // Find closest parent that might contain title (e.g., food-card, combo-wide-card)
            const parentCard = btn.closest('.food-card') || btn.closest('.combo-wide-card');
            let itemName = "Item";
            let isVeg = true;

            if (parentCard) {
                const titleEl = parentCard.querySelector('h3');
                if (titleEl) itemName = titleEl.textContent;

                // Assume non-veg if there is any text implying 'Chicken', 'Mutton', 'Non-Veg'
                if (itemName.toLowerCase().includes('chicken') || itemName.toLowerCase().includes('mutton') || itemName.toLowerCase().includes('non-veg')) {
                    isVeg = false;
                }
            }

            // Get price from data attribute
            const price = parseInt(btn.getAttribute("data-price"));
            if (!price) return;

            // Use global cartManager to add item and trigger widget update
            if (window.cartManager) {
                window.cartManager.addItem({
                    name: itemName,
                    price: price,
                    isVeg: isVeg
                });
            }

            // Button visual feedback
            const originalText = btn.innerHTML;
            btn.innerHTML = "Added ✓";

            // Inline CSS to match success
            const origBg = btn.style.backgroundColor;
            const origColor = btn.style.color;
            const origBorder = btn.style.borderColor;

            btn.style.backgroundColor = "var(--success-val)";
            btn.style.color = "#fff";
            btn.style.borderColor = "var(--success-val)";

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = origBg;
                btn.style.color = origColor;
                btn.style.borderColor = origBorder;
            }, 1200);

        });
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
