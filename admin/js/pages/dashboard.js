/**
 * Admin Dashboard - Real Data from Backend API
 * Fetches orders from backend API instead of localStorage
 */

// Main initialization function
async function init() {
    console.log('🚀 Admin dashboard initialization starting...');
    await updateDashboardStats();

    // Attach "View All" button listener once DOM/layout is ready
    const viewAllBtn = document.querySelector('.admin-btn');
    if (viewAllBtn && viewAllBtn.textContent === 'View All') {
        viewAllBtn.onclick = () => {
            window.location.href = 'orders.html';
        };
    }
    
    console.log('✅ Admin dashboard initialization complete');
}

// Ensure the admin layout is fully injected before we try to modify the DOM
if (document.querySelector('.admin-workspace')) {
    init(); // Already ready
} else {
    document.addEventListener('adminLayoutReady', init);
}

async function updateDashboardStats() {
    try {
        console.log('📊 Fetching dashboard data from backend...');
        
        // Fetch orders, menu items, and combos from backend
        const [ordersResponse, menuResponse, comboResponse] = await Promise.all([
            fetch('http://localhost:5000/api/orders-test'),
            fetch('http://localhost:5000/api/menu'),
            fetch('http://localhost:5000/api/combos')
        ]);
        
        if (!ordersResponse.ok) {
            throw new Error(`Orders HTTP ${ordersResponse.status}: ${ordersResponse.statusText}`);
        }
        
        const orders = await ordersResponse.json();
        console.log('✅ Orders loaded for dashboard:', orders.length);
        
        // Get menu items count
        let menuItemsCount = 0;
        if (menuResponse.ok) {
            const menuItems = await menuResponse.json();
            menuItemsCount = Array.isArray(menuItems) ? menuItems.length : 0;
            console.log('✅ Menu items loaded:', menuItemsCount);
            
            // If no menu items, try to count from recent orders
            if (menuItemsCount === 0) {
                const uniqueItems = new Set();
                orders.forEach(order => {
                    order.items.forEach(item => {
                        uniqueItems.add(item.name);
                    });
                });
                menuItemsCount = uniqueItems.size;
                console.log('📊 Calculated unique menu items from orders:', menuItemsCount);
            }
        } else {
            console.log('⚠️ Menu endpoint not available, calculating from orders');
            // Calculate unique items from orders as fallback
            const uniqueItems = new Set();
            orders.forEach(order => {
                order.items.forEach(item => {
                    uniqueItems.add(item.name);
                });
            });
            menuItemsCount = uniqueItems.size;
        }
        
        // Get combos count
        let combosCount = 0;
        if (comboResponse.ok) {
            const combos = await comboResponse.json();
            combosCount = Array.isArray(combos) ? combos.length : 0;
            console.log('✅ Combos loaded:', combosCount);
        } else {
            console.log('⚠️ Combos endpoint not available, using 0');
            combosCount = 0;
        }
        
        // Calculate stats from real data
        const stats = calculateStats(orders, menuItemsCount, combosCount);
        
        // Update UI with real stats
        updateUI(stats);
        
        // Render recent orders
        renderRecentOrders(orders.slice(-5).reverse());
        
    } catch (error) {
        console.error('❌ Error loading dashboard data:', error);
        // Show error state
        document.getElementById('stat-total-orders').textContent = 'Error';
        document.getElementById('stat-pending-orders').textContent = 'Error';
        document.getElementById('stat-total-sales').textContent = 'Error';
        document.getElementById('stat-completed-orders').textContent = 'Error';
    }
}

function calculateStats(orders, menuItemsCount = 0, combosCount = 0) {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const completedOrders = orders.filter(o => o.status === 'Completed').length;
    const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const todayOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt).toDateString();
        const today = new Date().toDateString();
        return orderDate === today;
    });
    const todaySales = todayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    
    return {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalSales,
        todaySales,
        avgOrderValue,
        menuItems: menuItemsCount, // Real count from backend
        activeCombos: combosCount  // Real count from backend
    };
}

