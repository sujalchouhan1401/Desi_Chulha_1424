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
     * Get available menu items only
     * @returns {Promise<Array>} List of available menu items
     */
    getAvailableMenuItems: async function () {
        try {
            const items = await this.getMenuItems();
            return items.filter(item => item.available);
        } catch (error) {
            console.error('Error fetching available menu items:', error);
            return [];
        }
    },

    /**
     * Get menu items by category
     * @param {string} category - Category to filter by
     * @returns {Promise<Array>} List of menu items in category
     */
    getMenuItemsByCategory: async function (category) {
        try {
            const items = await this.getAvailableMenuItems();
            return items.filter(item => item.category === category);
        } catch (error) {
            console.error('Error fetching menu items by category:', error);
            return [];
        }
    },

    /**
     * Get bestseller menu items
     * @returns {Promise<Array>} List of bestseller items
     */
    getBestsellers: async function () {
        try {
            const items = await this.getAvailableMenuItems();
            return items.filter(item => item.bestseller);
        } catch (error) {
            console.error('Error fetching bestsellers:', error);
            return [];
        }
    },

    /**
     * Search menu items
     * @param {string} query - Search query
     * @returns {Promise<Array>} List of matching menu items
     */
    searchMenuItems: async function (query) {
        try {
            const items = await this.getAvailableMenuItems();
            const searchTerm = query.toLowerCase();
            return items.filter(item => 
                item.name.toLowerCase().includes(searchTerm)
            );
        } catch (error) {
            console.error('Error searching menu items:', error);
            return [];
        }
    },

    /**
     * Get menu item by ID
     * @param {string} id - The ID of the menu item
     * @returns {Promise<Object|null>} Menu item or null
     */
    getMenuItemById: async function (id) {
        try {
            const items = await this.getMenuItems();
            return items.find(item => (item._id === id || item.id === id)) || null;
        } catch (error) {
            console.error('Error fetching menu item by ID:', error);
            return null;
        }
    },

    /**
     * Get unique categories
     * @returns {Promise<Array>} List of unique categories
     */
    getCategories: async function () {
        try {
            const items = await this.getAvailableMenuItems();
            const categories = [...new Set(items.map(item => item.category))];
            return categories.sort();
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }
};

// Export globally
window.menuApi = menuApi;
