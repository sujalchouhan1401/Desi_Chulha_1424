const mongoose = require('mongoose');

const comboSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    items: [{
        menuItemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    comboPrice: {
        type: Number,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Combo', comboSchema);