function updateUI(stats) {
    document.getElementById('stat-total-orders').textContent = stats.totalOrders;
    document.getElementById('stat-pending-orders').textContent = stats.pendingOrders;
    document.getElementById('stat-total-sales').textContent = '₹' + stats.totalSales.toLocaleString();
    document.getElementById('stat-completed-orders').textContent = stats.completedOrders;
    document.getElementById('stat-menu-items').textContent = stats.menuItems;
    document.getElementById('stat-active-combos').textContent = stats.activeCombos;
    
    document.getElementById('stat-today-sales').textContent = '₹' + stats.todaySales.toLocaleString();
    document.getElementById('stat-avg-value').textContent = '₹' + Math.round(stats.avgOrderValue).toLocaleString();
    
    // Add click handlers to stat cards
    attachStatCardClickHandlers();
    
    // Add tooltips
    addTooltips();
}

function attachStatCardClickHandlers() {
    // Make stat cards clickable
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach(card => {
        // Add cursor pointer and click effect
        card.style.cursor = 'pointer';
        card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
        card.style.position = 'relative';
        
        // Add a small indicator icon
        const indicator = document.createElement('div');
        indicator.innerHTML = '→';
        indicator.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            color: #999;
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.2s ease;
        `;
        card.appendChild(indicator);
        
        // Add hover effect
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-2px)';
            card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            indicator.style.opacity = '1';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            indicator.style.opacity = '0';
        });
        
        // Add click handler
        card.addEventListener('click', () => {
            const title = card.querySelector('p')?.textContent?.trim() || 
                         card.querySelector('h2')?.parentElement?.querySelector('p')?.textContent?.trim();
            if (title) {
                navigateToSection(title);
            }
        });
    });
    
    // Also make revenue summary cards clickable
    const revenueCards = document.querySelectorAll('.admin-stats-grid .admin-card');
    revenueCards.forEach(card => {
        const pElement = card.querySelector('p');
        if (pElement && (pElement.textContent.includes('Sales') || pElement.textContent.includes('Avg.'))) {
            card.style.cursor = 'pointer';
            card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
            card.style.position = 'relative';
            
            // Add indicator for revenue cards
            const indicator = document.createElement('div');
            indicator.innerHTML = '→';
            indicator.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                color: #999;
                font-size: 12px;
                opacity: 0;
                transition: opacity 0.2s ease;
            `;
            card.appendChild(indicator);
            
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-2px)';
                card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                indicator.style.opacity = '1';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                indicator.style.opacity = '0';
            });
            
            card.addEventListener('click', () => {
                navigateToSection(pElement.textContent.trim());
            });
        }
    });
}

function navigateToSection(section) {
    switch(section) {
        case 'Total Orders':
        case 'Pending Orders':
        case 'Completed Orders':
            window.location.href = 'orders.html';
            break;
        case 'Menu Items':
            window.location.href = 'menu.html';
            break;
        case 'Active Combos':
            window.location.href = 'combos.html';
            break;
        case 'Total Sales':
        case 'Sales Today':
        case 'Avg. Order Value':
            window.location.href = 'analytics.html';
            break;
        default:
            console.log('Unknown section:', section);
    }
}

function addTooltips() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach(card => {
        const title = card.querySelector('p')?.textContent?.trim();
        if (title) {
            card.title = `Click to view ${title} details`;
        }
    });
    
    // Add tooltips to revenue cards
    const revenueCards = document.querySelectorAll('.admin-stats-grid .admin-card');
    revenueCards.forEach(card => {
        const pElement = card.querySelector('p');
        if (pElement && (pElement.textContent.includes('Sales') || pElement.textContent.includes('Avg.'))) {
            card.title = `Click to view ${pElement.textContent.trim()} details`;
        }
    });
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
        const shortId = (order.orderId || order._id).includes('-') ? 
            (order.orderId || order._id).split('-').pop() : 
            (order.orderId || order._id).slice(-6);

        html += `
            <tr>
                <td style="font-family: monospace; font-weight: 600;">#${shortId}</td>
                <td>${order.customerName || 'Guest'}</td>
                <td>₹${amount}</td>
                <td><span class="status-badge ${statusClass}">${status}</span></td>
                <td><button class="admin-btn" style="padding:5px 10px; font-size:0.8rem;" onclick="window.location.href='orders.html?id=${order._id}'">Update</button></td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}
