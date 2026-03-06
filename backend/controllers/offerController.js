const Offer = require('../models/Offer');

exports.getAllOffers = async (req, res) => {
    try {
        const offers = await Offer.find({ active: true })
            .sort({ createdAt: -1 });
        res.json(offers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createOffer = async (req, res) => {
    try {
        const offer = new Offer(req.body);
        await offer.save();
        res.status(201).json(offer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
