const Combo = require('../models/Combo');

exports.getAllCombos = async (req, res) => {
    try {
        const combos = await Combo.find()
            .populate('items.menuItemId', 'name price')
            .sort({ name: 1 });
        res.json(combos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createCombo = async (req, res) => {
    try {
        const combo = new Combo(req.body);
        await combo.save();
        res.status(201).json(combo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateCombo = async (req, res) => {
    try {
        const combo = await Combo.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('items.menuItemId', 'name price');
        
        if (!combo) {
            return res.status(404).json({ error: 'Combo not found' });
        }
        
        res.json(combo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteCombo = async (req, res) => {
    try {
        const combo = await Combo.findByIdAndDelete(req.params.id);
        
        if (!combo) {
            return res.status(404).json({ error: 'Combo not found' });
        }
        
        res.json({ message: 'Combo deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getComboById = async (req, res) => {
    try {
        const combo = await Combo.findById(req.params.id)
            .populate('items.menuItemId', 'name price');
        
        if (!combo) {
            return res.status(404).json({ error: 'Combo not found' });
        }
        
        res.json(combo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
