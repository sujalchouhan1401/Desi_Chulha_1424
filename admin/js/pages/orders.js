import { AdminAPI } from '../api.js';

let ordersCache = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadOrders();
    } catch (e) {
        console.error("Error loading orders", e);
    }
});

async function loadOrders() {
    ordersCache = await AdminAPI.getOrders();
    renderOrders();
}

function renderOrders() {
    const tbody = document.querySelector('.admin-table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Add filtering logic easily later via array filter
    ordersCache.forEach(order => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${order.id}</td>
            <td>${order.date}</td>
            <td>${order.customer}</td>
            <td>₹${order.amount.toLocaleString()}</td>
            <td>
                <select class="status-select" data-id="${order.id}" style="padding:5px; border-radius:4px; ${getStatusColor(order.status)}">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td>
                <button class="admin-btn view-details-btn" data-id="${order.id}" style="padding:6px 12px; font-size: 0.85rem;">Details</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    attachEventListeners();
}

function getStatusColor(status) {
    if (status === 'completed') return "background:#d1fae5; color:#059669; border-color:#d1fae5;";
    if (status === 'pending') return "background:#fef3c7; color:#d97706; border-color:#fef3c7;";
    if (status === 'cancelled') return "background:#fee2e2; color:#dc2626; border-color:#fee2e2;";
    return "background:#e0e7ff; color:#4f46e5; border-color:#e0e7ff;"; // processing
}

function attachEventListeners() {
    // Status Change
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', async (e) => {
            const id = e.target.getAttribute('data-id');
            const newStatus = e.target.value;
            e.target.disabled = true; // prevent multiclick

            await AdminAPI.updateOrderStatus(id, newStatus);
            // Updating cache locally
            const order = ordersCache.find(o => o.id === id);
            if (order) order.status = newStatus;

            // Re-render
            renderOrders();
        });
    });

    // View Details Modal
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const order = ordersCache.find(o => o.id === id);
            if (order) {
                alert(`Order Details Modal (Mock)\n\nID: ${order.id}\nCustomer: ${order.customer}\nAmount: ₹${order.amount}\nStatus: ${order.status}`);
            }
        });
    });
}
