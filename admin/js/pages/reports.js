/**
 * Admin Reports & Analytics - MongoDB Backend Integration
 */

let salesChart = null;
let statusChart = null;
let ordersCache = [];
let analyticsData = {};

// Initialize after admin layout is ready
if (document.querySelector('.admin-workspace')) {
    console.log("🚀 Admin workspace found, initializing reports...");
    init();
} else {
    console.log("⏳ Waiting for admin layout to be ready...");
    document.addEventListener('adminLayoutReady', init);
    
    // Fallback: try again after a short delay
    setTimeout(() => {
        if (document.querySelector('.admin-workspace')) {
            console.log("🔄 Fallback: Admin workspace found, initializing reports...");
            init();
        } else {
            console.log("❌ Admin workspace not found after timeout");
        }
    }, 1000);
}

function init() {
    console.log("🚀 Admin Reports UI Initializing...");
    
    try {
        loadReportData();
        console.log("✅ Admin Reports initialization complete");
    } catch (error) {
        console.error("❌ Error initializing reports:", error);
    }
}

async function loadReportData() {
    try {
        console.log("📊 Loading analytics data from MongoDB backend...");
        
        // Load orders data
        console.log("📦 Fetching orders from /api/orders-test...");
        const ordersResponse = await fetch('http://localhost:5000/api/orders-test');
        if (ordersResponse.ok) {
            ordersCache = await ordersResponse.json();
            console.log("✅ Orders loaded for reports:", ordersCache.length);
            console.log("📋 Sample order:", ordersCache[0] ? {
                id: ordersCache[0]._id || ordersCache[0].id,
                total: ordersCache[0].totalAmount,
                status: ordersResponse[0]?.status
            } : 'No orders');
        } else {
            console.error("❌ Failed to load orders for reports, status:", ordersResponse.status);
            ordersCache = [];
        }
        
        // Load analytics data
        console.log("📈 Fetching analytics from /api/analytics...");
        const analyticsResponse = await fetch('http://localhost:5000/api/analytics');
        if (analyticsResponse.ok) {
            analyticsData = await analyticsResponse.json();
            console.log("✅ Analytics data loaded from MongoDB");
            console.log("📊 Analytics keys:", Object.keys(analyticsData));
        } else {
            console.error("❌ Failed to load analytics data, status:", analyticsResponse.status);
            analyticsData = {};
        }
        
        console.log("🔄 Rendering report components...");
        renderSummaryStats();
        renderSalesTrend();
        renderStatusBreakdown();
        renderTopSellingItems();
        console.log("✅ All report components rendered");
        
    } catch (error) {
        console.error("❌ Error loading report data:", error);
        console.error("📍 Stack trace:", error.stack);
        ordersCache = [];
        analyticsData = {};
        renderSummaryStats();
        renderSalesTrend();
        renderStatusBreakdown();
        renderTopSellingItems();
    }
}

/**
 * Update the numeric summary cards
 */
function renderSummaryStats() {
    console.log("📊 Rendering summary stats...");
    
    // Calculate stats from MongoDB data
    const totalRev = ordersCache.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const totalOrders = ordersCache.length;
    const aov = totalOrders > 0 ? totalRev / totalOrders : 0;

    console.log("💰 Calculated stats:", {
        totalRevenue: totalRev,
        totalOrders: totalOrders,
        avgOrderValue: aov
    });

    // Check if elements exist
    const revenueEl = document.getElementById('rep-total-revenue');
    const ordersEl = document.getElementById('rep-total-orders');
    const aovEl = document.getElementById('rep-avg-order-value');

    console.log("🔍 Element check:", {
        revenueEl: !!revenueEl,
        ordersEl: !!ordersEl,
        aovEl: !!aovEl
    });

    if (revenueEl) {
        revenueEl.textContent = `₹${totalRev.toLocaleString()}`;
        console.log("✅ Updated revenue element");
    } else {
        console.error("❌ Revenue element not found");
    }

    if (ordersEl) {
        ordersEl.textContent = totalOrders;
        console.log("✅ Updated orders element");
    } else {
        console.error("❌ Orders element not found");
    }

    if (aovEl) {
        aovEl.textContent = `₹${aov.toFixed(2)}`;
        console.log("✅ Updated AOV element");
    } else {
        console.error("❌ AOV element not found");
    }

    // Update growth status with real data
    const growthEl = document.querySelector('.trend-up');
    if (growthEl) {
        // Calculate growth based on completed orders vs total orders
        const completedOrders = ordersCache.filter(order => order.status === 'completed').length;
        const growthRate = totalOrders > 0 ? (completedOrders / totalOrders * 100) : 0;
        
        let growthIcon = '';
        let growthText = '';
        let growthColor = '';
        
        if (growthRate >= 80) {
            growthIcon = '🔥';
            growthText = `Excellent ${growthRate.toFixed(0)}%`;
            growthColor = '#dc2626';
        } else if (growthRate >= 60) {
            growthIcon = '⭐';
            growthText = `Good ${growthRate.toFixed(0)}%`;
            growthColor = '#059669';
        } else if (growthRate >= 40) {
            growthIcon = '📈';
            growthText = `${growthRate.toFixed(0)}%`;
            growthColor = '#3b82f6';
        } else {
            growthIcon = '📊';
            growthText = `${growthRate.toFixed(0)}%`;
            growthColor = '#6b7280';
        }
        
        growthEl.innerHTML = `<i class="fas fa-arrow-up"></i> ${growthText}`;
        growthEl.style.color = growthColor;
        console.log("✅ Updated growth status:", growthText);
    }
}

