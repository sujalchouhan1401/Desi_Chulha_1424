document.addEventListener("DOMContentLoaded", () => {

    const addBtns = document.querySelectorAll(".btn-add-combo, .btn-add-combo-sm, .btn-add-circle");
    const stickyCart = document.getElementById("combo-sticky-cart");
    const emptyState = document.getElementById("empty-state"); // For future logic if items are removed
    const cartCountEl = document.getElementById("cart-count");
    const cartTotalEl = document.getElementById("cart-total");
    const toastMsg = document.getElementById("toast-msg");

    let cart = {
        items: 0,
        totalPrice: 0
    };

    addBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();

            // Get data
            const price = parseInt(btn.getAttribute("data-price"));
            if (!price) return;

            // Update state
            cart.items += 1;
            cart.totalPrice += price;

            // Update UI
            cartCountEl.textContent = cart.items === 1 ? "1 Combo" : `${cart.items} Combos`;
            cartTotalEl.textContent = `₹${cart.totalPrice}`;

            // Show Cart Bar
            if (stickyCart.classList.contains("hidden")) {
                stickyCart.classList.remove("hidden");
            } else {
                // Bounce effect
                stickyCart.style.transform = "translate(-50%, -8px)";
                setTimeout(() => {
                    stickyCart.style.transform = "translate(-50%, 0)";
                }, 200);
            }

            // Button visual feedback logic depending on button type
            const originalText = btn.innerHTML;

            if (btn.classList.contains("btn-add-circle")) {
                btn.innerHTML = "✓";
                btn.style.backgroundColor = "var(--success-val)";
                btn.style.color = "#fff";
            } else {
                btn.innerHTML = "Added ✓";
                btn.style.backgroundColor = "var(--success-val)";
                btn.style.color = "#fff";
                btn.style.borderColor = "var(--success-val)";
            }

            // Show toast message
            showToast();

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = "";
                btn.style.color = "";
                btn.style.borderColor = "";
            }, 1000);
        });
    });

    let toastTimeout;
    function showToast() {
        toastMsg.classList.remove("hidden");
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toastMsg.classList.add("hidden");
        }, 2000);
    }
});
