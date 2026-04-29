let ordersCache = [];
let filteredOrders = [];

// Initialization function
async function init() {
    console.log('🚀 Admin orders initialization starting...');
    console.log('🔍 Checking for admin workspace...');
    console.log('📋 Document ready state:', document.readyState);
    console.log('🔍 Admin workspace found:', !!document.querySelector('.admin-workspace'));

    try {
        await loadOrders();

        // Use event delegation for filter buttons
        setupEventDelegation();

        console.log('✅ Admin orders initialization complete');
    } catch (e) {
        console.error("❌ Error loading orders", e);
        console.error("📍 Stack trace:", e.stack);
    }
}

function setupEventDelegation() {
    console.log('🔧 Setting up event delegation...');

    // Handle filter button clicks via event delegation
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            if (e.target.textContent === 'Filter') {
                console.log('🔍 Filter button clicked via delegation');
                applyFilters();
            } else if (e.target.textContent === 'Clear') {
                console.log('🧹 Clear button clicked via delegation');
                clearFilters();
            }
        }
    });

    // Handle input changes via event delegation
    document.addEventListener('input', (e) => {
        if (e.target.id === 'search-order') {
            console.log('🔍 Search input changed via delegation');
            applyFilters();
        }
    });

    // Handle select changes via event delegation
    document.addEventListener('change', (e) => {
        if (e.target.id === 'status-filter' || e.target.id === 'date-filter') {
            console.log('🔍 Filter changed via delegation');
            applyFilters();
        }
    });

    console.log('✅ Event delegation setup complete');
}

// Ensure layout and workspace exist before rendering
if (document.querySelector('.admin-workspace')) {
    console.log('🚀 Admin workspace found, initializing immediately...');
    init();
} else {
    console.log('⏳ Waiting for admin layout to be ready...');
    document.addEventListener('adminLayoutReady', init);

    // Fallback: try again after a short delay
    setTimeout(() => {
        if (document.querySelector('.admin-workspace')) {
            console.log('🔄 Fallback: Admin workspace found, initializing...');
            init();
        } else {
            console.log('❌ Admin workspace not found after timeout, trying anyway...');
            init(); // Try to initialize anyway
        }
    }, 2000);
}

async function loadOrders() {
    console.log('📋 loadOrders function called...');
    try {
        console.log('📋 Loading orders from backend API...');

        // Use the test endpoint without authentication
        console.log('� Fetching from /api/orders-test (no auth required)...');

        const response = await fetch('http://localhost:5000/api/orders-test', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('📡 Response status:', response.status);

        if (!response.ok) {
            const text = await response.text();
            console.error('❌ Failed to load orders:', text);
            console.error('📍 Response details:', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries())
            });
            ordersCache = [];
        } else {
            ordersCache = await response.json();
            console.log('✅ Orders loaded:', ordersCache.length);
            console.log('📋 Sample order data:', ordersCache[0] ? {
                id: ordersCache[0]._id,
                customer: ordersCache[0].customerName,
                total: ordersCache[0].totalAmount,
                status: ordersCache[0].status
            } : 'No orders');
        }

        renderOrders();
        console.log('📋 renderOrders called');
    } catch (error) {
        console.error('❌ Error loading orders:', error);
        console.error('📍 Stack trace:', error.stack);
        ordersCache = [];
        renderOrders();
    }
}

function renderOrders() {
    console.log('📊 renderOrders called...');
    console.log('📋 Orders cache length:', ordersCache.length);
    console.log('📋 Filtered orders length:', filteredOrders.length);

    const tbody = document.querySelector('.admin-table tbody');
    console.log('🔍 Table tbody found:', !!tbody);

    if (!tbody) {
        console.error('❌ Table tbody not found! Looking for alternatives...');
        const altTbody = document.querySelector('tbody');
        console.log('🔍 Alternative tbody found:', !!altTbody);
        if (!altTbody) {
            console.error('❌ No tbody elements found in document');
            return;
        }
    }

    tbody.innerHTML = '';

    // Use filtered orders if available, otherwise use all orders
    const ordersToRender = filteredOrders.length > 0 ? filteredOrders : ordersCache;
    console.log('📊 Orders to render:', ordersToRender.length);

    if (ordersToRender.length === 0) {
        const message = filteredOrders.length === 0 && ordersCache.length > 0 ?
            'No orders match your filters.' :
            'No orders placed yet.';
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:40px; color:#666;">${message}</td></tr>`;
        console.log('📋 No orders to display, showing message:', message);
        return;
    }

    console.log('🔄 Rendering orders...');
    ordersToRender.forEach((order, index) => {
        const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleString('en-GB') : 'N/A';
        const tr = document.createElement('tr');
        console.log(`📋 Rendering order ${index + 1}:`, order._id || order.orderId);

        tr.innerHTML = `
            <td>#${order.orderId || order._id}</td>
            <td>${dateStr}</td>
            <td>${order.customerName || 'Guest'}</td>
            <td>₹${(order.totalAmount || 0).toLocaleString()}</td>
            <td>
                <select class="status-select" data-id="${order._id}" style="padding:5px; border-radius:4px; ${getStatusColor(order.status)}">
                    <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Preparing" ${order.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
                    <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td>
                <button class="admin-btn view-details-btn" data-id="${order._id}" style="padding:6px 12px; font-size: 0.85rem;">Details</button>
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
                if (row.innerHTML.includes(orderId)) {
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

            try {
                // For testing, use the test endpoint without authentication
                const response = await fetch(`http://localhost:5000/api/orders-test/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: newStatus })
                });

                if (response.ok) {
                    // Update cache local to this tab
                    const orderInCache = ordersCache.find(o => o._id === id);
                    if (orderInCache) orderInCache.status = newStatus;

                    // Also update filtered orders if they exist
                    const orderInFiltered = filteredOrders.find(o => o._id === id);
                    if (orderInFiltered) orderInFiltered.status = newStatus;

                    // Refresh UI instantly
                    renderOrders();
                    console.log('✅ Order status updated successfully');
                } else {
                    const errorText = await response.text();
                    console.error('❌ Update failed:', errorText);
                    alert("Order update failed! " + errorText);
                    e.target.disabled = false;
                }
            } catch (error) {
                console.error('❌ Error updating order:', error);
                alert("Order update failed! " + error.message);
                e.target.disabled = false;
            }
        });
    });

    // View Details Modal
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const order = ordersCache.find(o => o._id === id);
            if (order) {
                const itemsText = order.items.map(i => `${i.quantity}x ${i.name}`).join('\n');
                alert(`Order Full Details\n\nID: ${order.orderId || order._id}\nCustomer: ${order.customerName}\nPhone: ${order.phone}\nAddress: ${order.deliveryAddress ? order.deliveryAddress : 'Not Provided'}\nAmount: ₹${order.totalAmount}\nStatus: ${order.status}\n\nItems:\n${itemsText}`);
            }
        });
    });
}

