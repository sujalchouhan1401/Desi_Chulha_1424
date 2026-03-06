const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Combo = require('../models/Combo');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let dateFilter = {};
        
        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
        }
        
        const totalOrders = await Order.countDocuments(dateFilter);
        const totalRevenue = await Order.aggregate([
            { $match: { ...dateFilter, status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);
        
        const totalCustomers = await User.countDocuments({ role: 'customer' });
        const activeMenuItems = await MenuItem.countDocuments({ available: true });
        const activeCombos = await Combo.countDocuments({ available: true });
        
        const recentOrders = await Order.find(dateFilter)
            .sort({ createdAt: -1 })
            .limit(5);
        
        res.json({
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            totalCustomers,
            activeMenuItems,
            activeCombos,
            recentOrders
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSalesAnalytics = async (req, res) => {
    try {
        const { startDate, endDate, groupBy = 'day' } = req.query;
        let dateFilter = {};
        
        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
        }
        
        let groupFormat;
        switch (groupBy) {
            case 'hour':
                groupFormat = { $dateToString: { format: "%Y-%m-%d %H:00", date: "$createdAt" } };
                break;
            case 'day':
                groupFormat = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
                break;
            case 'week':
                groupFormat = { $dateToString: { format: "%Y-W%U", date: "$createdAt" } };
                break;
            case 'month':
                groupFormat = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
                break;
            default:
                groupFormat = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
        }
        
        const salesData = await Order.aggregate([
            { $match: { ...dateFilter, status: { $ne: 'cancelled' } } },
            {
                $group: {
                    _id: groupFormat,
                    orders: { $sum: 1 },
                    revenue: { $sum: '$total' },
                    avgOrderValue: { $avg: '$total' }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        res.json(salesData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTopSellingItems = async (req, res) => {
    try {
        const { startDate, endDate, limit = 10 } = req.query;
        let dateFilter = {};
        
        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
        }
        
        const topItems = await Order.aggregate([
            { $match: { ...dateFilter, status: { $ne: 'cancelled' } } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.menuItemId',
                    name: { $first: '$items.name' },
                    totalQuantity: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: parseInt(limit) }
        ]);
        
        res.json(topItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCustomerAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let dateFilter = {};
        
        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
        }
        
        const newCustomers = await User.aggregate([
            { $match: { role: 'customer', ...dateFilter } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        const customerStats = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            {
                $group: {
                    _id: '$customerEmail',
                    totalOrders: { $sum: 1 },
                    totalSpent: { $sum: '$total' },
                    avgOrderValue: { $avg: '$total' },
                    firstOrder: { $min: '$createdAt' },
                    lastOrder: { $max: '$createdAt' }
                }
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 10 }
        ]);
        
        const totalCustomers = await User.countDocuments({ role: 'customer' });
        const activeCustomers = await Order.distinct('customerEmail', {
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        });
        
        res.json({
            totalCustomers,
            activeCustomers: activeCustomers.length,
            newCustomers,
            topCustomers: customerStats
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOrderAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let dateFilter = {};
        
        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
        }
        
        const ordersByStatus = await Order.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalValue: { $sum: '$total' }
                }
            }
        ]);
        
        const ordersByType = await Order.aggregate([
            { $match: { ...dateFilter, status: { $ne: 'cancelled' } } },
            {
                $group: {
                    _id: '$orderType',
                    count: { $sum: 1 },
                    totalValue: { $sum: '$total' }
                }
            }
        ]);
        
        const ordersByPaymentMethod = await Order.aggregate([
            { $match: { ...dateFilter, status: { $ne: 'cancelled' } } },
            {
                $group: {
                    _id: '$paymentMethod',
                    count: { $sum: 1 },
                    totalValue: { $sum: '$total' }
                }
            }
        ]);
        
        res.json({
            ordersByStatus,
            ordersByType,
            ordersByPaymentMethod
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRevenueAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let dateFilter = {};
        
        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
        }
        
        const revenueByCategory = await Order.aggregate([
            { $match: { ...dateFilter, status: { $ne: 'cancelled' } } },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'menuitems',
                    localField: 'items.menuItemId',
                    foreignField: 'id',
                    as: 'menuItem'
                }
            },
            { $unwind: '$menuItem' },
            {
                $group: {
                    _id: '$menuItem.category',
                    revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
                    quantity: { $sum: '$items.quantity' },
                    orders: { $addToSet: '$orderId' }
                }
            },
            {
                $addFields: {
                    orderCount: { $size: '$orders' }
                }
            },
            { $project: { orders: 0 } },
            { $sort: { revenue: -1 } }
        ]);
        
        const dailyRevenue = await Order.aggregate([
            { $match: { ...dateFilter, status: { $ne: 'cancelled' } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: '$total' },
                    orders: { $sum: 1 },
                    avgOrderValue: { $avg: '$total' }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        res.json({
            revenueByCategory,
            dailyRevenue
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
