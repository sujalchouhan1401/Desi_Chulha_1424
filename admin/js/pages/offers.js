import { AdminAPI } from '../api.js';

let offersCache = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadOffers();
        attachCoreEvents();
    } catch (e) {
        console.error("Error loading offers", e);
    }
});

async function loadOffers() {
    offersCache = await AdminAPI.getOffers();
    renderOffers();
}

function renderOffers() {
    const tbody = document.querySelector('.admin-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    offersCache.forEach(offer => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong style="color:#4f46e5">${offer.code}</strong></td>
            <td>${offer.discount}</td>
            <td>${offer.expiry}</td>
            <td>
                <label style="cursor:pointer;">
                    <input type="checkbox" class="toggle-offer-active" data-id="${offer.id}" ${offer.active ? 'checked' : ''}> Active
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

function attachCoreEvents() {
    const addBtn = document.getElementById('add-offer-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const code = prompt("Enter Discount Code (e.g., WINTER50):");
            if (!code) return;
            const discount = prompt("Enter Discount Value (e.g. 50% OFF or Flat ₹50):");
            const expiry = prompt("Enter Expiry Date (YYYY-MM-DD):", new Date().toISOString().split('T')[0]);

            const id = 'o' + Date.now();
            offersCache.push({ id, code: code.toUpperCase(), discount, expiry, active: true });
            renderOffers();
        });
    }
}

function attachDynamicEvents() {
    document.querySelectorAll('.toggle-offer-active').forEach(cb => {
        cb.addEventListener('change', async (e) => {
            const id = e.target.getAttribute('data-id');
            const active = e.target.checked;
            e.target.disabled = true;
            await AdminAPI.toggleOffer(id, active);

            const offer = offersCache.find(o => o.id === id);
            if (offer) offer.active = active;
            renderOffers();
        });
    });

    document.querySelectorAll('.delete-offer-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.closest('button').getAttribute('data-id');
            const offer = offersCache.find(o => o.id === id);
            if (confirm('Delete Offer: ' + offer?.code + '?')) {
                await AdminAPI.deleteOffer(id);
                offersCache = offersCache.filter(o => o.id !== id);
                renderOffers();
            }
        });
    });

    document.querySelectorAll('.edit-offer-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.closest('button').getAttribute('data-id');
            const offer = offersCache.find(o => o.id === id);
            if (offer) {
                const newExpiry = prompt(`Edit Expiry Date for ${offer.code} (current: ${offer.expiry})`, offer.expiry);
                if (newExpiry) {
                    offer.expiry = newExpiry;
                    renderOffers();
                }
            }
        });
    });
}
