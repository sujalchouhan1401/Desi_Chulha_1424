/**
 * Combo API Service - Replaces localStorage with API calls
 * Handles all combo-related operations with the backend
 */
const comboApi = {
    /**
     * Get all active combos from the API
     * @returns {Promise<Array>} List of all active combos
     */
    getCombos: async function () {
        try {
            const response = await fetch('/api/combos');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const combos = await response.json();
            return combos || [];
        } catch (error) {
            console.error('Error fetching combos:', error);
            // Fallback to localStorage for development
            return window.comboStorage?.getCombos() || [];
        }
    },

    /**
     * Get combo by ID
     * @param {string} id - The ID of the combo
     * @returns {Promise<Object|null>} Combo object or null
     */
    getComboById: async function (id) {
        try {
            const combos = await this.getCombos();
            return combos.find(c => (c._id === id || c.id === id)) || null;
        } catch (error) {
            console.error('Error fetching combo by ID:', error);
            return null;
        }
    },

    /**
     * Calculate combo price with items
     * @param {Object} combo - Combo object
     * @returns {number} Total combo price
     */
    calculateComboPrice: async function (combo) {
        try {
            return combo.comboPrice || 0;
        } catch (error) {
            console.error('Error calculating combo price:', error);
            return 0;
        }
    },

    /**
     * Get combo items with details
     * @param {Object} combo - Combo object
     * @returns {Promise<Array>} List of items with details
     */
    getComboItemsWithDetails: async function (combo) {
        try {
            if (!combo.items || !Array.isArray(combo.items)) {
                return [];
            }
            
            // Return items as they come from API (already populated)
            return combo.items;
        } catch (error) {
            console.error('Error fetching combo items details:', error);
            return [];
        }
    },

    /**
     * Get combos by price range
     * @param {number} minPrice - Minimum price
     * @param {number} maxPrice - Maximum price
     * @returns {Promise<Array>} List of combos in price range
     */
    getCombosByPriceRange: async function (minPrice, maxPrice) {
        try {
            const combos = await this.getCombos();
            return combos.filter(c => 
                c.comboPrice >= minPrice && c.comboPrice <= maxPrice
            );
        } catch (error) {
            console.error('Error fetching combos by price range:', error);
            return [];
        }
    },

    /**
     * Get most popular combos (by price or custom logic)
     * @param {number} limit - Number of combos to return
     * @returns {Promise<Array>} List of popular combos
     */
    getPopularCombos: async function (limit = 5) {
        try {
            const combos = await this.getCombos();
            // Sort by comboPrice (assuming higher price = more popular)
            return combos
                .sort((a, b) => b.comboPrice - a.comboPrice)
                .slice(0, limit);
        } catch (error) {
            console.error('Error fetching popular combos:', error);
            return [];
        }
    },

    /**
     * Search combos by name
     * @param {string} query - Search query
     * @returns {Promise<Array>} List of matching combos
     */
    searchCombos: async function (query) {
        try {
            const combos = await this.getCombos();
            const searchTerm = query.toLowerCase();
            return combos.filter(combo => 
                combo.name.toLowerCase().includes(searchTerm)
            );
        } catch (error) {
            console.error('Error searching combos:', error);
            return [];
        }
    }
};

// Export globally
window.comboApi = comboApi;
