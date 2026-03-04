/**
 * Admin Offer & Discount Management - Logic
 */

let offersCache = [];

// Initialize after admin layout is injected
if (document.querySelector('.admin-workspace')) {
    init();
} else {
    document.addEventListener('adminLayoutReady', init);
}

function init() {
    console.log("Admin Offers UI Initializing...");

    if (!window.offerStorage) {
        console.error("Required storage utilities NOT found on window.");
        return;
    }

    loadData();
    attachGlobalEvents();
}

function loadData() {
    offersCache = window.offerStorage.getOffers();
    renderOffers();
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
                    <input type="checkbox" class="toggle-offer-active" data-id="${offer.id}" ${offer.active ? 'checked' : ''}> 
                    <span style="color:${offer.active ? '#059669' : '#dc2626'}">${offer.active ? 'Active' : 'Inactive'}</span>
                </label>
            </td>
            <td>
                <button class="offer-action-btn edit edit-offer-btn" data-id="${offer.id}" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="offer-action-btn delete delete-offer-btn" data-id="${offer.id}" title="Delete"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    attachDynamicEvents();
}

function attachGlobalEvents() {
    const addBtn = document.getElementById('add-offer-btn');
    if (addBtn) {
        addBtn.onclick = () => {
            const code = prompt("Enter Discount Code (e.g., WINTER50):");
            if (!code) return;
            const discount = prompt("Enter Discount Value (e.g. 50% OFF or Flat ₹50):");
            if (!discount) return;
            const expiry = prompt("Enter Expiry Date (YYYY-MM-DD):", new Date().toISOString().split('T')[0]);
            if (!expiry) return;

            window.offerStorage.addOffer({ code: code.toUpperCase(), discount, expiry });
            loadData();
        };
    }
}

function attachDynamicEvents() {
    // Toggle Active
    document.querySelectorAll('.toggle-offer-active').forEach(cb => {
        cb.onchange = (e) => {
            const id = e.target.getAttribute('data-id');
            window.offerStorage.toggleOfferStatus(id);
            loadData();
        };
    });

    // Delete Offer
    document.querySelectorAll('.delete-offer-btn').forEach(btn => {
        btn.onclick = (e) => {
            const id = e.target.closest('button').getAttribute('data-id');
            const offer = offersCache.find(o => o.id === id);
            if (confirm(`Are you sure you want to delete ${offer?.code}?`)) {
                window.offerStorage.deleteOffer(id);
                loadData();
            }
        };
    });

    // Edit Offer (Simple expiry change for now)
    document.querySelectorAll('.edit-offer-btn').forEach(btn => {
        btn.onclick = (e) => {
            const id = e.target.closest('button').getAttribute('data-id');
            const offer = offersCache.find(o => o.id === id);
            if (offer) {
                const newCode = prompt(`Edit Code for ${offer.code}:`, offer.code);
                if (!newCode) return;
                const newDiscount = prompt(`Edit Discount for ${offer.code}:`, offer.discount);
                if (!newDiscount) return;
                const newExpiry = prompt(`Edit Expiry Date for ${offer.code}:`, offer.expiry);
                if (!newExpiry) return;

                window.offerStorage.updateOffer(id, {
                    code: newCode.toUpperCase(),
                    discount: newDiscount,
                    expiry: newExpiry
                });
                loadData();
            }
        };
    });
}
