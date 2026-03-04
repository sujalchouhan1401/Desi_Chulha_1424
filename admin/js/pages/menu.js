import { AdminAPI } from '../api.js';

let menuCache = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadMenu();
        attachCoreEvents();
    } catch (e) {
        console.error("Error loading menu", e);
    }
});

async function loadMenu() {
    menuCache = await AdminAPI.getMenu();
    renderMenu();
}

function renderMenu() {
    const tbody = document.querySelector('.admin-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    menuCache.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>₹${item.price}</td>
            <td>
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                    <input type="checkbox" class="toggle-stock" data-id="${item.id}" ${item.inStock ? 'checked' : ''}>
                    ${item.inStock ? 'In Stock' : 'Out of Stock'}
                </label>
            </td>
            <td>
                <label style="cursor:pointer;"><input type="checkbox" class="toggle-bestseller" data-id="${item.id}" ${item.bestseller ? 'checked' : ''}> Yes</label>
            </td>
            <td>
                <button class="menu-action-btn edit edit-item-btn" data-id="${item.id}" title="Edit Price/Details"><i class="fas fa-edit"></i></button>
                <button class="menu-action-btn delete delete-item-btn" data-id="${item.id}" title="Delete Item"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    attachDynamicEvents();
}

function attachCoreEvents() {
    const addBtn = document.getElementById('add-menu-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            // Mock showing modal for adding item
            const name = prompt("Enter new Item Name:");
            if (!name) return;
            const price = prompt("Enter Price (₹):", "150");

            AdminAPI.addMenuItem({
                name: name,
                category: "Main Course",
                price: parseInt(price) || 0,
                inStock: true,
                bestseller: false
            }).then(newItem => {
                menuCache.push(newItem);
                renderMenu();
            });
        });
    }
}

function attachDynamicEvents() {
    // Stock toggle
    document.querySelectorAll('.toggle-stock').forEach(cb => {
        cb.addEventListener('change', async (e) => {
            const id = e.target.getAttribute('data-id');
            const inStock = e.target.checked;
            e.target.disabled = true;
            await AdminAPI.updateMenuItem(id, { inStock });

            const item = menuCache.find(m => m.id === id);
            if (item) item.inStock = inStock;
            renderMenu(); // instantly re-render row visually clean
        });
    });

    // Bestseller toggle
    document.querySelectorAll('.toggle-bestseller').forEach(cb => {
        cb.addEventListener('change', async (e) => {
            const id = e.target.getAttribute('data-id');
            const bestseller = e.target.checked;
            e.target.disabled = true;
            await AdminAPI.updateMenuItem(id, { bestseller });

            const item = menuCache.find(m => m.id === id);
            if (item) item.bestseller = bestseller;
            renderMenu();
        });
    });

    // Edit Item
    document.querySelectorAll('.edit-item-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.closest('button').getAttribute('data-id');
            const item = menuCache.find(m => m.id === id);
            if (item) {
                const newPrice = prompt(`Edit price for ${item.name} (current: ${item.price})`, item.price);
                if (newPrice && !isNaN(parseInt(newPrice))) {
                    await AdminAPI.updateMenuItem(id, { price: parseInt(newPrice) });
                    item.price = parseInt(newPrice);
                    renderMenu();
                }
            }
        });
    });

    // Delete Item
    document.querySelectorAll('.delete-item-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.closest('button').getAttribute('data-id');
            const item = menuCache.find(m => m.id === id);
            if (confirm('Are you sure you want to delete ' + item?.name + '?')) {
                await AdminAPI.deleteMenuItem(id);
                menuCache = menuCache.filter(m => m.id !== id);
                renderMenu();
            }
        });
    });
}
