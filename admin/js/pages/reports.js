/**
 * Admin Reports & Analytics - Logic
 */

let salesChart = null;
let statusChart = null;

// Initialize after admin layout is ready
if (document.querySelector('.admin-workspace')) {
    init();
} else {
    document.addEventListener('adminLayoutReady', init);
}

// Auto refresh on orders change
window.addEventListener('storage', (e) => {
    if (e.key === 'orders') {
        loadReportData();
    }
});

function init() {
    console.log("Admin Reports UI Initializing...");

    if (!window.reportStats) {
        console.error("Required storage utilities NOT found on window.");
        return;
    }

    loadReportData();
}

function loadReportData() {
    renderSummaryStats();
    renderSalesTrend();
    renderStatusBreakdown();
    renderTopSellingItems();
}

/**
 * Update the numeric summary cards
 */
function renderSummaryStats() {
    const stats = window.reportStats;
    const totalRev = stats.getTotalRevenue();
    const totalOrders = stats.getOrders().length;
    const aov = stats.getAverageOrderValue();

    document.getElementById('rep-total-revenue').textContent = `₹${totalRev.toLocaleString()}`;
    document.getElementById('rep-total-orders').textContent = totalOrders;
    document.getElementById('rep-aov').textContent = `₹${Math.round(aov).toLocaleString()}`;
}

/**
 * Render Weekly Sales Trend Chart (Bar)
 */
function renderSalesTrend() {
    const canvas = document.getElementById('salesTrendChart');
    if (!canvas) return;

    const salesData = window.reportStats.getDailySalesLast7Days();
    const labels = Object.keys(salesData).map(d => {
        // Parse the YYYY-MM-DD string back to date object for formatting
        const parts = d.split('-');
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    });
    const values = Object.values(salesData);

    if (salesChart) salesChart.destroy();

    salesChart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Daily Sales (₹)',
                data: values,
                backgroundColor: '#4f46e5',
                borderRadius: 4,
                hoverBackgroundColor: '#4338ca'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (context) => ` Sales: ₹${context.raw}`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#f1f5f9' },
                    ticks: {
                        display: true,
                        callback: (v) => '₹' + v
                    }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

/**
 * Render Order Status Breakdown (Doughnut)
 */
function renderStatusBreakdown() {
    const canvas = document.getElementById('statusDistributionChart');
    if (!canvas) return;

    const breakdown = window.reportStats.getOrderStatusBreakdown();
    const labels = Object.keys(breakdown);
    const values = Object.values(breakdown);
    const total = values.reduce((s, v) => s + v, 0);

    if (statusChart) statusChart.destroy();

    // If no data, show a placeholder
    if (total === 0) {
        statusChart = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: ['No Orders Yet'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['#e2e8f0'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: { enabled: false }
                },
                cutout: '65%'
            }
        });
        return;
    }

    statusChart = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    '#fbbf24', // Pending (yellow)
                    '#3b82f6', // Preparing (blue)
                    '#10b981', // Completed (green)
                    '#ef4444'  // Cancelled (red)
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (item) => ` ${item.label}: ${item.raw} orders`
                    }
                }
            },
            cutout: '65%'
        }
    });
}

/**
 * Render Top Items Table
 */
function renderTopSellingItems() {
    const tbody = document.getElementById('top-items-tbody');
    if (!tbody) return;

    const topItems = window.reportStats.getTopSellingItems();
    tbody.innerHTML = '';

    if (topItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:30px; color:#666;">No completed sales yet to analyze.</td></tr>';
        return;
    }

    topItems.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight:600;">${item.name}</td>
            <td>${item.count} orders</td>
            <td style="font-weight:700; color:#059669;">₹${item.revenue.toLocaleString()}</td>
            <td><span class="trend-up" style="background:#dcfce7; padding:4px 8px; border-radius:10px; font-size:0.75rem;">Premium Item</span></td>
        `;
        tbody.appendChild(tr);
    });
}
