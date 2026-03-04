import { AdminAPI } from '../api.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const stats = await AdminAPI.getDashboardStats();

        // Update DOM
        const statCards = document.querySelectorAll('.stat-info h3');
        if (statCards.length >= 4) {
            statCards[0].textContent = stats.totalOrders;
            statCards[1].textContent = stats.pendingOrders;
            statCards[2].textContent = '₹' + stats.totalSales.toLocaleString();
            statCards[3].textContent = stats.revenueSummary;
        }

        // Fetch Recent Orders dynamically
        const orders = await AdminAPI.getOrders();
        const tbody = document.querySelector('.admin-table tbody');
        if (tbody) {
            tbody.innerHTML = ''; // Clear static rows
            orders.slice(0, 5).forEach(order => { // Show max 5 recent
                const tr = document.createElement('tr');
                const badgeClass = order.status === 'completed' ? 'status-completed' : 'status-pending';
                tr.innerHTML = `
                    <td>${order.id}</td>
                    <td>${order.customer}</td>
                    <td>₹${order.amount}</td>
                    <td><span class="status-badge ${badgeClass}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                    <td><button class="admin-btn" style="padding:5px 10px; font-size:0.8rem;">View</button></td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (e) {
        console.error("Dashboard Load Error: ", e);
    }
});
