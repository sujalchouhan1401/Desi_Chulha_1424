/**
 * Admin Combo Management - Logic
 * Uses comboStorage.js and menuStorage.js
 */

let combosCache = [];
let menuItemsCache = [];

// Initialize after admin layout is injected
if (document.querySelector('.admin-workspace')) {
    init();
} else {
    document.addEventListener('adminLayoutReady', init);
}

// Storage sync for cross-tab updates
window.addEventListener('storage', (e) => {
    if (e.key === 'combos' || e.key === 'menuItems') {
        loadData();
    }
});

async function init() {
    console.log("Admin Combos UI Initializing...");

    if (!window.comboStorage || !window.menuStorage) {
        console.error("Required storage utilities NOT found on window.");
        return;
    }

    // Seed data if empty
    window.comboStorage.seedData();

    loadData();
    attachGlobalEvents();
}

function loadData() {
    combosCache = window.comboStorage.getCombos();
    menuItemsCache = window.menuStorage.getMenuItems();
    renderCombos();
    populateMenuItemsSelection();
}

function renderCombos() {
    const tbody = document.getElementById('combo-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (combosCache.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:40px; color:#666;">No combos found. Create your first meal package!</td></tr>';
        return;
    }

    combosCache.forEach(combo => {
        const tr = document.createElement('tr');
        const itemsList = combo.items.map(i => i.name).join(', ');

        tr.innerHTML = `
            <td style="font-weight:600;">${combo.name}</td>
            <td style="font-size:0.9rem; color:#666; max-width: 300px;">${itemsList}</td>
            <td>₹${combo.originalPrice}</td>
            <td style="color:#059669; font-weight:700;">₹${combo.comboPrice}</td>
            <td>
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                    <input type="checkbox" class="toggle-status" data-id="${combo.id}" ${combo.active ? 'checked' : ''}>
                    <span style="font-size:0.85rem; color:${combo.active ? '#059669' : '#dc2626'}">${combo.active ? 'Active' : 'Inactive'}</span>
                </label>
            </td>
            <td>
                <button class="combo-action-btn edit edit-combo-btn" data-id="${combo.id}" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="combo-action-btn delete delete-combo-btn" data-id="${combo.id}" title="Delete"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    attachDynamicEvents();
}

function populateMenuItemsSelection() {
    const container = document.getElementById('menu-items-list');
    if (!container) return;

    if (menuItemsCache.length === 0) {
        container.innerHTML = '<p style="font-size:0.8rem; color:#999;">No menu items available. Add items in Menu Management first.</p>';
        return;
    }

    container.innerHTML = menuItemsCache.map(item => `
        <label class="item-checkbox">
            <input type="checkbox" name="combo-item" value="${item.id}" data-name="${item.name}" data-price="${item.price}">
            <span>${item.name} (₹${item.price})</span>
        </label>
    `).join('');

    // Attach listener for price calculation
    const checkboxes = container.querySelectorAll('input[name="combo-item"]');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', calculateOriginalPrice);
    });
}

function calculateOriginalPrice() {
    const selected = document.querySelectorAll('input[name="combo-item"]:checked');
    let total = 0;
    selected.forEach(cb => {
        total += parseFloat(cb.getAttribute('data-price'));
    });
    document.getElementById('original-total').textContent = `₹${total}`;
    return total;
}

function attachGlobalEvents() {
    const modal = document.getElementById('combo-modal');
    const addBtn = document.getElementById('add-combo-btn');
    const closeBtn = document.getElementById('modal-close-btn');
    const form = document.getElementById('combo-form');

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            document.getElementById('modal-title').textContent = "Create New Combo";
            document.getElementById('edit-id').value = "";
            form.reset();
            document.getElementById('original-total').textContent = "₹0";
            modal.style.display = 'flex';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.style.display = 'none');
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('edit-id').value;

            // Get selected items
            const selectedItems = [];
            document.querySelectorAll('input[name="combo-item"]:checked').forEach(cb => {
                selectedItems.push({
                    name: cb.getAttribute('data-name'),
                    price: parseFloat(cb.getAttribute('data-price'))
                });
            });

            if (selectedItems.length === 0) {
                alert("Please select at least one item for the combo.");
                return;
            }

            const comboData = {
                name: document.getElementById('combo-name').value,
                image: document.getElementById('combo-image').value,
                items: selectedItems,
                originalPrice: calculateOriginalPrice(),
                comboPrice: parseFloat(document.getElementById('combo-price').value)
            };

            if (id) {
                window.comboStorage.updateCombo(id, comboData);
            } else {
                window.comboStorage.addCombo(comboData);
            }

            modal.style.display = 'none';
            loadData();
        });
    }
}

function attachDynamicEvents() {
    // Toggle Status
    document.querySelectorAll('.toggle-status').forEach(cb => {
        cb.addEventListener('change', (e) => {
            const id = e.target.getAttribute('data-id');
            window.comboStorage.toggleComboStatus(id);
            loadData();
        });
    });

    // Delete Combo
    document.querySelectorAll('.delete-combo-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('button').getAttribute('data-id');
            if (confirm("Are you sure you want to delete this combo?")) {
                window.comboStorage.deleteCombo(id);
                loadData();
            }
        });
    });

    // Edit Combo
    document.querySelectorAll('.edit-combo-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('button').getAttribute('data-id');
            const combo = combosCache.find(c => c.id === id);
            if (combo) {
                document.getElementById('modal-title').textContent = "Edit Combo Package";
                document.getElementById('edit-id').value = combo.id;
                document.getElementById('combo-name').value = combo.name;
                document.getElementById('combo-image').value = combo.image || "";
                document.getElementById('combo-price').value = combo.comboPrice;

                // Reset and check specific items
                const checkboxes = document.querySelectorAll('input[name="combo-item"]');
                checkboxes.forEach(cb => {
                    const itemName = cb.getAttribute('data-name');
                    cb.checked = combo.items.some(i => i.name === itemName);
                });

                calculateOriginalPrice();
                document.getElementById('combo-modal').style.display = 'flex';
            }
        });
    });
}
