class ProfileManager {
    constructor() {
        this.userData = {};
        this.addresses = [];
        this.orders = [];
        this.coins = 0;
        this.init();
    }

    async init() {
        // Load user data from localStorage
        const savedProfile = localStorage.getItem('desi_user_profile');
        if (savedProfile) {
            this.userData = JSON.parse(savedProfile);
        }

        // Load addresses
        const savedAddresses = localStorage.getItem('desi_user_addresses');
        if (savedAddresses) {
            this.addresses = JSON.parse(savedAddresses);
        }

        // Load coins
        const savedCoins = localStorage.getItem('desi_user_coins');
        if (savedCoins) {
            this.coins = parseInt(savedCoins) || 0;
        }

        // Load orders from API
        await this.loadOrdersFromAPI();

        // Render UI
        this.renderProfile();
        this.renderAddresses();
        this.renderOrders();
        this.renderRewards();
    }

    async loadOrdersFromAPI() {
        const orderList = document.querySelector('.order-list');
        const emptyState = document.getElementById('orders-empty-state');

        if (!orderList) return;

        try {
            console.log('📋 Loading user orders from backend...');

            // Show loading state
            orderList.innerHTML = '<div style="text-align: center; padding: 20px;">Loading orders...</div>';

            // Call API to get all orders (using test endpoint without authentication)
            const response = await fetch('http://localhost:5000/api/orders-test', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('📡 Orders response status:', response.status);

            if (!response.ok) {
                const text = await response.text();
                console.error('❌ Orders error response:', text);
                throw new Error('Failed to load orders');
            }

            const allOrders = await response.json();
            console.log('📋 All orders loaded:', allOrders.length);

            // Filter orders to show only user-specific ones
            // For now, filter by guest users or specific test patterns
            // In production, this would filter by actual user ID
            const userOrders = allOrders.filter(order => {
                // Show orders that match current user or guest orders
                const currentUserPhone = localStorage.getItem('desi_user_phone') || '9876543210';
                const currentUserEmail = this.userData.email || '';

                // Filter logic:
                // 1. Show orders with matching phone number
                // 2. Show orders with matching email (if available)
                // 3. Hide test orders with specific patterns
                const isUserOrder = order.phone === currentUserPhone;
                const isGuestOrder = order.customerName.includes('Guest') || order.phone === '9876543210';
                const isTestOrder = order.customerName.includes('Test') || order.customerName.includes('Direct') || order.customerName.includes('Final');

                // Show user orders and guest orders, but hide test orders
                return isUserOrder || (isGuestOrder && !isTestOrder);
            });

            console.log('📋 Filtered user orders:', userOrders.length);

            // Store orders for details modal
            this.orders = userOrders;

            if (userOrders.length === 0) {
                orderList.innerHTML = '';
                if (emptyState) emptyState.style.display = 'block';
                return;
            }

            if (emptyState) emptyState.style.display = 'none';

            let html = '';
            userOrders.forEach(order => {
                const date = new Date(order.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const itemsText = order.items.map(i => `${i.quantity}x ${i.name}`).join(', ');
                const statusClass = `status-${order.status.toLowerCase()}`;
                const statusColor = this.getStatusColor(order.status);

                html += `
                    <div class="order-card-modern" style="
                        background: white;
                        border-radius: 12px;
                        padding: 20px;
                        margin-bottom: 16px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                        border-left: 4px solid ${statusColor};
                        transition: transform 0.2s ease, box-shadow 0.2s ease;
                    ">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                            <div>
                                <h4 style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 600;">
                                    📦 Order ${order.orderId || order._id}
                                </h4>
                                <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">
                                    📅 ${date}
                                </p>
                            </div>
                            <div style="text-align: right;">
                                <span style="
                                    display: inline-block;
                                    padding: 6px 12px;
                                    border-radius: 20px;
                                    font-size: 12px;
                                    font-weight: 600;
                                    color: white;
                                    background: ${statusColor};
                                ">
                                    ${order.status}
                                </span>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 12px;">
                            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                                <span style="color: #6b7280; font-size: 14px; margin-right: 8px;">👤</span>
                                <span style="color: #374151; font-size: 14px; font-weight: 500;">${order.customerName}</span>
                                <span style="color: #6b7280; font-size: 14px; margin-left: 12px;">📞 ${order.phone}</span>
                            </div>
                        </div>
                        
                        <div style="background: #f9fafb; padding: 12px; border-radius: 8px; margin-bottom: 12px;">
                            <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.5;">
                                🍽️ ${itemsText}
                            </p>
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="font-size: 18px; font-weight: 700; color: #1f2937;">
                                ₹${order.totalAmount}
                            </div>
                            <button onclick="window.profileManager.viewOrderDetails('${order._id}')" style="
                                background: #3b82f6;
                                color: white;
                                border: none;
                                padding: 8px 16px;
                                border-radius: 6px;
                                font-size: 14px;
                                cursor: pointer;
                                transition: background 0.2s ease;
                            " onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">
                                View Details
                            </button>
                        </div>
                    </div>
                `;
            });

            orderList.innerHTML = html;

        } catch (error) {
            console.error('Error loading orders:', error);
            orderList.innerHTML = '<div style="text-align: center; padding: 20px; color: red;">Failed to load orders</div>';
            if (emptyState) emptyState.style.display = 'none';
        }
    }

    renderOrders() {
        // Orders are rendered by loadOrdersFromAPI
        console.log('📋 Rendering orders...');
    }

    renderProfile() {
        // Update profile UI
        const nameElements = document.querySelectorAll('.user-name');
        const phoneElements = document.querySelectorAll('.user-phone');
        const emailElements = document.querySelectorAll('.user-email');

        nameElements.forEach(el => {
            if (this.userData.fullName) el.textContent = this.userData.fullName;
        });

        phoneElements.forEach(el => {
            if (this.userData.phone) el.textContent = this.userData.phone;
        });

        emailElements.forEach(el => {
            if (this.userData.email) el.textContent = this.userData.email;
        });
    }

    renderAddresses() {
        const addressGrid = document.querySelector('.address-grid');
        if (!addressGrid) return;

        // Clear existing addresses except add button
        const addBtn = addressGrid.querySelector('.add-new-address');
        addressGrid.querySelectorAll('.address-card').forEach(c => c.remove());

        this.addresses.forEach(addr => {
            const card = document.createElement('div');
            card.className = 'address-card';
            card.innerHTML = `
                <div class="address-tag">${addr.label}</div>
                <h4>${this.userData.fullName || 'Customer'}</h4>
                <p>${addr.street}<br>${addr.city}, Rajasthan ${addr.pincode}</p>
                <div class="address-actions" style="justify-content:space-between; align-items:center;">
                    <div style="display:flex; gap:16px;">
                        <button type="button" onclick="window.profileManager.deleteAddress(${addr.id})" class="delete-btn">Delete</button>
                    </div>
                    <label style="font-size:13px; color:var(--text-muted); display:flex; gap:6px; cursor:pointer;">
                        <input type="radio" name="default_addr" ${addr.isDefault ? 'checked' : ''} onchange="window.profileManager.setDefaultAddress(${addr.id})"> Set as Default
                    </label>
                </div>
            `;
            addressGrid.insertBefore(card, addBtn);
        });
    }

    renderRewards() {
        const coinsDisplay = document.getElementById('rewards-coins-display');
        const valueDisplay = document.getElementById('rewards-value-display');

        if (coinsDisplay) {
            coinsDisplay.innerHTML = `${this.coins} <span style="font-size: 18px; font-weight: 500;">DC Coins</span>`;
        }

        if (valueDisplay) {
            valueDisplay.textContent = `₹${this.coins}`;
        }
    }

    earnCoins(amount) {
        const coinsEarned = Math.floor(amount / 10);
        this.coins += coinsEarned;
        localStorage.setItem('desi_user_coins', this.coins.toString());
        this.renderRewards();
        console.log(`🪙 Earned ${coinsEarned} DC Coins! Total: ${this.coins}`);
    }

    deleteAddress(id) {
        this.addresses = this.addresses.filter(addr => addr.id !== id);
        localStorage.setItem('desi_user_addresses', JSON.stringify(this.addresses));
        this.renderAddresses();
    }

    getStatusColor(status) {
        switch (status.toLowerCase()) {
            case 'completed': return '#10b981';
            case 'pending': return '#f59e0b';
            case 'preparing': return '#3b82f6';
            case 'cancelled': return '#ef4444';
            default: return '#6b7280';
        }
    }

    viewOrderDetails(orderId) {
        const order = this.orders.find(o => o._id === orderId);
        if (!order) return;

        const date = new Date(order.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const itemsHtml = order.items.map(item => `
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                <span>${item.quantity}x ${item.name}</span>
                <span>₹${item.price}</span>
            </div>
        `).join('');

        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;

        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 12px;
                padding: 24px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: #1f2937;">Order Details</h3>
                    <button onclick="this.closest('div').parentElement.remove()" style="
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #6b7280;
                    ">×</button>
                </div>
                
                <div style="margin-bottom: 16px;">
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">Order ID</p>
                    <p style="margin: 4px 0 0 0; font-weight: 600;">${order.orderId || order._id}</p>
                </div>
                
                <div style="margin-bottom: 16px;">
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">Date & Time</p>
                    <p style="margin: 4px 0 0 0;">${date}</p>
                </div>
                
                <div style="margin-bottom: 16px;">
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">Customer Information</p>
                    <p style="margin: 4px 0 0 0;">${order.customerName} - ${order.phone}</p>
                </div>
                
                <div style="margin-bottom: 16px;">
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">Items</p>
                    <div style="background: #f9fafb; padding: 12px; border-radius: 8px; margin-top: 8px;">
                        ${itemsHtml}
                    </div>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid #e5e7eb;">
                    <span style="font-weight: 600; color: #1f2937;">Total Amount</span>
                    <span style="font-size: 20px; font-weight: 700; color: #1f2937;">₹${order.totalAmount}</span>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    setDefaultAddress(id) {
        this.addresses.forEach(addr => {
            addr.isDefault = addr.id === id;
        });
        localStorage.setItem('desi_user_addresses', JSON.stringify(this.addresses));
        this.renderAddresses();
    }

    logout() {
        // Clear all user profile data
        localStorage.removeItem('desi_user_profile');
        localStorage.removeItem('desi_user_addresses');
        localStorage.removeItem('desi_user_phone');
        localStorage.removeItem('desi_auth_token');

        // Clear cart & session data
        localStorage.removeItem('desi_chulha_cart');
        localStorage.removeItem('desi_chulha_order_type');
        localStorage.removeItem('desi_chulha_promo');
        localStorage.removeItem('desi_chulha_orders');
        localStorage.removeItem('desi_chulha_coins');
        localStorage.removeItem('desi_chulha_coin_history');

        // Redirect to login/index
        window.location.href = '../index.html';
    }
}

// Initialize profile manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.profileManager = new ProfileManager();
});

// Expose logout globally so any page's logout button can call it
window.logout = function () {
    if (window.profileManager && typeof window.profileManager.logout === 'function') {
        window.profileManager.logout();
    }
};
