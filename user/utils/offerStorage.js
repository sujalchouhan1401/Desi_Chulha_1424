/**
 * Central storage utility for handling discount offers in localStorage.
 */
const offerStorage = {
    /**
     * Get all offers from localStorage
     * @returns {Array} List of all offers
     */
    getOffers: function () {
        const offers = localStorage.getItem('offers');
        if (!offers) {
            return this.seedData();
        }
        return JSON.parse(offers);
    },

    /**
     * Seed initial offers if none exist
     */
    seedData: function () {
        const initial = [
            { id: 'off_1', code: 'WELCOME20', discount: 'Flat ₹20', expiry: '2026-12-31', active: true },
            { id: 'off_2', code: 'DIWALI50', discount: '50% OFF', expiry: '2026-11-12', active: true },
            { id: 'off_3', code: 'DESI100', discount: 'Flat ₹100', expiry: '2026-10-15', active: false }
        ];
        this.saveOffers(initial);
        return initial;
    },

    /**
     * Save offers to localStorage
     * @param {Array} offers 
     */
    saveOffers: function (offers) {
        localStorage.setItem('offers', JSON.stringify(offers));
    },

    /**
     * Add a new offer
     */
    addOffer: function (offer) {
        const offers = this.getOffers();
        const newOffer = {
            id: 'off_' + Date.now(),
            ...offer,
            active: true
        };
        offers.push(newOffer);
        this.saveOffers(offers);
        return newOffer;
    },

    /**
     * Update an existing offer
     */
    updateOffer: function (id, updatedData) {
        const offers = this.getOffers();
        const index = offers.findIndex(o => o.id === id);
        if (index !== -1) {
            offers[index] = { ...offers[index], ...updatedData };
            this.saveOffers(offers);
            return true;
        }
        return false;
    },

    /**
     * Delete an offer
     */
    deleteOffer: function (id) {
        const offers = this.getOffers();
        const filtered = offers.filter(o => o.id !== id);
        this.saveOffers(filtered);
    },

    /**
     * Toggle active status
     */
    toggleOfferStatus: function (id) {
        const offers = this.getOrders ? this.getOffers() : this.getOffers(); // Typo protection
        const index = offers.findIndex(o => o.id === id);
        if (index !== -1) {
            offers[index].active = !offers[index].active;
            this.saveOffers(offers);
            return true;
        }
        return false;
    }
};

window.offerStorage = offerStorage;
