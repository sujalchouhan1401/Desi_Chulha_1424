// Removed AdminAPI import as we use orderStorage utility (via localStorage)
// import { AdminAPI } from '../api.js';

let ordersCache = [];

// Initialization function
async function init() {
    try {
        await loadOrders();
    } catch (e) {
        console.error("Error loading orders", e);
    }
}

// Ensure layout and workspace exist before rendering
if (document.querySelector('.admin-workspace')) {
    init();
} else {
    document.addEventListener('adminLayoutReady', init);
}

// Storage sync should work even if layout is loading
document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('storage', (e) => {
        if (e.key === 'orders') {
            loadOrders();
        }
    });
});

async function loadOrders() {
    if (!window.orderStorage) {
        console.error("orderStorage utility not found");
        return;
    }

    ordersCache = window.orderStorage.getOrders();
    renderOrders();
}

function renderOrders() {
    const tbody = document.querySelector('.admin-table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (ordersCache.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:40px; color:#666;">No orders placed yet.</td></tr>';
        return;
    }

    ordersCache.forEach(order => {
        const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleString('en-GB') : 'N/A';
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>#${order.id.split('-').pop()}</td>
            <td>${dateStr}</td>
            <td>${order.customerName || 'Guest'}</td>
            <td>₹${(order.totalAmount || 0).toLocaleString()}</td>
            <td>
                <select class="status-select" data-id="${order.id}" style="padding:5px; border-radius:4px; ${getStatusColor(order.status)}">
                    <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Preparing" ${order.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
                    <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td>
                <button class="admin-btn view-details-btn" data-id="${order.id}" style="padding:6px 12px; font-size: 0.85rem;">Details</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    attachEventListeners();
    checkUrlParams();
}

function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('id');
    if (orderId) {
        // Give a tiny delay for final DOM settling
        setTimeout(() => {
            const rows = document.querySelectorAll('.admin-table tbody tr');
            rows.forEach(row => {
                if (row.innerHTML.includes(orderId.split('-').pop())) {
                    row.style.backgroundColor = '#fffbeb';
                    row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => { row.style.backgroundColor = ''; }, 3000);
                }
            });
        }, 100);
    }
}

function getStatusColor(status) {
    switch (status) {
        case 'Completed': return "background:#d1fae5; color:#059669; border-color:#d1fae5;";
        case 'Pending': return "background:#fef3c7; color:#d97706; border-color:#fef3c7;";
        case 'Cancelled': return "background:#fee2e2; color:#dc2626; border-color:#fee2e2;";
        case 'Preparing': return "background:#e0e7ff; color:#4f46e5; border-color:#e0e7ff;";
        default: return "";
    }
}

function attachEventListeners() {
    // Status Change
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', async (e) => {
            const id = e.target.getAttribute('data-id');
            const newStatus = e.target.value;
            e.target.disabled = true; // prevent multiclick

            if (window.orderStorage) {
                const success = window.orderStorage.updateOrderStatus(id, newStatus);
                if (success) {
                    // Update cache local to this tab
                    const orderInCache = ordersCache.find(o => o.id === id);
                    if (orderInCache) orderInCache.status = newStatus;

                    // Refresh UI instantly
                    renderOrders();
                } else {
                    alert("Order update failed!");
                    e.target.disabled = false;
                }
            }
        });
    });

    // View Details Modal
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const order = ordersCache.find(o => o.id === id);
            if (order) {
                const itemsText = order.items.map(i => `${i.quantity}x ${i.name}`).join('\n');
                alert(`Order Full Details\n\nID: ${order.id}\nCustomer: ${order.customerName}\nPhone: ${order.customerPhone}\nType: ${order.orderType}\nAmount: ₹${order.totalAmount}\nStatus: ${order.status}\n\nItems:\n${itemsText}`);
            }
        });
    });
}
