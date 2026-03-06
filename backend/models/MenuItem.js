const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Beverage', 'Chaat', 'Indian Street Delight', 'Paratha', 'South Indian', 'Thali', 'Soup', 'Bread', 'Quick Bites', 'Dessert']
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    bestseller: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
