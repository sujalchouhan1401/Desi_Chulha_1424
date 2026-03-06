/**
 * Admin Customer Management - Real Data from Backend API
 */

let customersCache = [];
let filteredCustomers = [];
let ordersCache = [];

// Initialize after admin layout is injected
if (document.querySelector('.admin-workspace')) {
    init();
} else {
    document.addEventListener('adminLayoutReady', init);
}

async function init() {
    console.log("🚀 Admin Customers UI Initializing...");
    
    try {
        await loadData();
        attachEvents();
        console.log("✅ Admin Customers initialization complete");
    } catch (error) {
        console.error("❌ Error initializing customers:", error);
    }
}

async function loadData() {
    try {
        console.log("📊 Loading customer data from backend...");
        
        // Fetch orders from backend
        const response = await fetch('http://localhost:5000/api/orders-test');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        ordersCache = await response.json();
        console.log("✅ Orders loaded:", ordersCache.length);
        
        // Process orders to create customer data
        customersCache = processCustomerData(ordersCache);
        console.log("✅ Customers processed:", customersCache.length);
        
        applyFiltersAndSort();
        
    } catch (error) {
        console.error("❌ Error loading customer data:", error);
        customersCache = [];
        applyFiltersAndSort();
    }
}

function processCustomerData(orders) {
    const customerMap = new Map();
    
    orders.forEach(order => {
        const phone = order.phone || 'Unknown';
        const name = order.customerName || 'Guest';
        
        if (!customerMap.has(phone)) {
            customerMap.set(phone, {
                id: phone,
                name: name,
                phone: phone,
                totalOrders: 0,
                totalSpent: 0,
                lastOrderDate: order.createdAt,
                orders: []
            });
        }
        
        const customer = customerMap.get(phone);
        customer.totalOrders++;
        customer.totalSpent += order.totalAmount || 0;
        customer.orders.push({
            id: order._id,
            orderId: order.orderId,
            createdAt: order.createdAt,
            totalAmount: order.totalAmount,
            status: order.status,
            items: order.items
        });
        
        // Update last order date if this order is newer
        if (new Date(order.createdAt) > new Date(customer.lastOrderDate)) {
            customer.lastOrderDate = order.createdAt;
        }
    });
    
    return Array.from(customerMap.values());
}

function applyFiltersAndSort() {
    const searchTerm = document.getElementById('customer-search')?.value?.toLowerCase() || '';
    const sortBy = document.getElementById('sort-customers')?.value || 'name';

    // 1. Filter
    filteredCustomers = customersCache.filter(c =>
        c.name.toLowerCase().includes(searchTerm) ||
        c.phone.toLowerCase().includes(searchTerm) ||
        c.id.toLowerCase().includes(searchTerm)
    );

    // 2. Sort
    filteredCustomers.sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'orders') return b.totalOrders - a.totalOrders;
        if (sortBy === 'spent') return b.totalSpent - a.totalSpent;
        if (sortBy === 'latest') return new Date(b.lastOrderDate) - new Date(a.lastOrderDate);
        return 0;
    });

    renderCustomers();
}

function renderCustomers() {
    const tbody = document.getElementById('customer-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (filteredCustomers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:40px; color:#666;">No customers found matching your criteria.</td></tr>';
        return;
    }

    filteredCustomers.forEach(customer => {
        const tr = document.createElement('tr');
        const dateStr = new Date(customer.lastOrderDate).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
        });

        tr.innerHTML = `
            <td style="font-weight:600;">${customer.name}</td>
            <td style="color:#666; font-size:0.85rem;">${customer.phone}</td>
            <td style="text-align:center;">${customer.totalOrders}</td>
            <td style="font-weight:700; color:#059669;">₹${customer.totalSpent.toLocaleString()}</td>
            <td>${dateStr}</td>
            <td>
                <button class="admin-btn view-details-btn" data-id="${customer.id}" style="padding:5px 10px; font-size:0.8rem;">View Details</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Attach click events to detail buttons
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.onclick = () => showCustomerDetails(btn.getAttribute('data-id'));
    });
}

function showCustomerDetails(customerId) {
    const customer = customersCache.find(c => c.id === customerId);
    if (!customer) return;

    // Populate Modal Info
    document.getElementById('detail-customer-name').textContent = customer.name;
    document.getElementById('detail-phone').textContent = customer.phone;
    document.getElementById('detail-total-orders').textContent = customer.totalOrders;
    document.getElementById('detail-total-spent').textContent = `₹${customer.totalSpent.toLocaleString()}`;

    // Populate Order History
    const historyTbody = document.getElementById('history-tbody');
    historyTbody.innerHTML = '';

    // Sort customer's specific orders by date (newest first)
    const sortedOrders = [...customer.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    sortedOrders.forEach(order => {
        const orderTr = document.createElement('tr');
        const orderDate = new Date(order.createdAt).toLocaleDateString();
        const shortId = (order.orderId || order.id).includes('-') ? 
            (order.orderId || order.id).split('-').pop() : 
            (order.orderId || order.id).slice(-6);

        orderTr.innerHTML = `
            <td style="font-family: monospace;">#${shortId}</td>
            <td>${orderDate}</td>
            <td style="font-weight:700;">₹${(order.totalAmount || 0).toLocaleString()}</td>
            <td><span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span></td>
        `;
        historyTbody.appendChild(orderTr);
    });

    document.getElementById('customer-modal').style.display = 'flex';
}

function attachEvents() {
    // Search & Sort listeners
    const searchInput = document.getElementById('customer-search');
    const sortSelect = document.getElementById('sort-customers');
    
    if (searchInput) searchInput.oninput = applyFiltersAndSort;
    if (sortSelect) sortSelect.onchange = applyFiltersAndSort;

    // Modal Close
    const modal = document.getElementById('customer-modal');
    const closeBtn = document.getElementById('close-modal');
    
    if (closeBtn) closeBtn.onclick = () => modal.style.display = 'none';
    if (modal) modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
}

// Auto-refresh data every 30 seconds
setInterval(loadData, 30000);
