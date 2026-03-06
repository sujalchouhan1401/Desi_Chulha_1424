const MenuItem = require('../models/MenuItem');

exports.getAllMenuItems = async (req, res) => {
    try {
        const menuItems = await MenuItem.find().sort({ category: 1, name: 1 });
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createMenuItem = async (req, res) => {
    try {
        const menuItem = new MenuItem(req.body);
        await menuItem.save();
        res.status(201).json(menuItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        
        res.json(menuItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
        
        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        
        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
