/**
 * Central storage utility for handling order data in localStorage.
 * This acts as a simulated backend/database for both user and admin panels.
 */
const orderStorage = {
    /**
     * Fetch all orders from localStorage
     * @returns {Array} List of all orders
     */
    getOrders: function () {
        const orders = localStorage.getItem('orders');
        return orders ? JSON.parse(orders) : [];
    },

    /**
     * Save an array of orders to localStorage
     * @param {Array} orders - The orders to save
     */
    saveOrders: function (orders) {
        localStorage.setItem('orders', JSON.stringify(orders));
    },

    /**
     * Add a new order to the list
     * @param {Object} order - The new order to add
     */
    addOrder: function (order) {
        const orders = this.getOrders();
        orders.unshift(order); // Add new orders to the beginning of the list
        this.saveOrders(orders);
    },

    /**
     * Update an order's status
     * @param {string} orderId - The unique ID of the order to update
     * @param {string} status - New status: "Pending", "Preparing", "Completed", "Cancelled"
     * @returns {boolean} Success status
     */
    updateOrderStatus: function (orderId, status) {
        const orders = this.getOrders();
        const index = orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
            orders[index].status = status;
            this.saveOrders(orders);
            return true;
        }
        return false;
    },

    /**
     * Fetch orders for a specific user
     * @param {string} userId - User identifier
     * @returns {Array} List of user orders
     */
    getUserOrders: function (userId) {
        const orders = this.getOrders();
        return orders.filter(o => o.userId === userId);
    }
};

// Export to global window so both user and admin scripts can find it easily
window.orderStorage = orderStorage;
