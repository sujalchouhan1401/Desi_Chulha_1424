// admin/js/api.js
// Centralized mock API Service. Replace methods with Firebase/fetch logic later.

const MOCK_DELAY = 400;

let mockOrders = [
    { id: '#ORD-8923', date: 'Today, 14:30', customer: 'Rahul Kumar', amount: 1450, status: 'pending' },
    { id: '#ORD-8922', date: 'Today, 13:15', customer: 'Priya Singh', amount: 890, status: 'completed' }
];

let mockMenu = [
    { id: 'm1', name: 'Chole Bhature', category: 'Main Course', price: 150, inStock: true, bestseller: true },
    { id: 'm2', name: 'Aloo Paratha', category: 'Breakfast', price: 80, inStock: false, bestseller: false }
];

let mockCombos = [
    { id: 'c1', name: 'Student Special', items: 'Aloo Paratha + Chai', price: 99, active: true },
    { id: 'c2', name: 'Family Pack', items: '4x Chole Bhature + 4x Lassi', price: 599, active: true }
];

let mockOffers = [
    { id: 'o1', code: 'DIWALI50', discount: '50% OFF', expiry: '2026-11-12', active: true },
    { id: 'o2', code: 'WELCOME20', discount: 'Flat ₹20', expiry: '2026-12-31', active: true }
];

// Utility simulating network delay
const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const AdminAPI = {
    // --- Dashboard ---
    async getDashboardStats() {
        await delay(MOCK_DELAY);
        const totalSales = mockOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.amount, 0);
        return {
            totalOrders: mockOrders.length,
            pendingOrders: mockOrders.filter(o => o.status === 'pending').length,
            totalSales: totalSales,
            revenueSummary: '₹' + (totalSales * 1.5).toLocaleString()
        };
    },

    // --- Orders ---
    async getOrders() {
        await delay(MOCK_DELAY);
        return [...mockOrders];
    },
    async updateOrderStatus(orderId, newStatus) {
        await delay(MOCK_DELAY);
        const order = mockOrders.find(o => o.id === orderId);
        if (order) order.status = newStatus;
        return order;
    },

    // --- Menu ---
    async getMenu() {
        await delay(MOCK_DELAY);
        return [...mockMenu];
    },
    async addMenuItem(item) {
        await delay(MOCK_DELAY);
        item.id = 'm' + Date.now();
        mockMenu.push(item);
        return item;
    },
    async updateMenuItem(id, updates) {
        await delay(MOCK_DELAY);
        let idx = mockMenu.findIndex(m => m.id === id);
        if (idx !== -1) mockMenu[idx] = { ...mockMenu[idx], ...updates };
        return mockMenu[idx];
    },
    async deleteMenuItem(id) {
        await delay(MOCK_DELAY);
        mockMenu = mockMenu.filter(m => m.id !== id);
        return true;
    },

    // --- Combos ---
    async getCombos() {
        await delay(MOCK_DELAY);
        return [...mockCombos];
    },
    async toggleCombo(id, active) {
        await delay(MOCK_DELAY);
        let combo = mockCombos.find(c => c.id === id);
        if (combo) combo.active = active;
        return combo;
    },
    async deleteCombo(id) {
        await delay(MOCK_DELAY);
        mockCombos = mockCombos.filter(c => c.id !== id);
        return true;
    },

    // --- Offers ---
    async getOffers() {
        await delay(MOCK_DELAY);
        return [...mockOffers];
    },
    async toggleOffer(id, active) {
        await delay(MOCK_DELAY);
        let offer = mockOffers.find(o => o.id === id);
        if (offer) offer.active = active;
        return offer;
    },
    async deleteOffer(id) {
        await delay(MOCK_DELAY);
        mockOffers = mockOffers.filter(o => o.id !== id);
        return true;
    }
};
