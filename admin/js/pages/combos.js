/**
 * Admin Combo Management - Backend API Integration
 * Uses backend API instead of localStorage
 */

let combosCache = [];
let menuItemsCache = [];

// Initialize after admin layout is injected
if (document.querySelector('.admin-workspace')) {
    init();
} else {
    document.addEventListener('adminLayoutReady', init);
}

async function init() {
    console.log("🚀 Admin Combos UI Initializing...");
    
    try {
        await loadData();
        attachGlobalEvents();
        console.log("✅ Admin Combos initialization complete");
    } catch (error) {
        console.error("❌ Error initializing combos:", error);
    }
}

async function loadData() {
    try {
        console.log("📋 Loading combos and menu items from backend MongoDB...");
        
        // Load combos from backend MongoDB (now synced with frontend)
        const combosResponse = await fetch('http://localhost:5000/api/combos-test');
        if (combosResponse.ok) {
            combosCache = await combosResponse.json();
            console.log("✅ Combos loaded from MongoDB:", combosCache.length);
        } else {
            console.error("❌ Failed to load combos from MongoDB");
            combosCache = [];
        }
        
        // Load menu items from frontend menuStorage (same as user frontend)
        if (window.menuStorage) {
            // Trigger seeding if needed
            window.menuStorage.seedData();
            menuItemsCache = window.menuStorage.getMenuItems();
            console.log("✅ Menu items loaded from frontend storage:", menuItemsCache.length);
        } else {
            console.error("❌ menuStorage not available, falling back to backend");
            // Fallback to backend
            const menuResponse = await fetch('http://localhost:5000/api/menu');
            if (menuResponse.ok) {
                menuItemsCache = await menuResponse.json();
                console.log("✅ Menu items loaded from backend:", menuItemsCache.length);
            } else {
                console.error("❌ Failed to load menu items");
                menuItemsCache = [];
            }
        }
        
        renderCombos();
        populateMenuItemsSelection();
        
    } catch (error) {
        console.error("❌ Error loading data:", error);
        combosCache = [];
        menuItemsCache = [];
        renderCombos();
    }
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
        
        // Handle both frontend and backend combo structures
        let itemsList, originalPrice, comboId;
        
        if (combo.items && Array.isArray(combo.items)) {
            // Frontend structure - items have name and price
            itemsList = combo.items.map(item => item.name).join(', ');
            originalPrice = combo.originalPrice || calculateOriginalPrice(combo);
        } else {
            // Backend structure - items might be different
            itemsList = combo.items ? combo.items.map(i => i.name).join(', ') : 'No items';
            originalPrice = calculateOriginalPrice(combo);
        }
        
        comboId = combo.id || combo._id;
        const comboPrice = combo.comboPrice || combo.price || 0;
        const isActive = combo.active !== false; // Default to true

        tr.innerHTML = `
            <td style="font-weight:600;">${combo.name}</td>
            <td style="font-size:0.9rem; color:#666; max-width: 300px;">${itemsList}</td>
            <td>₹${originalPrice}</td>
            <td style="color:#059669; font-weight:700;">₹${comboPrice}</td>
            <td>
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                    <input type="checkbox" class="toggle-status" data-id="${comboId}" ${isActive ? 'checked' : ''}>
                    <span style="font-size:0.85rem; color:${isActive ? '#059669' : '#dc2626'}">${isActive ? 'Active' : 'Inactive'}</span>
                </label>
            </td>
            <td>
                <button class="combo-action-btn edit edit-combo-btn" data-id="${comboId}" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="combo-action-btn delete delete-combo-btn" data-id="${comboId}" data-name="${combo.name}" title="Delete"><i class="fas fa-trash"></i></button>
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
            <input type="checkbox" name="combo-item" value="${item.id || item._id}" data-name="${item.name}" data-price="${item.price}">
            <span>${item.name} (${item.category}) - ₹${item.price}</span>
        </label>
    `).join('');

    // Attach listener for price calculation
    const checkboxes = container.querySelectorAll('input[name="combo-item"]');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', calculateOriginalPrice);
    });
}

