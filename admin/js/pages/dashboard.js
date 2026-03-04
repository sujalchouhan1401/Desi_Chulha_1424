/**
 * Admin Dashboard - Dynamic Stat Calculation
 * Reads from localStorage.desi_orders via orderStorage.js
 */

// Main initialization function
function init() {
    updateDashboardStats();

    // Attach "View All" button listener once DOM/layout is ready
    const viewAllBtn = document.querySelector('.admin-btn');
    if (viewAllBtn && viewAllBtn.textContent === 'View All') {
        viewAllBtn.onclick = () => {
            window.location.href = 'orders.html';
        };
    }
}

// Ensure the admin layout is fully injected before we try to modify the DOM
if (document.querySelector('.admin-workspace')) {
    init(); // Already ready
} else {
    document.addEventListener('adminLayoutReady', init);
}

// Centralized event listener for data updates
window.addEventListener('storage', (e) => {
    if (e.key === 'orders' || e.key === 'menuItems' || e.key === 'combos') {
        updateDashboardStats();
    }
});

function updateDashboardStats() {
    if (!window.dashboardStats) {
        console.error('dashboardStats utility not found');
        return;
    }

    const stats = window.dashboardStats;

    // 1. Update Core Stats
    document.getElementById('stat-total-orders').textContent = stats.getTotalOrders();
    document.getElementById('stat-pending-orders').textContent = stats.getPendingOrders();
    document.getElementById('stat-total-sales').textContent = '₹' + stats.getTotalSales().toLocaleString();
    document.getElementById('stat-completed-orders').textContent = stats.getCompletedOrders();
    document.getElementById('stat-menu-items').textContent = stats.getMenuItemCount();
    document.getElementById('stat-active-combos').textContent = stats.getActiveCombosCount();

    // 2. Update Revenue Summary
    document.getElementById('stat-today-sales').textContent = '₹' + stats.getTodaySales().toLocaleString();
    document.getElementById('stat-avg-value').textContent = '₹' + stats.getAverageOrderValue().toLocaleString();

    // 3. Render Recent Orders (Last 5)
    renderRecentOrders(stats.getRecentOrders(5));
}

function renderRecentOrders(recentOrders) {
    const tbody = document.querySelector('.admin-table tbody');
    if (!tbody) return;

    if (recentOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px; color:#666;">No orders found.</td></tr>';
        return;
    }

    let html = '';
    recentOrders.forEach(order => {
        const amount = (order.totalAmount || 0).toLocaleString();
        const status = order.status || 'Pending';
        const statusClass = `status-${status.toLowerCase()}`;
        const shortId = order.id.includes('-') ? order.id.split('-').pop() : order.id.slice(-6);

        html += `
            <tr>
                <td style="font-family: monospace; font-weight: 600;">#${shortId}</td>
                <td>${order.customerName || 'Guest'}</td>
                <td>₹${amount}</td>
                <td><span class="status-badge ${statusClass}">${status}</span></td>
                <td><button class="admin-btn" style="padding:5px 10px; font-size:0.8rem;" onclick="window.location.href='orders.html?id=${order.id}'">Update</button></td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}
