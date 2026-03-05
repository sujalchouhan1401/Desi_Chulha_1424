/**
 * Dashboard Stats Utility - Aggregates data from multiple storage modules
 * for the Admin Dashboard.
 */
const dashboardStats = {
    /**
     * Get orders from storage
     */
    getOrders: function () {
        return window.orderStorage ? window.orderStorage.getOrders() : [];
    },

    /**
     * Get menu items from storage
     */
    getMenuItems: function () {
        return window.menuStorage ? window.menuStorage.getMenuItems() : [];
    },

    /**
     * Get combos from storage
     */
    getCombos: function () {
        return window.comboStorage ? window.comboStorage.getCombos() : [];
    },

    /**
     * Core Stats
     */
    getTotalOrders: function () {
        return this.getOrders().length;
    },

    getPendingOrders: function () {
        return this.getOrders().filter(o => o.status === 'Pending').length;
    },

    getCompletedOrders: function () {
        return this.getOrders().filter(o => o.status === 'Completed').length;
    },

    getTotalSales: function () {
        const completed = this.getOrders().filter(o => o.status === 'Completed');
        return completed.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    },

    getTodaySales: function () {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

        const todayOrders = this.getOrders().filter(o => {
            const orderDate = new Date(o.createdAt).getTime();
            return orderDate >= startOfDay && o.status === 'Completed';
        });

        return todayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    },

    getAverageOrderValue: function () {
        const completedCount = this.getCompletedOrders();
        if (completedCount === 0) return 0;
        return Math.round(this.getTotalSales() / completedCount);
    },

    /**
     * Recent Activity
     */
    getRecentOrders: function (count = 5) {
        return this.getOrders().slice(0, count);
    },

    /**
     * Inventory Stats
     */
    getMenuItemCount: function () {
        return this.getMenuItems().length;
    },

    getActiveCombosCount: function () {
        return this.getCombos().filter(c => c.active).length;
    }
};

window.dashboardStats = dashboardStats;
