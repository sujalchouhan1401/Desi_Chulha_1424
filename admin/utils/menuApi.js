/**
 * Menu API Service - Replaces localStorage with API calls
 * Handles all menu-related operations with the backend
 */
const menuApi = {
    /**
     * Get all menu items from the API
     * @returns {Promise<Array>} List of all menu items
     */
    getMenuItems: async function () {
        try {
            const response = await fetch('/api/menu');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const items = await response.json();
            return items || [];
        } catch (error) {
            console.error('Error fetching menu items:', error);
            // Fallback to localStorage for development
            return window.menuStorage?.getMenuItems() || [];
        }
    },

    /**
     * Create a new menu item via API
     * @param {Object} item - The menu item to create
     * @returns {Promise<Object>} Created menu item
     */
    addMenuItem: async function (item) {
        try {
            const response = await fetch('/api/menu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const newItem = await response.json();
            
            // Dispatch event for same-window updates (maintains compatibility)
            window.dispatchEvent(new CustomEvent('menuUpdated'));
            
            return newItem;
        } catch (error) {
            console.error('Error creating menu item:', error);
            // Fallback to localStorage for development
            if (window.menuStorage) {
                return window.menuStorage.addMenuItem(item);
            }
            throw error;
        }
    },

    /**
     * Update an existing menu item via API
     * @param {string} id - The ID of the menu item to update
     * @param {Object} updatedData - The new data for the item
     * @returns {Promise<Object>} Updated menu item
     */
    updateMenuItem: async function (id, updatedData) {
        try {
            const response = await fetch(`/api/menu/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const updatedItem = await response.json();
            
            // Dispatch event for same-window updates
            window.dispatchEvent(new CustomEvent('menuUpdated'));
            
            return updatedItem;
        } catch (error) {
            console.error('Error updating menu item:', error);
            // Fallback to localStorage for development
            if (window.menuStorage) {
                const success = window.menuStorage.updateMenuItem(id, updatedData);
                if (success) {
                    window.dispatchEvent(new CustomEvent('menuUpdated'));
                    return window.menuStorage.getMenuItems().find(item => item.id === id);
                }
            }
            throw error;
        }
    },

    /**
     * Delete a menu item via API
     * @param {string} id - The ID of the menu item to delete
     * @returns {Promise<boolean>} Success status
     */
    deleteMenuItem: async function (id) {
        try {
            const response = await fetch(`/api/menu/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Dispatch event for same-window updates
            window.dispatchEvent(new CustomEvent('menuUpdated'));
            
            return true;
        } catch (error) {
            console.error('Error deleting menu item:', error);
            // Fallback to localStorage for development
            if (window.menuStorage) {
                window.menuStorage.deleteMenuItem(id);
                window.dispatchEvent(new CustomEvent('menuUpdated'));
                return true;
            }
            throw error;
        }
    },

    /**
     * Toggle the availability of a menu item
     * @param {string} id - The ID of the menu item
     * @returns {Promise<boolean>} New availability status
     */
    toggleAvailability: async function (id) {
        try {
            // Get current item first
            const items = await this.getMenuItems();
            const item = items.find(i => i._id === id || i.id === id);
            
            if (!item) {
                throw new Error('Menu item not found');
            }
            
            const updatedItem = await this.updateMenuItem(id, {
                available: !item.available
            });
            
            return updatedItem.available;
        } catch (error) {
            console.error('Error toggling availability:', error);
            // Fallback to localStorage for development
            if (window.menuStorage) {
                return window.menuStorage.toggleAvailability(id);
            }
            throw error;
        }
    },

    /**
     * Toggle the bestseller status of a menu item
     * @param {string} id - The ID of the menu item
     * @returns {Promise<boolean>} New bestseller status
     */
    toggleBestseller: async function (id) {
        try {
            // Get current item first
            const items = await this.getMenuItems();
            const item = items.find(i => i._id === id || i.id === id);
            
            if (!item) {
                throw new Error('Menu item not found');
            }
            
            const updatedItem = await this.updateMenuItem(id, {
                bestseller: !item.bestseller
            });
            
            return updatedItem.bestseller;
        } catch (error) {
            console.error('Error toggling bestseller:', error);
            // Fallback to localStorage for development
            if (window.menuStorage) {
                return window.menuStorage.toggleBestseller(id);
            }
            throw error;
        }
    }
};

// Export globally
window.menuApi = menuApi;
