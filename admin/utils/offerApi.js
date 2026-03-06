/**
 * Offer API Service - Replaces localStorage with API calls
 * Handles all offer-related operations with the backend
 */
const offerApi = {
    /**
     * Get all offers from the API
     * @returns {Promise<Array>} List of all offers
     */
    getOffers: async function () {
        try {
            const response = await fetch('/api/offers');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const offers = await response.json();
            return offers || [];
        } catch (error) {
            console.error('Error fetching offers:', error);
            // Fallback to localStorage for development
            return window.offerStorage?.getOffers() || [];
        }
    },

    /**
     * Create a new offer via API
     * @param {Object} offer - The offer to create
     * @returns {Promise<Object>} Created offer
     */
    addOffer: async function (offer) {
        try {
            const response = await fetch('/api/offers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(offer)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const newOffer = await response.json();
            
            // Dispatch event for real-time updates
            window.dispatchEvent(new CustomEvent('offersUpdated'));
            
            return newOffer;
        } catch (error) {
            console.error('Error creating offer:', error);
            // Fallback to localStorage for development
            if (window.offerStorage) {
                return window.offerStorage.addOffer(offer);
            }
            throw error;
        }
    },

    /**
     * Update an existing offer via API
     * @param {string} id - The ID of the offer to update
     * @param {Object} updatedData - The new data for the offer
     * @returns {Promise<Object>} Updated offer
     */
    updateOffer: async function (id, updatedData) {
        try {
            const response = await fetch(`/api/offers/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const updatedOffer = await response.json();
            
            // Dispatch event for real-time updates
            window.dispatchEvent(new CustomEvent('offersUpdated'));
            
            return updatedOffer;
        } catch (error) {
            console.error('Error updating offer:', error);
            // Fallback to localStorage for development
            if (window.offerStorage) {
                const success = window.offerStorage.updateOffer(id, updatedData);
                if (success) {
                    window.dispatchEvent(new CustomEvent('offersUpdated'));
                    return window.offerStorage.getOffers().find(offer => offer.id === id);
                }
            }
            throw error;
        }
    },

    /**
     * Delete an offer via API
     * @param {string} id - The ID of the offer to delete
     * @returns {Promise<boolean>} Success status
     */
    deleteOffer: async function (id) {
        try {
            const response = await fetch(`/api/offers/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Dispatch event for real-time updates
            window.dispatchEvent(new CustomEvent('offersUpdated'));
            
            return true;
        } catch (error) {
            console.error('Error deleting offer:', error);
            // Fallback to localStorage for development
            if (window.offerStorage) {
                window.offerStorage.deleteOffer(id);
                window.dispatchEvent(new CustomEvent('offersUpdated'));
                return true;
            }
            throw error;
        }
    },

    /**
     * Toggle the active status of an offer
     * @param {string} id - The ID of the offer
     * @returns {Promise<boolean>} New active status
     */
    toggleOfferStatus: async function (id) {
        try {
            // Get current offer first
            const offers = await this.getOffers();
            const offer = offers.find(o => o._id === id || o.id === id);
            
            if (!offer) {
                throw new Error('Offer not found');
            }
            
            const updatedOffer = await this.updateOffer(id, {
                active: !offer.active
            });
            
            return updatedOffer.active;
        } catch (error) {
            console.error('Error toggling offer status:', error);
            // Fallback to localStorage for development
            if (window.offerStorage) {
                return window.offerStorage.toggleOfferStatus(id);
            }
            throw error;
        }
    },

    /**
     * Get active offers only
     * @returns {Promise<Array>} List of active offers
     */
    getActiveOffers: async function () {
        try {
            const offers = await this.getOffers();
            return offers.filter(o => o.active);
        } catch (error) {
            console.error('Error fetching active offers:', error);
            return [];
        }
    },

    /**
     * Validate an offer code
     * @param {string} code - Offer code to validate
     * @returns {Promise<Object|null>} Offer object or null
     */
    validateOfferCode: async function (code) {
        try {
            const offers = await this.getActiveOffers();
            const offer = offers.find(o => 
                o.code && o.code.toLowerCase() === code.toLowerCase()
            );
            
            if (!offer) {
                return null;
            }
            
            // Check if offer is expired
            if (offer.expiryDate && new Date(offer.expiryDate) < new Date()) {
                return null;
            }
            
            return offer;
        } catch (error) {
            console.error('Error validating offer code:', error);
            return null;
        }
    },

    /**
     * Get offer by ID
     * @param {string} id - The ID of the offer
     * @returns {Promise<Object|null>} Offer object or null
     */
    getOfferById: async function (id) {
        try {
            const offers = await this.getOffers();
            return offers.find(o => (o._id === id || o.id === id)) || null;
        } catch (error) {
            console.error('Error fetching offer by ID:', error);
            return null;
        }
    }
};

// Export globally
window.offerApi = offerApi;