function calculateOriginalPrice(combo = null) {
    if (combo) {
        console.log('🧮 Calculating original price for combo:', combo.name);
        console.log('📋 Combo items:', combo.items);
        console.log('📋 Menu items cache length:', menuItemsCache.length);
        
        // Calculate from combo items - handle both populated and non-populated data
        const total = combo.items.reduce((total, item) => {
            let itemPrice = 0;
            
            // If menuItemId is populated (has price property), use it directly
            if (item.menuItemId && typeof item.menuItemId === 'object' && item.menuItemId.price) {
                itemPrice = item.menuItemId.price * (item.quantity || 1);
                console.log(`💰 Using populated price for ${item.name}: ₹${item.menuItemId.price} x ${item.quantity || 1} = ₹${itemPrice}`);
            }
            // If item has price directly (frontend compatibility)
            else if (item.price) {
                itemPrice = item.price * (item.quantity || 1);
                console.log(`💰 Using item price for ${item.name}: ₹${item.price} x ${item.quantity || 1} = ₹${itemPrice}`);
            }
            // If menuItemId is just an ID string, find it in menuItemsCache
            else if (item.menuItemId && typeof item.menuItemId === 'string') {
                const menuItem = menuItemsCache.find(mi => (mi.id || mi._id) === item.menuItemId);
                itemPrice = menuItem ? menuItem.price * (item.quantity || 1) : 0;
                console.log(`💰 Using cached price for ${item.name}: ₹${menuItem?.price || 0} x ${item.quantity || 1} = ₹${itemPrice}`);
            }
            // Fallback: try to find by name
            else if (item.name) {
                const menuItem = menuItemsCache.find(mi => mi.name === item.name);
                itemPrice = menuItem ? menuItem.price * (item.quantity || 1) : 0;
                console.log(`💰 Using fallback price for ${item.name}: ₹${menuItem?.price || 0} x ${item.quantity || 1} = ₹${itemPrice}`);
            }
            
            return total + itemPrice;
        }, 0);
        
        console.log(`🧮 Final calculated original price for ${combo.name}: ₹${total}`);
        return total;
    } else {
        // Calculate from selected checkboxes
        const selected = document.querySelectorAll('input[name="combo-item"]:checked');
        let total = 0;
        selected.forEach(cb => {
            const price = parseFloat(cb.getAttribute('data-price'));
            total += price;
        });
        document.getElementById('original-total').textContent = `₹${total}`;
        return total;
    }
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
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('edit-id').value;

            // Get selected items with proper structure for backend
            const selectedItems = [];
            document.querySelectorAll('input[name="combo-item"]:checked').forEach(cb => {
                const item = menuItemsCache.find(mi => (mi.id || mi._id) === cb.value);
                if (item) {
                    selectedItems.push({
                        menuItemId: item._id || item.id, // Use MongoDB _id if available, otherwise use frontend id
                        name: item.name,
                        quantity: 1,
                        price: item.price // Include price for frontend compatibility
                    });
                }
            });

            if (selectedItems.length === 0) {
                alert("Please select at least one item for the combo.");
                return;
            }

            const comboData = {
                name: document.getElementById('combo-name').value,
                items: selectedItems,
                comboPrice: parseFloat(document.getElementById('combo-price').value),
                active: true
            };

            // Add image if provided
            const imageValue = document.getElementById('combo-image').value;
            if (imageValue) {
                comboData.image = imageValue;
            }

            try {
                let response;
                if (id) {
                    // Update existing combo - use backend MongoDB
                    response = await fetch(`http://localhost:5000/api/combos-test/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(comboData)
                    });
                } else {
                    // Create new combo - use backend MongoDB
                    response = await fetch('http://localhost:5000/api/combos-test', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(comboData)
                    });
                }

                if (response && response.ok) {
                    console.log('✅ Combo saved to MongoDB');
                    modal.style.display = 'none';
                    await loadData();
                } else if (response) {
                    const errorText = await response.text();
                    console.error('❌ Failed to save combo:', errorText);
                    alert('Failed to save combo: ' + errorText);
                }
            } catch (error) {
                console.error('❌ Error saving combo:', error);
                alert('Error saving combo: ' + error.message);
            }
        });
    }
}

function attachDynamicEvents() {
    // Toggle Status
    document.querySelectorAll('.toggle-status').forEach(cb => {
        cb.addEventListener('change', async (e) => {
            const id = e.target.getAttribute('data-id');
            const newStatus = e.target.checked;
            
            try {
                // Use backend MongoDB
                const response = await fetch(`http://localhost:5000/api/combos-test/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ active: newStatus })
                });

                if (response.ok) {
                    console.log('✅ Combo status updated in MongoDB');
                    await loadData();
                } else {
                    console.error('❌ Failed to update status');
                    e.target.checked = !newStatus; // Revert
                }
            } catch (error) {
                console.error('❌ Error updating status:', error);
                e.target.checked = !newStatus; // Revert
            }
        });
    });

    // Delete Combo
    document.querySelectorAll('.delete-combo-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            const name = e.target.getAttribute('data-name');

            if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

            try {
                // Use backend MongoDB
                const response = await fetch(`http://localhost:5000/api/combos-test/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    console.log('✅ Combo deleted from MongoDB');
                    await loadData();
                } else {
                    console.error('❌ Failed to delete combo');
                    alert('Failed to delete combo');
                }
            } catch (error) {
                console.error('❌ Error deleting combo:', error);
                alert('Error deleting combo: ' + error.message);
            }
        });
    });

    // Edit Combo
    document.querySelectorAll('.edit-combo-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const combo = combosCache.find(c => (c.id || c._id) === id);
            if (combo) {
                document.getElementById('modal-title').textContent = "Edit Combo Package";
                document.getElementById('edit-id').value = combo.id || combo._id;
                document.getElementById('combo-name').value = combo.name;
                document.getElementById('combo-image').value = combo.image || "";
                document.getElementById('combo-price').value = combo.comboPrice || combo.price || 0;

                // Reset and check specific items
                const checkboxes = document.querySelectorAll('input[name="combo-item"]');
                checkboxes.forEach(cb => {
                    const itemName = cb.getAttribute('data-name');
                    // Check by name since frontend items may not have the same IDs
                    cb.checked = combo.items.some(i => i.name === itemName);
                });

                calculateOriginalPrice();
                document.getElementById('combo-modal').style.display = 'flex';
            }
        });
    });
}
