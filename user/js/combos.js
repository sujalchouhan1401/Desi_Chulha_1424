document.addEventListener("DOMContentLoaded", async () => {
    console.log("User Combos Initializing...");

    renderDynamicCombos();
});

async function renderDynamicCombos() {
    const section = document.getElementById('dynamic-combos-section');
    const grid = document.getElementById('dynamic-combos-grid');
    if (!section || !grid) return;

    try {
        // Load combos from MongoDB backend
        const response = await fetch('http://localhost:5000/api/combos-test');
        if (!response.ok) {
            console.error('Failed to load combos from backend');
            section.style.display = 'none';
            return;
        }

        const combos = await response.json();
        const activeCombos = combos.filter(c => c.active === true);

        if (activeCombos.length === 0) {
            section.style.display = 'none';
            return;
        }

        section.style.display = 'block';
        let html = '';

        activeCombos.forEach(combo => {
            const itemNames = combo.items.map(i => i.name).join(' + ');
            const savings = combo.originalPrice - combo.comboPrice;

            const imageHtml = combo.image
                ? `<img src="${combo.image}" style="width:100%; height:100%; object-fit:cover;" alt="${combo.name}">`
                : `<div style="font-size:3rem;">🍱</div>`;

            html += `
                <div class="food-card">
                    <div class="badge-ribbon" style="background:var(--success-val);">Save ₹${savings}</div>
                    <div class="food-img-wrap" style="background:#fdf2f0; display:flex; align-items:center; justify-content:center; height:160px; overflow:hidden;">
                        ${imageHtml}
                    </div>
                    <div class="food-info">
                        <h3>${combo.name}</h3>
                        <p class="desc">${itemNames}</p>
                        <div class="food-footer">
                            <div style="display:flex; flex-direction:column;">
                                <span style="text-decoration:line-through; color:#999; font-size:0.8rem;">₹${combo.originalPrice}</span>
                                <span class="price">₹${combo.comboPrice}</span>
                            </div>
                            <button class="btn-add-cart dynamic-add-btn" 
                                data-id="${combo._id || combo.id}" 
                                data-name="${combo.name}" 
                                data-price="${combo.comboPrice}">
                                Add Combo
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        grid.innerHTML = html;

        // Sync with home.js logic for quantity controls and add button states
        if (window.syncHomeCartButtons) {
            window.syncHomeCartButtons();
        } else {
            // Fallback if home.js finished first or is still loading
            document.addEventListener('DOMContentLoaded', () => {
                if (window.syncHomeCartButtons) window.syncHomeCartButtons();
            });
        }

    } catch (error) {
        console.error('Error loading combos:', error);
        section.style.display = 'none';
    }
}
