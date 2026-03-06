/**
 * Combo API Service - Replaces localStorage with API calls
 * Handles all combo-related operations with the backend
 */
const comboApi = {
    /**
     * Get all combos from the API
     * @returns {Promise<Array>} List of all combos
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
     * Create a new combo via API
     * @param {Object} combo - The combo to create
     * @returns {Promise<Object>} Created combo
     */
    addCombo: async function (combo) {
        try {
            const response = await fetch('/api/combos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(combo)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const newCombo = await response.json();
            
            // Dispatch event for same-window updates (maintains compatibility)
            window.dispatchEvent(new CustomEvent('combosUpdated'));
            
            return newCombo;
        } catch (error) {
            console.error('Error creating combo:', error);
            // Fallback to localStorage for development
            if (window.comboStorage) {
                return window.comboStorage.addCombo(combo);
            }
            throw error;
        }
    },

    /**
     * Update an existing combo via API
     * @param {string} id - The ID of the combo to update
     * @param {Object} updatedData - The new data for the combo
     * @returns {Promise<Object>} Updated combo
     */
    updateCombo: async function (id, updatedData) {
        try {
            const response = await fetch(`/api/combos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const updatedCombo = await response.json();
            
            // Dispatch event for same-window updates
            window.dispatchEvent(new CustomEvent('combosUpdated'));
            
            return updatedCombo;
        } catch (error) {
            console.error('Error updating combo:', error);
            // Fallback to localStorage for development
            if (window.comboStorage) {
                const success = window.comboStorage.updateCombo(id, updatedData);
                if (success) {
                    window.dispatchEvent(new CustomEvent('combosUpdated'));
                    return window.comboStorage.getCombos().find(combo => combo.id === id);
                }
            }
            throw error;
        }
    },

    /**
     * Delete a combo via API
     * @param {string} id - The ID of the combo to delete
     * @returns {Promise<boolean>} Success status
     */
    deleteCombo: async function (id) {
        try {
            const response = await fetch(`/api/combos/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Dispatch event for same-window updates
            window.dispatchEvent(new CustomEvent('combosUpdated'));
            
            return true;
        } catch (error) {
            console.error('Error deleting combo:', error);
            // Fallback to localStorage for development
            if (window.comboStorage) {
                window.comboStorage.deleteCombo(id);
                window.dispatchEvent(new CustomEvent('combosUpdated'));
                return true;
            }
            throw error;
        }
    },

    /**
     * Toggle the active status of a combo
     * @param {string} id - The ID of the combo
     * @returns {Promise<boolean>} New active status
     */
    toggleComboStatus: async function (id) {
        try {
            // Get current combo first
            const combos = await this.getCombos();
            const combo = combos.find(c => c._id === id || c.id === id);
            
            if (!combo) {
                throw new Error('Combo not found');
            }
            
            const updatedCombo = await this.updateCombo(id, {
                active: !combo.active
            });
            
            return updatedCombo.active;
        } catch (error) {
            console.error('Error toggling combo status:', error);
            // Fallback to localStorage for development
            if (window.comboStorage) {
                return window.comboStorage.toggleComboStatus(id);
            }
            throw error;
        }
    },

    /**
     * Get active combos only
     * @returns {Promise<Array>} List of active combos
     */
    getActiveCombos: async function () {
        try {
            const combos = await this.getCombos();
            return combos.filter(c => c.active);
        } catch (error) {
            console.error('Error fetching active combos:', error);
            return [];
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
    }
};

// Export globally
window.comboApi = comboApi;