// Filter functions
function attachFilterListeners() {
    console.log('🔧 Attaching filter listeners...');

    // Wait a bit for DOM to be ready
    setTimeout(() => {
        // Add real-time search
        const searchInput = document.getElementById('search-order');
        if (searchInput) {
            searchInput.addEventListener('input', applyFilters);
            console.log('✅ Search input listener attached');
        } else {
            console.error('❌ Search input not found');
        }

        // Check if other elements exist
        const statusFilter = document.getElementById('status-filter');
        const dateFilter = document.getElementById('date-filter');

        console.log('🔍 Element check:', {
            searchInput: !!searchInput,
            statusFilter: !!statusFilter,
            dateFilter: !!dateFilter
        });
    }, 100);
}

function applyFilters() {
    console.log('🔍 applyFilters function called!');

    const searchTerm = document.getElementById('search-order')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('status-filter')?.value || 'all';
    const dateFilter = document.getElementById('date-filter')?.value || '';

    console.log('🔍 Filter values:', { searchTerm, statusFilter, dateFilter });

    filteredOrders = ordersCache.filter(order => {
        // Search filter
        const matchesSearch = !searchTerm ||
            (order.orderId && order.orderId.toLowerCase().includes(searchTerm)) ||
            (order._id && order._id.toLowerCase().includes(searchTerm)) ||
            (order.customerName && order.customerName.toLowerCase().includes(searchTerm)) ||
            (order.phone && order.phone.includes(searchTerm));

        // Status filter
        const matchesStatus = statusFilter === 'all' ||
            (order.status && order.status.toLowerCase() === statusFilter);

        // Date filter
        let matchesDate = true;
        if (dateFilter) {
            const orderDate = new Date(order.createdAt).toDateString();
            const filterDate = new Date(dateFilter).toDateString();
            matchesDate = orderDate === filterDate;
        }

        return matchesSearch && matchesStatus && matchesDate;
    });

    console.log('🔍 Filters applied:', {
        searchTerm,
        statusFilter,
        dateFilter,
        results: filteredOrders.length
    });

    renderOrders();
}

function clearFilters() {
    // Clear all filter inputs
    document.getElementById('search-order').value = '';
    document.getElementById('status-filter').value = 'all';
    document.getElementById('date-filter').value = '';

    // Clear filtered orders
    filteredOrders = [];

    console.log('🧹 Filters cleared');

    // Re-render all orders
    renderOrders();
}

// Make functions globally accessible
window.applyFilters = applyFilters;
window.clearFilters = clearFilters;
window.testFilters = testFilters;

function testFilters() {
    console.log('🧪 Testing filter functionality...');

    // Check if elements exist
    const elements = {
        searchInput: document.getElementById('search-order'),
        statusFilter: document.getElementById('status-filter'),
        dateFilter: document.getElementById('date-filter'),
        filterBtn: document.querySelector('button[onclick="applyFilters()"]'),
        clearBtn: document.querySelector('button[onclick="clearFilters()"]')
    };

    console.log('🔍 Elements found:', elements);

    // Test applyFilters function directly
    console.log('🧪 Testing applyFilters function...');
    try {
        applyFilters();
        console.log('✅ applyFilters function works');
    } catch (error) {
        console.error('❌ applyFilters function error:', error);
    }

    // Test with sample data
    console.log('🧪 Testing with sample data...');
    console.log('📊 Orders cache:', ordersCache.length);
    console.log('📊 Filtered orders:', filteredOrders.length);
}
