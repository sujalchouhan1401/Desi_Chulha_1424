document.addEventListener("DOMContentLoaded", () => {
    // ---------------------------------
    // Category Tabs Logic
    // ---------------------------------
    const catPills = document.querySelectorAll(".cat-pill");
    catPills.forEach(pill => {
        pill.addEventListener("click", () => {
            catPills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
        });
    });

    // ---------------------------------
    // Menu Add & Quantity Logic
    // ---------------------------------
    const qtyControls = document.querySelectorAll(".qty-control");
    const stickyCart = document.getElementById("sticky-cart");
    const cartCountEl = document.getElementById("cart-count");
    const cartTotalEl = document.getElementById("cart-total");

    let cart = {
        items: 0,
        totalPrice: 0
    };

    function updateCartUI() {
        if (cart.items > 0) {
            cartCountEl.textContent = cart.items === 1 ? "1 item" : `${cart.items} items`;
            cartTotalEl.textContent = `₹${cart.totalPrice}`;
            stickyCart.classList.remove("hidden");
        } else {
            stickyCart.classList.add("hidden");
        }
    }

    qtyControls.forEach(control => {
        const addBtn = control.querySelector(".add-btn");
        if (!addBtn) return;

        const price = parseInt(addBtn.getAttribute("data-price"));
        let qty = 0;

        addBtn.addEventListener("click", () => {
            // First time adding
            qty = 1;
            cart.items++;
            cart.totalPrice += price;
            updateCartUI();

            // Switch UI to +/-
            control.innerHTML = `
                <button class="qty-btn dec-btn">-</button>
                <div class="qty-value">${qty}</div>
                <button class="qty-btn inc-btn">+</button>
            `;

            attachQtyListeners(control, price);
        });
    });

    function attachQtyListeners(control, price) {
        const decBtn = control.querySelector(".dec-btn");
        const incBtn = control.querySelector(".inc-btn");
        const valEl = control.querySelector(".qty-value");
        let qty = parseInt(valEl.textContent);

        decBtn.addEventListener("click", () => {
            if (qty > 1) {
                qty--;
                valEl.textContent = qty;
                cart.items--;
                cart.totalPrice -= price;
                updateCartUI();
            } else {
                // If it was 1, remove item
                qty = 0;
                cart.items--;
                cart.totalPrice -= price;
                updateCartUI();

                // Revert to ADD button
                control.innerHTML = `<button class="add-btn" data-price="${price}">ADD</button>`;
                // Re-attach add listener (needs fresh query since DOM changed)
                const newAddBtn = control.querySelector(".add-btn");
                newAddBtn.addEventListener("click", () => {
                    qty = 1;
                    cart.items++;
                    cart.totalPrice += price;
                    updateCartUI();
                    control.innerHTML = `
                        <button class="qty-btn dec-btn">-</button>
                        <div class="qty-value">${qty}</div>
                        <button class="qty-btn inc-btn">+</button>
                    `;
                    attachQtyListeners(control, price);
                });
            }
        });

        incBtn.addEventListener("click", () => {
            qty++;
            valEl.textContent = qty;
            cart.items++;
            cart.totalPrice += price;
            updateCartUI();
        });
    }
});
