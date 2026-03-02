document.addEventListener("DOMContentLoaded", () => {

    // ---------------------------------
    // Order Tabs Logic
    // ---------------------------------
    const typePills = document.querySelectorAll(".type-pill");
    typePills.forEach(pill => {
        pill.addEventListener("click", () => {
            typePills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
        });
    });

    // ---------------------------------
    // Sticky Cart Logic
    // ---------------------------------
    const addCartBtns = document.querySelectorAll(".btn-add-cart, .btn-combo-add");
    const cartWidget = document.getElementById("desktop-cart-widget");
    const cartTotalEl = document.getElementById("widget-total");
    const cartCountEl = cartWidget.querySelector(".item-count");

    let cart = {
        items: 0,
        totalPrice: 0
    };

    addCartBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();

            // Get price from data attribute
            const price = parseInt(btn.getAttribute("data-price"));
            if (!price) return;

            // Update cart state
            cart.items += 1;
            cart.totalPrice += price;

            // Update UI
            cartCountEl.textContent = cart.items;
            cartTotalEl.textContent = `₹${cart.totalPrice}`;

            // Show Widget if hidden
            if (cartWidget.classList.contains("hidden")) {
                cartWidget.classList.remove("hidden");
            } else {
                // Subtle bounce animation if already visible
                cartWidget.style.transform = "scale(1.02) translateY(-4px)";
                setTimeout(() => {
                    cartWidget.style.transform = "scale(1) translateY(0)";
                }, 200);
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

});
