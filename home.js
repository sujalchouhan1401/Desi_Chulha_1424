document.addEventListener("DOMContentLoaded", () => {
    // ---------------------------------
    // 1. Skeleton Loader Logic
    // ---------------------------------
    const skeletonScreen = document.getElementById("skeleton-screen");
    const appContent = document.getElementById("app-content");

    // Simulate initial data loading with a slight delay
    setTimeout(() => {
        skeletonScreen.classList.add("hidden");
        appContent.classList.remove("hidden");
    }, 1200);

    // ---------------------------------
    // 2. Order Type Selection Logic
    // ---------------------------------
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove("active"));
            // Add active class to clicked
            btn.classList.add("active");

            // Add slight pulse animation
            btn.style.transform = "scale(0.95)";
            setTimeout(() => {
                btn.style.transform = "translateY(-2px)";
            }, 150);
        });
    });

    // ---------------------------------
    // 3. Cart Logic
    // ---------------------------------
    const addBtns = document.querySelectorAll(".btn-add, .btn-add-over");
    const stickyCart = document.getElementById("sticky-cart");
    const cartCountEl = document.getElementById("cart-count");
    const cartTotalEl = document.getElementById("cart-total");

    let cart = {
        items: 0,
        totalPrice: 0
    };

    addBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault(); // prevent any default action like scrolling

            // Get item info
            const price = parseInt(btn.getAttribute("data-price"));

            // Update cart state
            cart.items += 1;
            cart.totalPrice += price;

            // Update sticky cart UI
            cartCountEl.textContent = cart.items === 1 ? "1 item" : `${cart.items} items`;
            cartTotalEl.textContent = `₹${cart.totalPrice}`;

            // Show cart if hidden
            if (stickyCart.classList.contains("hidden")) {
                stickyCart.classList.remove("hidden");
            } else {
                // If already visible, add a subtle bounce effect
                stickyCart.style.transform = "translate(-50%, -5px)";
                setTimeout(() => {
                    stickyCart.style.transform = "translate(-50%, 0)";
                }, 200);
            }

            // Button visual feedback
            const originalText = btn.innerHTML;
            btn.innerHTML = "Added ✓";

            // Apply inline styles to show success state
            btn.style.backgroundColor = "var(--success-val)";
            btn.style.color = "#fff";
            btn.style.borderColor = "var(--success-val)";

            setTimeout(() => {
                btn.innerHTML = originalText;
                // Reset styling to CSS defaults by removing inline styles
                btn.style.backgroundColor = "";
                btn.style.color = "";
                btn.style.borderColor = "";
            }, 1200);
        });
    });
});
