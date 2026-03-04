/**
 * Menu Storage Utility - Shared between Admin and User panels.
 * Uses localStorage to simulate a database for menu items.
 */
const menuStorage = {
    /**
     * Get all menu items from localStorage
     * @returns {Array} List of all menu items
     */
    getMenuItems: function () {
        const items = localStorage.getItem('menuItems');
        if (!items) {
            // Return empty instead of null
            return [];
        }
        return JSON.parse(items);
    },

    /**
     * Save an array of menu items to localStorage
     * @param {Array} items - The items to save
     */
    saveMenuItems: function (items) {
        localStorage.setItem('menuItems', JSON.stringify(items));
        // Dispatch local event for same-window updates
        window.dispatchEvent(new CustomEvent('menuUpdated'));
    },

    /**
     * Add a new menu item
     * @param {Object} item - The item to add
     */
    addMenuItem: function (item) {
        const items = this.getMenuItems();
        const newItem = {
            id: 'item_' + Date.now(),
            available: true, // Default to available
            bestseller: false, // Default to false
            ...item
        };
        items.push(newItem);
        this.saveMenuItems(items);
        return newItem;
    },

    /**
     * Update an existing menu item
     * @param {string} id - The ID of the item to update
     * @param {Object} updatedData - The new data for the item
     */
    updateMenuItem: function (id, updatedData) {
        const items = this.getMenuItems();
        const index = items.findIndex(i => i.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updatedData };
            this.saveMenuItems(items);
            return true;
        }
        return false;
    },

    /**
     * Delete a menu item
     * @param {string} id - The ID of the item to delete
     */
    deleteMenuItem: function (id) {
        let items = this.getMenuItems();
        items = items.filter(i => i.id !== id);
        this.saveMenuItems(items);
    },

    /**
     * Toggle the availability of a menu item
     * @param {string} id - The ID of the item
     */
    toggleAvailability: function (id) {
        const items = this.getMenuItems();
        const index = items.findIndex(i => i.id === id);
        if (index !== -1) {
            items[index].available = !items[index].available;
            this.saveMenuItems(items);
            return items[index].available;
        }
        return null;
    },

    /**
     * Toggle the bestseller status of a menu item
     * @param {string} id - The ID of the item
     */
    toggleBestseller: function (id) {
        const items = this.getMenuItems();
        const index = items.findIndex(i => i.id === id);
        if (index !== -1) {
            items[index].bestseller = !items[index].bestseller;
            this.saveMenuItems(items);
            return items[index].bestseller;
        }
        return null;
    },
    /**
     * Internal default data
     */
    DEFAULTS: [
        // Beverage
        { id: "old_seed_1", name: "Tea", category: "Beverage", price: 10, available: true, bestseller: false, isVeg: true, image: "../../images/menu/tea.jpg" },
        { id: "old_seed_2", name: "Kulhad Tea", category: "Beverage", price: 15, available: true, bestseller: true, isVeg: true, image: "../../images/menu/kulhad-tea.png" },
        { id: "old_seed_3", name: "Hot Coffee", category: "Beverage", price: 30, available: true, bestseller: false, isVeg: true, image: "../../images/menu/hot-coffee.png" },
        { id: "old_seed_4", name: "Cold Coffee", category: "Beverage", price: 50, available: true, bestseller: true, isVeg: true, image: "../../images/menu/cold-coffee.jpg" },
        { id: "old_seed_5", name: "Lassi Sweet", category: "Beverage", price: 50, available: true, bestseller: false, isVeg: true, image: "../../images/menu/lassi.png" },
        { id: "old_seed_6", name: "Lassi Salty", category: "Beverage", price: 30, available: true, bestseller: false, isVeg: true, image: "../../images/menu/lassi.png" },

        // Chaat
        { id: "old_seed_7", name: "Papadi Chaat", category: "Chaat", price: 70, available: true, bestseller: false, isVeg: true, image: "../../images/menu/papdi-chaat.jpg" },
        { id: "old_seed_8", name: "Papadi Bhalla Chaat", category: "Chaat", price: 80, available: true, bestseller: false, isVeg: true, image: "../../images/menu/papdi-bhalla-chaat.jpg" },
        { id: "old_seed_9", name: "Dahi Patasi", category: "Chaat", price: 60, available: true, bestseller: true, isVeg: true, image: "../../images/menu/dahi-patasi.jpg" },
        { id: "old_seed_10", name: "Dahi Bhalla", category: "Chaat", price: 50, available: true, bestseller: false, isVeg: true, image: "../../images/menu/dahi-bhalla.jpg" },
        { id: "old_seed_11", name: "Kaji Vada", category: "Chaat", price: 30, available: true, bestseller: false, isVeg: true, image: "../../images/menu/kaji-vada.jpg" },
        { id: "old_seed_12", name: "Raj Kachori", category: "Chaat", price: 90, available: true, bestseller: false, isVeg: true, image: "../../images/menu/raj-kachori.jpg" },
        { id: "old_seed_13", name: "Aloo Tikki Chaat", category: "Chaat", price: 60, available: true, bestseller: false, isVeg: true, image: "../../images/menu/aloo-tikki-chaat.jpg" },

        // Street Food (Indian Street Delights)
        { id: "old_seed_14", name: "Puri Bhaji", category: "Street Food", price: 60, available: true, bestseller: false, isVeg: true, image: "../../images/menu/puri-bhaji.png" },
        { id: "old_seed_15", name: "Poha", category: "Street Food", price: 40, available: true, bestseller: false, isVeg: true, image: "../../images/menu/poha.jpg" },
        { id: "old_seed_16", name: "Bhel Puri", category: "Street Food", price: 50, available: true, bestseller: false, isVeg: true, image: "../../images/menu/bhel-puri.jpg" },
        { id: "old_seed_17", name: "Pav Bhaji", category: "Street Food", price: 70, available: true, bestseller: true, isVeg: true, image: "../../images/menu/pav-bhaji.png" },
        { id: "old_seed_18", name: "Vada Pav", category: "Street Food", price: 50, available: true, bestseller: true, isVeg: true, image: "../../images/menu/vada-pav.png" },
        { id: "old_seed_19", name: "Dabeli", category: "Street Food", price: 30, available: true, bestseller: false, isVeg: true, image: "../../images/menu/dabeli.jpg" },
        { id: "old_seed_20", name: "Veg Pakoda", category: "Street Food", price: 60, available: true, bestseller: false, isVeg: true, image: "../../images/menu/veg-pakoda.jpg" },
        { id: "old_seed_21", name: "Cheela Besan", category: "Street Food", price: 40, available: true, bestseller: false, isVeg: true, image: "../../images/menu/cheela-besan.jpg" },
        { id: "old_seed_22", name: "Cheela Suji", category: "Street Food", price: 40, available: true, bestseller: false, isVeg: true, image: "../../images/menu/cheela-suji.png" },
        { id: "old_seed_23", name: "Popcorn", category: "Street Food", price: 50, available: true, bestseller: false, isVeg: true, image: "../../images/menu/popcorn.jpg" },
        { id: "old_seed_24", name: "Chole Bhature", category: "Street Food", price: 70, available: true, bestseller: true, isVeg: true, image: "../../images/menu/chole-bhature.jpg" },
        { id: "old_seed_25", name: "Samosa Chaat", category: "Street Food", price: 60, available: true, bestseller: false, isVeg: true, image: "../../images/menu/samosa-chaat.png" },
        { id: "old_seed_25b", name: "Burger", category: "Street Food", price: 80, available: true, bestseller: false, isVeg: true, image: null },
        { id: "old_seed_25c", name: "Pizza", category: "Street Food", price: 99, available: true, bestseller: false, isVeg: true, image: null },
        { id: "old_seed_26", name: "Fruit Salad", category: "Street Food", price: 120, available: true, bestseller: false, isVeg: true, image: "../../images/menu/fruit-salad.jpg" },
        { id: "old_seed_26b", name: "Fruit Salad Chaat", category: "Street Food", price: 130, available: true, bestseller: false, isVeg: true, image: null },

        // Paratha
        { id: "old_seed_27", name: "Aloo Paratha", category: "Paratha", price: 40, available: true, bestseller: true, isVeg: true, image: "../../images/menu/aloo-paratha.jpg" },
        { id: "old_seed_28", name: "Gobhi Paratha", category: "Paratha", price: 50, available: true, bestseller: false, isVeg: true, image: "../../images/menu/gobhi-paratha.jpg" },
        { id: "old_seed_29", name: "Mooli Paratha", category: "Paratha", price: 50, available: true, bestseller: false, isVeg: true, image: "../../images/menu/mooli-paratha.jpg" },
        { id: "old_seed_30", name: "Paneer Paratha", category: "Paratha", price: 60, available: true, bestseller: false, isVeg: true, image: "../../images/menu/paneer-paratha.jpg" },
        { id: "old_seed_31", name: "Paneer Mawa Paratha", category: "Paratha", price: 70, available: true, bestseller: false, isVeg: true, image: "../../images/menu/paneer-mawa-paratha.jpg" },
        { id: "old_seed_32", name: "Matar Paratha", category: "Paratha", price: 50, available: true, bestseller: false, isVeg: true, image: "../../images/menu/matar-paratha.jpg" },
        { id: "old_seed_33", name: "Plain Paratha", category: "Paratha", price: 20, available: true, bestseller: false, isVeg: true, image: "../../images/menu/plain-paratha.png" },

        // South Indian
        { id: "old_seed_34", name: "Idli Sambhar", category: "South Indian", price: 40, available: true, bestseller: false, isVeg: true, image: "../../images/menu/idli-sambhar.jpg" },
        { id: "old_seed_35", name: "Dosa Masala", category: "South Indian", price: 80, available: true, bestseller: true, isVeg: true, image: "../../images/menu/dosa-masala.jpg" },
        { id: "old_seed_36", name: "Utpam", category: "South Indian", price: 60, available: true, bestseller: false, isVeg: true, image: "../../images/menu/utpam.jpg" },
        { id: "old_seed_37", name: "Upama", category: "South Indian", price: 60, available: true, bestseller: false, isVeg: true, image: "../../images/menu/upama.jpg" },

        // Soup
        { id: "old_seed_38", name: "Tomato Soup", category: "Soup", price: 50, available: true, bestseller: false, isVeg: true, image: "../../images/menu/tomato-soup.png" },
        { id: "old_seed_39", name: "Sweetcorn Soup", category: "Soup", price: 50, available: true, bestseller: false, isVeg: true, image: "../../images/menu/sweetcorn-soup.jpg" },
        { id: "old_seed_40", name: "Hot Sure", category: "Soup", price: 50, available: true, bestseller: false, isVeg: true, image: "../../images/menu/hot-sure.jpg" },
        { id: "old_seed_41", name: "Mix Veg Soup", category: "Soup", price: 50, available: true, bestseller: false, isVeg: true, image: "../../images/menu/mix-veg-soup.jpg" },

        // Bread / Sandwich
        { id: "old_seed_42", name: "Bread Jam", category: "Bread", price: 50, available: true, bestseller: false, isVeg: true, image: "../../images/menu/bread-jam.jpg" },
        { id: "old_seed_43", name: "Bread Butter", category: "Bread", price: 30, available: true, bestseller: false, isVeg: true, image: "../../images/menu/bread-butter.jpg" },
        { id: "old_seed_44", name: "Aloo Sandwich", category: "Bread", price: 40, available: true, bestseller: false, isVeg: true, image: "../../images/menu/aloo-sandwich.png" },
        { id: "old_seed_44b", name: "Veg. Sandwich", category: "Bread", price: 50, available: true, bestseller: false, isVeg: true, image: null },
        { id: "old_seed_44c", name: "Veg Cheese Sandwich", category: "Bread", price: 60, available: true, bestseller: true, isVeg: true, image: null },

        // Quick Bites
        { id: "old_seed_45", name: "Maggi", category: "Quick Bites", price: 30, available: true, bestseller: false, isVeg: true, image: "../../images/menu/maggi.jpg" },
        { id: "old_seed_46", name: "Veg. Maggi", category: "Quick Bites", price: 40, available: true, bestseller: false, isVeg: true, image: "../../images/menu/veg-maggi.jpg" },
        { id: "old_seed_47", name: "Cheese Maggi", category: "Quick Bites", price: 60, available: true, bestseller: true, isVeg: true, image: "../../images/menu/cheese-maggi.jpg" },
        { id: "old_seed_47b", name: "Chowmein", category: "Quick Bites", price: 60, available: true, bestseller: true, isVeg: true, image: null },

        // Thali / Combos
        { id: "old_seed_48", name: "Regular thali", category: "Thali", price: 100, available: true, bestseller: false, isVeg: true, image: "../../images/menu/regular-thali.jpg" },
        { id: "old_seed_49", name: "Special Thali", category: "Thali", price: 130, available: true, bestseller: true, isVeg: true, image: "../../images/menu/special-thali.jpg" },
        { id: "old_seed_50", name: "Dal Bati (2 Pc)", category: "Thali", price: 60, available: true, bestseller: false, isVeg: true, image: "../../images/menu/dal-bati.jpg" },
        { id: "old_seed_51", name: "Dal Bati with Ghee", category: "Thali", price: 80, available: true, bestseller: false, isVeg: true, image: "../../images/menu/dal-bati-ghee.jpg" }
    ],

    /**
     * Seed initial data if storage is empty
     */
    seedData: function (initialData) {
        const data = initialData || this.DEFAULTS;
        if (this.getMenuItems().length === 0) {
            this.saveMenuItems(data);
        }
    },

    /**
     * Completely reset storage to defaults
     */
    resetToDefault: function () {
        localStorage.removeItem('menuItems');
        this.saveMenuItems(this.DEFAULTS);
        location.reload(); // Reload to reflect changes
    }
};

// Export globally
window.menuStorage = menuStorage;
