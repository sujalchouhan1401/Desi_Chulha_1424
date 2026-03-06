/**
 * Order API Service - Replaces localStorage with API calls
 * Handles all order-related operations with the backend
 */
const orderApi = {
    /**
     * Create a new order via API
     * @param {Object} order - The order to create
     * @returns {Promise<Object>} Created order
     */
    createOrder: async function (order) {
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
            window.dispatchEvent(new CustomEvent('orderCreated'));
            
            return newOrder;
        } catch (error) {
            console.error('Error creating order:', error);
            // Fallback to localStorage for development
            if (window.orderStorage) {
                window.orderStorage.addOrder(order);
                window.dispatchEvent(new CustomEvent('orderCreated'));
                return order;
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
            const response = await fetch('/api/orders');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const orders = await response.json();
            return orders.filter(o => o.userId === userId) || [];
        } catch (error) {
            console.error('Error fetching user orders:', error);
            // Fallback to localStorage for development
            return window.orderStorage?.getUserOrders(userId) || [];
        }
    },

    /**
     * Get order by ID
     * @param {string} orderId - The ID of the order
     * @returns {Promise<Object|null>} Order object or null
     */
    getOrderById: async function (orderId) {
        try {
            const response = await fetch('/api/orders');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const orders = await response.json();
            return orders.find(o => (o._id === orderId || o.id === orderId)) || null;
        } catch (error) {
            console.error('Error fetching order by ID:', error);
            // Fallback to localStorage for development
            const orders = window.orderStorage?.getOrders() || [];
            return orders.find(o => o.id === orderId) || null;
        }
    },

    /**
     * Get order status
     * @param {string} orderId - The ID of the order
     * @returns {Promise<string|null>} Order status or null
     */
    getOrderStatus: async function (orderId) {
        try {
            const order = await this.getOrderById(orderId);
            return order ? order.status : null;
        } catch (error) {
            console.error('Error fetching order status:', error);
            return null;
        }
    },

    /**
     * Cancel an order
     * @param {string} orderId - The ID of the order to cancel
     * @returns {Promise<Object>} Updated order
     */
    cancelOrder: async function (orderId) {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'cancelled' })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const updatedOrder = await response.json();
            
            // Dispatch event for real-time updates
            window.dispatchEvent(new CustomEvent('orderCancelled'));
            
            return updatedOrder;
        } catch (error) {
            console.error('Error cancelling order:', error);
            // Fallback to localStorage for development
            if (window.orderStorage) {
                window.orderStorage.updateOrderStatus(orderId, 'cancelled');
                window.dispatchEvent(new CustomEvent('orderCancelled'));
                return window.orderStorage.getOrders().find(order => order.id === orderId);
            }
            throw error;
        }
    },

    /**
     * Get order history for user
     * @param {string} userId - User identifier
     * @returns {Promise<Array>} List of completed orders
     */
    getOrderHistory: async function (userId) {
        try {
            const orders = await this.getUserOrders(userId);
            return orders.filter(o => 
                o.status === 'delivered' || o.status === 'cancelled'
            ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } catch (error) {
            console.error('Error fetching order history:', error);
            return [];
        }
    },

    /**
     * Get active orders for user
     * @param {string} userId - User identifier
     * @returns {Promise<Array>} List of active orders
     */
    getActiveOrders: async function (userId) {
        try {
            const orders = await this.getUserOrders(userId);
            return orders.filter(o => 
                ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)
            ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } catch (error) {
            console.error('Error fetching active orders:', error);
            return [];
        }
    }
};

// Export globally
window.orderApi = orderApi;
