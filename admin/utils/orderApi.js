/**
 * Order API Service - Replaces localStorage with API calls
 * Handles all order-related operations with the backend
 */
const orderApi = {
    /**
     * Get all orders from the API
     * @returns {Promise<Array>} List of all orders
     */
    getOrders: async function () {
        try {
            const response = await fetch('/api/orders');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const orders = await response.json();
            return orders || [];
        } catch (error) {
            console.error('Error fetching orders:', error);
            // Fallback to localStorage for development
            return window.orderStorage?.getOrders() || [];
        }
    },

    /**
     * Create a new order via API
     * @param {Object} order - The order to create
     * @returns {Promise<Object>} Created order
     */
    addOrder: async function (order) {
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(order)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const newOrder = await response.json();
            
            // Dispatch event for real-time updates
            window.dispatchEvent(new CustomEvent('orderUpdated'));
            
            return newOrder;
        } catch (error) {
            console.error('Error creating order:', error);
            // Fallback to localStorage for development
            if (window.orderStorage) {
                window.orderStorage.addOrder(order);
                window.dispatchEvent(new CustomEvent('orderUpdated'));
                return order;
            }
            throw error;
        }
    },

    /**
     * Update an order's status via API
     * @param {string} orderId - The ID of the order to update
     * @param {string} status - New status: "pending", "confirmed", "preparing", "ready", "delivered", "cancelled"
     * @returns {Promise<Object>} Updated order
     */
    updateOrderStatus: async function (orderId, status) {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const updatedOrder = await response.json();
            
            // Dispatch event for real-time updates
            window.dispatchEvent(new CustomEvent('orderUpdated'));
            
            return updatedOrder;
        } catch (error) {
            console.error('Error updating order status:', error);
            // Fallback to localStorage for development
            if (window.orderStorage) {
                const success = window.orderStorage.updateOrderStatus(orderId, status);
                if (success) {
                    window.dispatchEvent(new CustomEvent('orderUpdated'));
                    return window.orderStorage.getOrders().find(order => order.id === orderId);
                }
            }
            throw error;
        }
    },

    /**
     * Get orders for a specific user
     * @param {string} userId - User identifier
     * @returns {Promise<Array>} List of user orders
     */
    getUserOrders: async function (userId) {
        try {
            const orders = await this.getOrders();
            return orders.filter(o => o.userId === userId);
        } catch (error) {
            console.error('Error fetching user orders:', error);
            // Fallback to localStorage for development
            return window.orderStorage?.getUserOrders(userId) || [];
        }
    },

    /**
     * Get orders by status
     * @param {string} status - Order status to filter by
     * @returns {Promise<Array>} List of orders with specified status
     */
    getOrdersByStatus: async function (status) {
        try {
            const orders = await this.getOrders();
            return orders.filter(o => o.status === status);
        } catch (error) {
            console.error('Error fetching orders by status:', error);
            return [];
        }
    },

    /**
     * Get order statistics
     * @returns {Promise<Object>} Order statistics
     */
    getOrderStats: async function () {
        try {
            const orders = await this.getOrders();
            
            const stats = {
                total: orders.length,
                pending: orders.filter(o => o.status === 'pending').length,
                confirmed: orders.filter(o => o.status === 'confirmed').length,
                preparing: orders.filter(o => o.status === 'preparing').length,
                ready: orders.filter(o => o.status === 'ready').length,
                delivered: orders.filter(o => o.status === 'delivered').length,
                cancelled: orders.filter(o => o.status === 'cancelled').length,
                totalRevenue: orders
                    .filter(o => o.status !== 'cancelled')
                    .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
            };
            
            return stats;
        } catch (error) {
            console.error('Error fetching order stats:', error);
            return {
                total: 0,
                pending: 0,
                confirmed: 0,
                preparing: 0,
                ready: 0,
                delivered: 0,
                cancelled: 0,
                totalRevenue: 0
            };
        }
    }
};

// Export globally
window.orderApi = orderApi;
