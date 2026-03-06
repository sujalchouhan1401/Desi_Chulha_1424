/**
 * Offer API Service - Replaces localStorage with API calls
 * Handles all offer-related operations with the backend
 */
const offerApi = {
    /**
     * Get all active offers from the API
     * @returns {Promise<Array>} List of all active offers
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
     * Validate and apply an offer code
     * @param {string} code - Offer code to validate
     * @param {number} orderAmount - Total order amount
     * @returns {Promise<Object>} Offer details with discount
     */
    validateAndApplyOffer: async function (code, orderAmount) {
        try {
            const offers = await this.getOffers();
            const offer = offers.find(o => 
                o.code && o.code.toLowerCase() === code.toLowerCase() && o.active
            );
            
            if (!offer) {
                return {
                    valid: false,
                    error: 'Invalid offer code'
                };
            }
            
            // Check if offer is expired
            if (offer.expiryDate && new Date(offer.expiryDate) < new Date()) {
                return {
                    valid: false,
                    error: 'Offer has expired'
                };
            }
            
            // Calculate discount
            let discountAmount = 0;
            
            if (offer.discountType === 'percentage') {
                discountAmount = (orderAmount * offer.discountValue) / 100;
            } else if (offer.discountType === 'fixed') {
                discountAmount = Math.min(offer.discountValue, orderAmount);
            }
            
            const finalAmount = Math.max(0, orderAmount - discountAmount);
            
            return {
                valid: true,
                offer: offer,
                discountAmount: discountAmount,
                finalAmount: finalAmount,
                savings: discountAmount
            };
            
        } catch (error) {
            console.error('Error validating offer:', error);
            return {
                valid: false,
                error: 'Failed to validate offer'
            };
        }
    },

    /**
     * Get offer by code
     * @param {string} code - Offer code
     * @returns {Promise<Object|null>} Offer object or null
     */
    getOfferByCode: async function (code) {
        try {
            const offers = await this.getOffers();
            return offers.find(o => 
                o.code && o.code.toLowerCase() === code.toLowerCase()
            ) || null;
        } catch (error) {
            console.error('Error fetching offer by code:', error);
            return null;
        }
    },

    /**
     * Get applicable offers for order amount
     * @param {number} orderAmount - Total order amount
     * @returns {Promise<Array>} List of applicable offers
     */
    getApplicableOffers: async function (orderAmount) {
        try {
            const offers = await this.getOffers();
            return offers.filter(offer => {
                if (!offer.active) return false;
                
                // Check if offer is expired
                if (offer.expiryDate && new Date(offer.expiryDate) < new Date()) {
                    return false;
                }
                
                // All offers are applicable (no minimum order logic for now)
                return true;
            });
        } catch (error) {
            console.error('Error fetching applicable offers:', error);
            return [];
        }
    },

    /**
     * Format offer display text
     * @param {Object} offer - Offer object
     * @returns {string} Formatted offer text
     */
    formatOfferText: function (offer) {
        if (offer.discountType === 'percentage') {
            return `${offer.discountValue}% OFF`;
        } else if (offer.discountType === 'fixed') {
            return `₹${offer.discountValue} OFF`;
        }
        return offer.code;
    },

    /**
     * Get best offer for order amount
     * @param {number} orderAmount - Total order amount
     * @returns {Promise<Object|null>} Best offer or null
     */
    getBestOffer: async function (orderAmount) {
        try {
            const applicableOffers = await this.getApplicableOffers(orderAmount);
            
            if (applicableOffers.length === 0) {
                return null;
            }
            
            // Calculate discount for each offer
            const offersWithDiscount = await Promise.all(
                applicableOffers.map(async offer => {
                    const validation = await this.validateAndApplyOffer(offer.code, orderAmount);
                    return {
                        ...offer,
                        discountAmount: validation.discountAmount,
                        finalAmount: validation.finalAmount
                    };
                })
            );
            
            // Return offer with maximum discount
            return offersWithDiscount.reduce((best, current) => 
                current.discountAmount > best.discountAmount ? current : best
            );
            
        } catch (error) {
            console.error('Error fetching best offer:', error);
            return null;
        }
    }
};

// Export globally
window.offerApi = offerApi;
