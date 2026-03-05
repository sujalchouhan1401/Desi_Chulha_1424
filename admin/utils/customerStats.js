/**
 * Customer Stats Utility - Derives customer data from orders in localStorage.
 */
const customerStats = {
    /**
     * Get all orders from storage
     */
    getOrders: function () {
        return window.orderStorage ? window.orderStorage.getOrders() : [];
    },

    /**
     * Get unique customers from orders
     * @returns {Array} List of aggregated customer objects
     */
    getAllCustomers: function () {
        const orders = this.getOrders();
        const customerMap = new Map();

        orders.forEach(order => {
            // Using customerPhone or userId as unique key. 
            // If phone is missing, fallback to name (though not ideal)
            const key = order.userId || order.customerPhone || order.customerName;

            if (!customerMap.has(key)) {
                customerMap.set(key, {
                    id: key,
                    name: order.customerName || 'Guest User',
                    phone: order.customerPhone || 'N/A',
                    totalOrders: 0,
                    totalSpent: 0,
                    lastOrderDate: order.createdAt,
                    orders: []
                });
            }

            const customer = customerMap.get(key);
            customer.totalOrders += 1;
            customer.totalSpent += (order.totalAmount || 0);
            customer.orders.push(order);

            // Check if this order is more recent than the recorded one
            if (new Date(order.createdAt) > new Date(customer.lastOrderDate)) {
                customer.lastOrderDate = order.createdAt;
            }
        });

        return Array.from(customerMap.values());
    },

    /**
     * Get orders for a specific customer
     */
    getCustomerOrders: function (customerId) {
        const customers = this.getAllCustomers();
        const customer = customers.find(c => c.id === customerId);
        return customer ? customer.orders : [];
    }
};

window.customerStats = customerStats;
