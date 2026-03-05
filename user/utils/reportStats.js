/**
 * Reports & Analytics Utility - Calculates business insights from localStorage.
 */
const reportStats = {
    getOrders: function () {
        return window.orderStorage ? window.orderStorage.getOrders() : [];
    },

    getTotalRevenue: function () {
        const completed = this.getOrders().filter(o => o.status === 'Completed');
        return completed.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    },

    getAverageOrderValue: function () {
        const completed = this.getOrders().filter(o => o.status === 'Completed');
        if (completed.length === 0) return 0;
        return this.getTotalRevenue() / completed.length;
    },

    getOrderStatusBreakdown: function () {
        const orders = this.getOrders();
        const breakdown = {
            Pending: 0,
            Preparing: 0,
            Completed: 0,
            Cancelled: 0
        };
        orders.forEach(o => {
            if (!o.status) return;
            // Normalize status to match breakdown keys (e.g., "pending" -> "Pending")
            const statusKey = o.status.charAt(0).toUpperCase() + o.status.slice(1).toLowerCase();
            if (breakdown.hasOwnProperty(statusKey)) {
                breakdown[statusKey]++;
            }
        });
        return breakdown;
    },

    getTopSellingItems: function () {
        const orders = this.getOrders().filter(o => o.status && o.status.toLowerCase() === 'completed');
        const itemMap = {};

        orders.forEach(order => {
            if (order.items) {
                order.items.forEach(item => {
                    const itemName = item.name || 'Unknown Item';
                    if (!itemMap[itemName]) {
                        itemMap[itemName] = { name: itemName, count: 0, revenue: 0 };
                    }
                    const qty = parseInt(item.quantity) || 1;
                    const price = parseFloat(item.price) || 0;
                    itemMap[itemName].count += qty;
                    itemMap[itemName].revenue += (price * qty);
                });
            }
        });

        return Object.values(itemMap).sort((a, b) => b.count - a.count).slice(0, 10);
    },

    getDailySalesLast7Days: function () {
        const orders = this.getOrders().filter(o => o.status && o.status.toLowerCase() === 'completed');
        const salesByDate = {};

        const now = new Date();
        // Initialize last 7 days in local time
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('en-CA'); // Robust YYYY-MM-DD in local time
            salesByDate[dateStr] = 0;
        }

        orders.forEach(order => {
            if (!order.createdAt) return;
            const d = new Date(order.createdAt);
            const dateStr = d.toLocaleDateString('en-CA');
            if (salesByDate.hasOwnProperty(dateStr)) {
                salesByDate[dateStr] += (parseFloat(order.totalAmount) || 0);
            }
        });

        return salesByDate;
    }
};

window.reportStats = reportStats;