/**
 * Render Weekly Sales Trend Chart (Bar)
 */
function renderSalesTrend() {
    const canvas = document.getElementById('salesTrendChart');
    if (!canvas) return;

    // Use analytics data from MongoDB or calculate from orders
    const salesData = analyticsData.weeklySales || calculateWeeklySales();
    const ctx = canvas.getContext('2d');
    
    // Clear previous chart
    if (salesChart) {
        salesChart.destroy();
    }

    // Set canvas dimensions to prevent infinite resizing
    canvas.style.maxHeight = '300px';
    canvas.style.height = '300px';

    salesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: salesData.map(d => d.day),
            datasets: [{
                label: 'Sales (₹)',
                data: salesData.map(d => d.sales),
                backgroundColor: '#4f46e5',
                borderColor: '#4f46e5',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            resizeDelay: 0,
            events: ['click', 'mousemove'], // Remove resize event
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function calculateWeeklySales() {
    // Calculate weekly sales from orders data
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weekData = days.map((day, index) => {
        const dayDate = new Date(today);
        dayDate.setDate(today.getDate() - today.getDay() + index);
        
        const dayOrders = ordersCache.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate.toDateString() === dayDate.toDateString();
        });
        
        const daySales = dayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        
        return { day, sales: daySales };
    });
    
    return weekData;
}

    /**
 * Render Order Status Breakdown Chart (Doughnut)
 */
function renderStatusBreakdown() {
    const canvas = document.getElementById('statusChart');
    if (!canvas) return;

    // Calculate status breakdown from MongoDB orders
    const statusCounts = {};
    ordersCache.forEach(order => {
        const status = order.status || 'pending';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    const ctx = canvas.getContext('2d');
    
    if (statusChart) {
        statusChart.destroy();
    }

    // Set canvas dimensions to prevent infinite resizing
    canvas.style.maxHeight = '300px';
    canvas.style.height = '300px';

    const labels = Object.keys(statusCounts);
    const data = Object.values(statusCounts);
    const colors = {
        'pending': '#f59e0b',
        'confirmed': '#3b82f6', 
        'preparing': '#8b5cf6',
        'ready': '#06b6d4',
        'completed': '#10b981',
        'cancelled': '#ef4444'
    };

    statusChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.map(label => label.charAt(0).toUpperCase() + label.slice(1)),
            datasets: [{
                data: data,
                backgroundColor: labels.map(label => colors[label] || '#6b7280'),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            resizeDelay: 0,
            events: ['click', 'mousemove'], // Remove resize event
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        font: { size: 11 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.raw + ' orders';
                        }
                    }
                }
            }
        }
    });
}

/**
 * Render Top Selling Items Table
 */
function renderTopSellingItems() {
    const tbody = document.getElementById('top-items-tbody');
    if (!tbody) return;

    // Calculate top items from MongoDB orders
    const itemCounts = {};
    const itemRevenue = {};
    
    ordersCache.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
                const name = item.name || 'Unknown Item';
                const quantity = item.quantity || 1;
                const price = item.price || 0;
                
                itemCounts[name] = (itemCounts[name] || 0) + quantity;
                itemRevenue[name] = (itemRevenue[name] || 0) + (price * quantity);
            });
        }
    });

    // Sort by quantity and get top 5
    const topItems = Object.entries(itemCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);

    tbody.innerHTML = '';
    
    if (topItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px; color:#666;">No data available</td></tr>';
        return;
    }

    // Calculate total revenue for percentage calculations
    const totalRevenue = Object.values(itemRevenue).reduce((sum, rev) => sum + rev, 0);

    topItems.forEach(([name, quantity], index) => {
        const revenue = itemRevenue[name] || 0;
        const revenuePercentage = totalRevenue > 0 ? (revenue / totalRevenue * 100).toFixed(1) : 0;
        
        // Determine performance badge
        let performanceBadge = '';
        let performanceColor = '';
        
        if (quantity >= 10) {
            performanceBadge = '🔥 Hot';
            performanceColor = '#dc2626';
        } else if (quantity >= 5) {
            performanceBadge = '⭐ Popular';
            performanceColor = '#059669';
        } else if (quantity >= 2) {
            performanceBadge = '📈 Rising';
            performanceColor = '#3b82f6';
        } else {
            performanceBadge = '🆕 New';
            performanceColor = '#6b7280';
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${name}</strong></td>
            <td><span class="badge" style="background:#4f46e5; color:white;">${quantity} orders</span></td>
            <td style="font-weight:700; color:#059669;">₹${revenue.toLocaleString()} (${revenuePercentage}%)</td>
            <td><span class="trend-up" style="background:${performanceColor}20; color:${performanceColor}; padding:4px 8px; border-radius:10px; font-size:0.75rem; font-weight:600;">${performanceBadge}</span></td>
        `;
        tbody.appendChild(tr);
    });
}
