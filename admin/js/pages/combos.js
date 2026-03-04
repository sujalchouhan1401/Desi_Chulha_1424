import { AdminAPI } from '../api.js';

let combosCache = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadCombos();
        attachCoreEvents();
    } catch (e) {
        console.error("Error loading combos", e);
    }
});

async function loadCombos() {
    combosCache = await AdminAPI.getCombos();
    renderCombos();
}

function renderCombos() {
    const tbody = document.querySelector('.admin-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    combosCache.forEach(combo => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${combo.name}</td>
            <td>${combo.items}</td>
            <td>₹${combo.price}</td>
            <td>
                <label style="cursor:pointer;">
                    <input type="checkbox" class="toggle-combo-active" data-id="${combo.id}" ${combo.active ? 'checked' : ''}> Active
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

function attachCoreEvents() {
    const addBtn = document.getElementById('add-combo-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const name = prompt("Enter Combo Name:");
            if (!name) return;
            const items = prompt("Enter Items Included (e.g. Aloo Paratha + Chai):");
            const price = prompt("Enter Price (₹):", "199");

            const id = 'c' + Date.now();
            combosCache.push({ id, name, items, price: parseInt(price), active: true });
            renderCombos();
        });
    }
}

function attachDynamicEvents() {
    document.querySelectorAll('.toggle-combo-active').forEach(cb => {
        cb.addEventListener('change', async (e) => {
            const id = e.target.getAttribute('data-id');
            const active = e.target.checked;
            e.target.disabled = true;
            await AdminAPI.toggleCombo(id, active);

            const combo = combosCache.find(c => c.id === id);
            if (combo) combo.active = active;
            renderCombos();
        });
    });

    document.querySelectorAll('.delete-combo-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.closest('button').getAttribute('data-id');
            const combo = combosCache.find(c => c.id === id);
            if (confirm('Delete Combo: ' + combo?.name + '?')) {
                await AdminAPI.deleteCombo(id);
                combosCache = combosCache.filter(c => c.id !== id);
                renderCombos();
            }
        });
    });

    document.querySelectorAll('.edit-combo-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.closest('button').getAttribute('data-id');
            const combo = combosCache.find(c => c.id === id);
            if (combo) {
                const newPrice = prompt(`Edit price for ${combo.name} (current: ${combo.price})`, combo.price);
                if (newPrice && !isNaN(parseInt(newPrice))) {
                    combo.price = parseInt(newPrice);
                    renderCombos();
                }
            }
        });
    });
}
