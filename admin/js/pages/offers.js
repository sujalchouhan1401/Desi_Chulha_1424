/**
 * Admin Offer & Discount Management - MongoDB Backend Integration
 */

let offersCache = [];

// Initialize after admin layout is injected
if (document.querySelector('.admin-workspace')) {
    init();
} else {
    document.addEventListener('adminLayoutReady', init);
}

async function init() {
    console.log("🚀 Admin Offers UI Initializing...");
    
    try {
        await loadData();
        attachGlobalEvents();
        console.log("✅ Admin Offers initialization complete");
    } catch (error) {
        console.error("❌ Error initializing offers:", error);
    }
}

async function loadData() {
    try {
        console.log("📋 Loading offers from MongoDB backend...");
        
        const response = await fetch('http://localhost:5000/api/offers');
        if (response.ok) {
            offersCache = await response.json();
            console.log("✅ Offers loaded from MongoDB:", offersCache.length);
        } else {
            console.error("❌ Failed to load offers from MongoDB");
            offersCache = [];
        }
        
        renderOffers();
    } catch (error) {
        console.error("❌ Error loading offers:", error);
        offersCache = [];
        renderOffers();
    }
}

function renderOffers() {
    const tbody = document.querySelector('.admin-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (offersCache.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:40px; color:#666;">No offers found. Create your first discount!</td></tr>';
        return;
    }

    offersCache.forEach(offer => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong style="color:#4f46e5">${offer.code}</strong></td>
            <td>${offer.discount}</td>
            <td>${offer.expiry}</td>
            <td>
                <label style="cursor:pointer; display:flex; align-items:center; gap:8px;">
                    <input type="checkbox" class="toggle-offer-active" data-id="${offer._id || offer.id}" ${offer.active ? 'checked' : ''}> 
                    <span style="color:${offer.active ? '#059669' : '#dc2626'}">${offer.active ? 'Active' : 'Inactive'}</span>
                </label>
            </td>
            <td>
                <button class="offer-action-btn edit edit-offer-btn" data-id="${offer._id || offer.id}" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="offer-action-btn delete delete-offer-btn" data-id="${offer._id || offer.id}" title="Delete"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    attachDynamicEvents();
}

function attachGlobalEvents() {
    const addBtn = document.getElementById('add-offer-btn');
    if (addBtn) {
        addBtn.onclick = async () => {
            const code = prompt("Enter Discount Code (e.g., WINTER50):");
            if (!code) return;
            const discount = prompt("Enter Discount Value (e.g. 50% OFF or Flat ₹50):");
            if (!discount) return;
            const expiry = prompt("Enter Expiry Date (YYYY-MM-DD):", new Date().toISOString().split('T')[0]);
            if (!expiry) return;

            try {
                const response = await fetch('http://localhost:5000/api/offers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        code: code.toUpperCase(),
                        discount,
                        expiry,
                        active: true
                    })
                });

                if (response.ok) {
                    console.log('✅ Offer created in MongoDB');
                    await loadData();
                } else {
                    console.error('❌ Failed to create offer');
                    alert('Failed to create offer');
                }
            } catch (error) {
                console.error('❌ Error creating offer:', error);
                alert('Error creating offer: ' + error.message);
            }
        };
    }
}

function attachDynamicEvents() {
    // Toggle Active
    document.querySelectorAll('.toggle-offer-active').forEach(cb => {
        cb.onchange = async (e) => {
            const id = e.target.getAttribute('data-id');
            const newStatus = e.target.checked;
            
            try {
                const response = await fetch(`http://localhost:5000/api/offers/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ active: newStatus })
                });

                if (response.ok) {
                    console.log('✅ Offer status updated in MongoDB');
                    await loadData();
                } else {
                    console.error('❌ Failed to update offer status');
                    e.target.checked = !newStatus; // Revert
                }
            } catch (error) {
                console.error('❌ Error updating offer status:', error);
                e.target.checked = !newStatus; // Revert
            }
        };
    });

    // Delete Offer
    document.querySelectorAll('.delete-offer-btn').forEach(btn => {
        btn.onclick = async (e) => {
            const id = e.target.closest('button').getAttribute('data-id');
            const offer = offersCache.find(o => (o._id || o.id) === id);
            if (confirm(`Are you sure you want to delete ${offer?.code}?`)) {
                try {
                    const response = await fetch(`http://localhost:5000/api/offers/${id}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        console.log('✅ Offer deleted from MongoDB');
                        await loadData();
                    } else {
                        console.error('❌ Failed to delete offer');
                        alert('Failed to delete offer');
                    }
                } catch (error) {
                    console.error('❌ Error deleting offer:', error);
                    alert('Error deleting offer: ' + error.message);
                }
            }
        };
    });

    // Edit Offer (Simple expiry change for now)
    document.querySelectorAll('.edit-offer-btn').forEach(btn => {
        btn.onclick = async (e) => {
            const id = e.target.closest('button').getAttribute('data-id');
            const offer = offersCache.find(o => (o._id || o.id) === id);
            if (offer) {
                const newCode = prompt(`Edit Code for ${offer.code}:`, offer.code);
                if (!newCode) return;
                const newDiscount = prompt(`Edit Discount for ${offer.code}:`, offer.discount);
                if (!newDiscount) return;
                const newExpiry = prompt(`Edit Expiry for ${offer.code}:`, offer.expiry);
                if (!newExpiry) return;

                try {
                    const response = await fetch(`http://localhost:5000/api/offers/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            code: newCode.toUpperCase(),
                            discount: newDiscount,
                            expiry: newExpiry
                        })
                    });

                    if (response.ok) {
                        console.log('✅ Offer updated in MongoDB');
                        await loadData();
                    } else {
                        console.error('❌ Failed to update offer');
                        alert('Failed to update offer');
                    }
                } catch (error) {
                    console.error('❌ Error updating offer:', error);
                    alert('Error updating offer: ' + error.message);
                }
            }
        };
    });
}
