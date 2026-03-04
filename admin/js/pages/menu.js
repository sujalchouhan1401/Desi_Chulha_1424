/**
 * Admin Menu Management - Logic
 * Uses menuStorage.js to manage localStorage data
 */

let menuCache = [];
let adminSearch = '';
let adminCategoryFilter = 'all';

// Initialize after admin layout is injected
if (document.querySelector('.admin-workspace')) {
    init();
} else {
    document.addEventListener('adminLayoutReady', init);
}

// Storage sync for cross-tab updates
window.addEventListener('storage', (e) => {
    if (e.key === 'menuItems') {
        loadMenu();
    }
});

async function init() {
    console.log("Admin Menu UI Initializing...");

    if (!window.menuStorage) {
        console.error("menuStorage utility NOT found on window.");
        return;
    }

    // Generic seed check
    window.menuStorage.seedData();

    loadMenu();
    attachGlobalEvents();
    setupAdminFilters();

    // Safety: Add Reset Button if it doesn't exist
    const headerActions = document.querySelector('.flex-between');
    if (headerActions && !document.getElementById('reset-menu-btn')) {
        const resetBtn = document.createElement('button');
        resetBtn.id = 'reset-menu-btn';
        resetBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Reset';
        resetBtn.className = 'admin-btn';
        resetBtn.style.background = '#fef2f2';
        resetBtn.style.color = '#dc2626';
        resetBtn.style.borderColor = '#fecaca';
        resetBtn.style.marginRight = '10px';
        resetBtn.onclick = () => {
            if (confirm("Reset menu to original 12 dishes? This will delete your changes.")) {
                window.menuStorage.resetToDefault();
            }
        };
        const addBtn = document.getElementById('add-menu-btn');
        if (addBtn) addBtn.parentNode.insertBefore(resetBtn, addBtn);
    }
}

function loadMenu() {
    if (!window.menuStorage) {
        console.error("menuStorage utility not found");
        return;
    }
    menuCache = window.menuStorage.getMenuItems();
    renderMenu();
}

function renderMenu() {
    const tbody = document.getElementById('menu-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    // Apply Filters
    let filteredItems = menuCache.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(adminSearch.toLowerCase());
        const matchesCategory = adminCategoryFilter === 'all' ||
            item.category.toLowerCase().trim() === adminCategoryFilter.toLowerCase().trim();
        return matchesSearch && matchesCategory;
    });

    if (filteredItems.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:40px; color:#666;">
            ${menuCache.length === 0 ? 'No menu items found. Add your first dish!' : 'No dishes match your search/filter.'}
        </td></tr>`;
        return;
    }

    filteredItems.forEach(item => {
        const tr = document.createElement('tr');
        const imgHtml = item.image
            ? `<img src="${item.image}" alt="${item.name}" style="width:50px; height:50px; border-radius:8px; object-fit:cover;">`
            : `<div style="width:50px; height:50px; border-radius:8px; background:#f0f0f0; display:flex; align-items:center; justify-content:center; font-size:1.2rem;">🥘</div>`;

        tr.innerHTML = `
            <td>${imgHtml}</td>
            <td style="font-weight:600;">${item.name}</td>
            <td><span style="background:#f3f4f6; padding:4px 8px; border-radius:4px; font-size:0.85rem;">${item.category}</span></td>
            <td>₹${item.price}</td>
            <td>
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                    <input type="checkbox" class="toggle-availability" data-id="${item.id}" ${item.available ? 'checked' : ''}>
                    <span style="font-size:0.85rem; color:${item.available ? '#059669' : '#dc2626'}">${item.available ? 'In Stock' : 'Out of Stock'}</span>
                </label>
            </td>
            <td>
                <span class="toggle-bestseller" data-id="${item.id}" style="color:${item.bestseller ? '#f59e0b' : '#ccc'}; font-size:1.1rem; cursor:pointer;" title="Click to Toggle Bestseller">
                    ${item.bestseller ? '⭐' : '☆'}
                </span>
            </td>
            <td>
                <button class="menu-action-btn edit edit-item-btn" data-id="${item.id}" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="menu-action-btn delete delete-item-btn" data-id="${item.id}" title="Delete"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    attachDynamicEvents();
}

function attachGlobalEvents() {
    const modal = document.getElementById('menu-modal');
    const addBtn = document.getElementById('add-menu-btn');
    const closeBtn = document.getElementById('modal-close-btn');
    const form = document.getElementById('menu-form');

    // Open Modal for Add
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            document.getElementById('modal-title').textContent = "Add Menu Item";
            document.getElementById('edit-id').value = "";
            form.reset();
            modal.style.display = 'flex';
        });
    }

    // Close Modal
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Modal background click to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // Handle Form Submit
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('edit-id').value;
            const itemData = {
                name: document.getElementById('menu-name').value,
                category: document.getElementById('menu-category').value,
                price: parseFloat(document.getElementById('menu-price').value),
                image: document.getElementById('menu-image').value,
                bestseller: document.getElementById('menu-bestseller').checked
            };

            if (id) {
                // Update
                window.menuStorage.updateMenuItem(id, itemData);
            } else {
                // Add
                window.menuStorage.addMenuItem(itemData);
            }

            modal.style.display = 'none';
            loadMenu(); // Refresh UI
        });
    }
}

function setupAdminFilters() {
    const searchInput = document.getElementById('admin-search');
    const categoryFilter = document.getElementById('admin-category-filter');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            adminSearch = e.target.value.trim();
            renderMenu();
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            adminCategoryFilter = e.target.value;
            renderMenu();
        });
    }
}

function attachDynamicEvents() {
    // Availability Toggle
    document.querySelectorAll('.toggle-availability').forEach(cb => {
        cb.addEventListener('change', (e) => {
            const id = e.target.getAttribute('data-id');
            window.menuStorage.toggleAvailability(id);
            loadMenu(); // Re-render for status text color change
        });
    });

    // Bestseller Toggle
    document.querySelectorAll('.toggle-bestseller').forEach(star => {
        star.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            window.menuStorage.toggleBestseller(id);
            loadMenu();
        });
    });

    // Delete Item
    document.querySelectorAll('.delete-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('button').getAttribute('data-id');
            const item = menuCache.find(i => i.id === id);
            if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
                window.menuStorage.deleteMenuItem(id);
                loadMenu();
            }
        });
    });

    // Edit Item (Populate Modal)
    document.querySelectorAll('.edit-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('button').getAttribute('data-id');
            const item = menuCache.find(i => i.id === id);
            if (item) {
                document.getElementById('modal-title').textContent = "Edit Menu Item";
                document.getElementById('edit-id').value = item.id;
                document.getElementById('menu-name').value = item.name;
                document.getElementById('menu-category').value = item.category;
                document.getElementById('menu-price').value = item.price;
                document.getElementById('menu-image').value = item.image || "";
                document.getElementById('menu-bestseller').checked = item.bestseller;

                document.getElementById('menu-modal').style.display = 'flex';
            }
        });
    });
}
