document.addEventListener("DOMContentLoaded", () => {
    // Payment Option selection
    const paymentOptions = document.querySelectorAll(".payment-option");

    paymentOptions.forEach(opt => {
        opt.addEventListener("click", () => {
            // Remove active states
            paymentOptions.forEach(p => {
                p.classList.remove("selected");
                p.querySelector(".radio-circle").classList.remove("active");
            });
            // Add active state
            opt.classList.add("selected");
            opt.querySelector(".radio-circle").classList.add("active");
        });
    });

    // Place Order Flow
    const placeOrderBtn = document.getElementById("place-order-btn");
    const successModal = document.getElementById("success-modal");

    placeOrderBtn.addEventListener("click", () => {
        // Change button text to show loading state
        const origText = placeOrderBtn.innerHTML;
        placeOrderBtn.innerHTML = `Processing... <span class="loader-inline"></span>`;
        placeOrderBtn.style.opacity = 0.8;

        // Simulate network request
        setTimeout(() => {
            placeOrderBtn.innerHTML = origText;
            placeOrderBtn.style.opacity = 1;

            // Show modal
            successModal.classList.remove("hidden");
        }, 1500);
    });
});
