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
