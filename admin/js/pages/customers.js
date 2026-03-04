/**
 * Admin Customer Management - Logic
 */

let customersCache = [];
let filteredCustomers = [];

// Initialize after admin layout is injected
if (document.querySelector('.admin-workspace')) {
    init();
} else {
    document.addEventListener('adminLayoutReady', init);
}

function init() {
    console.log("Admin Customers UI Initializing...");

    if (!window.customerStats) {
        console.error("Required storage utilities NOT found on window.");
        return;
    }

    loadData();
    attachEvents();
}

function loadData() {
    customersCache = window.customerStats.getAllCustomers();
    applyFiltersAndSort();
}

function applyFiltersAndSort() {
    const searchTerm = document.getElementById('customer-search').value.toLowerCase();
    const sortBy = document.getElementById('sort-customers').value;

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
        const shortId = order.id.includes('-') ? order.id.split('-').pop() : order.id.slice(-6);

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
    document.getElementById('customer-search').oninput = applyFiltersAndSort;
    document.getElementById('sort-customers').onchange = applyFiltersAndSort;

    // Modal Close
    const modal = document.getElementById('customer-modal');
    document.getElementById('close-modal').onclick = () => modal.style.display = 'none';
    modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
}
