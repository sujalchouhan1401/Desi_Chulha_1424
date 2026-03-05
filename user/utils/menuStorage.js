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
        { id: "old_seed_1", name: "Tea", category: "Beverage", price: 10, available: true, bestseller: false, isVeg: true, image: "../images/menu/tea.jpg", description: "Ek cup jo din bana de." },
        { id: "old_seed_2", name: "Kulhad Tea", category: "Beverage", price: 15, available: true, bestseller: true, isVeg: true, image: "../images/menu/kulhad-tea.png", description: "Har ghunt mein mitti ka asli swaad." },
        { id: "old_seed_3", name: "Hot Coffee", category: "Beverage", price: 30, available: true, bestseller: false, isVeg: true, image: "../images/menu/hot-coffee.png", description: "Sip karo, stress ko skip karo." },
        { id: "old_seed_4", name: "Cold Coffee", category: "Beverage", price: 50, available: true, bestseller: true, isVeg: true, image: "../images/menu/cold-coffee.png", description: "Sip karo, heat ko beat karo." },
        { id: "old_seed_5", name: "Lassi Sweet", category: "Beverage", price: 50, available: true, bestseller: false, isVeg: true, image: "../images/menu/lassi.png", description: "Garmi ka meetha solution." },
        { id: "old_seed_6", name: "Lassi Salty", category: "Beverage", price: 30, available: true, bestseller: false, isVeg: true, image: "../images/menu/lassi.png", description: "Namak ka tadka, sukoon ka jhatka." },

        // Chaat
        { id: "old_seed_7", name: "Papadi Chaat", category: "Chaat", price: 70, available: true, bestseller: false, isVeg: true, image: "../images/menu/papdi-chaat.jpg", description: "Har bite mein chatpata dhamaka." },
        { id: "old_seed_8", name: "Papadi Bhalla Chaat", category: "Chaat", price: 80, available: true, bestseller: false, isVeg: true, image: "../images/menu/papdi-bhalla-chaat.jpg", description: "Soft bhalla, crispy papdi aur chatpata swaad ka perfect combo." },
        { id: "old_seed_9", name: "Dahi Patasi", category: "Chaat", price: 60, available: true, bestseller: true, isVeg: true, image: "../images/menu/dahi-patasi.jpg", description: "Diet kal se… aaj toh Dahi Patasi hi sahi." },
        { id: "old_seed_10", name: "Dahi Bhalla", category: "Chaat", price: 50, available: true, bestseller: false, isVeg: true, image: "../images/menu/dahi-bhalla.jpg", description: "Ek plate aur mood instantly smooth." },
        { id: "old_seed_11", name: "Kaji Vada", category: "Chaat", price: 30, available: true, bestseller: false, isVeg: true, image: "../images/menu/kaji-vada.jpg", description: "Marwadi rasoi ka mashhoor swaad – Kaji Vada lajawab." },
        { id: "old_seed_12", name: "Raj Kachori", category: "Chaat", price: 90, available: true, bestseller: false, isVeg: true, image: "../images/menu/raj-kachori.jpg", description: "Itni badi ki plate bhi soch mein pad jaye." },
        { id: "old_seed_13", name: "Aloo Tikki Chaat", category: "Chaat", price: 60, available: true, bestseller: false, isVeg: true, image: "../images/menu/aloo-tikki-chaat.jpg", description: "Ek bite aur dimaag bole – bas yahi life hai!" },
        { id: "old_seed_25", name: "Samosa Chaat", category: "Chaat", price: 60, available: true, bestseller: false, isVeg: true, image: "../images/menu/samosa-chaat.png", description: "Teen sides ka snack, par bhookh chaar guna." },
        { id: "old_seed_26", name: "Fruit Salad", category: "Chaat", price: 120, available: true, bestseller: false, isVeg: true, image: "../images/menu/fruit-salad.jpg", description: "Colorful bowl, powerful soul." },
        { id: "old_seed_26b", name: "Fruit Salad Chaat", category: "Chaat", price: 130, available: true, bestseller: false, isVeg: true, image: "../images/menu/fruit-salad-chaat.png", description: "Vitamin ka bomb, taste ka storm." },

        // Indian Street Delights
        { id: "old_seed_14", name: "Puri Bhaji", category: "Indian Street Delight", price: 60, available: true, bestseller: false, isVeg: true, image: "../images/menu/puri-bhaji.png", description: "Ek bite aur ghar wali yaad aa jaye." },
        { id: "old_seed_15", name: "Poha", category: "Indian Street Delight", price: 40, available: true, bestseller: false, isVeg: true, image: "../images/menu/poha.jpg", description: "Haldi ka rang, sehat ke sang." },
        { id: "old_seed_16", name: "Bhel Puri", category: "Indian Street Delight", price: 50, available: true, bestseller: false, isVeg: true, image: "../images/menu/bhel-puri.jpg", description: "Ek mutthi bhel, aur mood ho jaye swell." },
        { id: "old_seed_17", name: "Pav Bhaji", category: "Indian Street Delight", price: 70, available: true, bestseller: true, isVeg: true, image: "../images/menu/pav-bhaji.png", description: "Ek plate aur dil bole – aur lao!" },
        { id: "old_seed_18", name: "Vada Pav", category: "Indian Street Delight", price: 50, available: true, bestseller: true, isVeg: true, image: "../images/menu/vada-pav.png", description: "Snack itna famous ki log bhi brand ban gaye." },
        { id: "old_seed_19", name: "Dabeli", category: "Indian Street Delight", price: 30, available: true, bestseller: false, isVeg: true, image: "../images/menu/dabeli.jpg", description: "Chhoti si bun, bada sa fun." },
        { id: "old_seed_20", name: "Veg Pakoda", category: "Indian Street Delight", price: 60, available: true, bestseller: false, isVeg: true, image: "../images/menu/veg-pakoda.jpg", description: "Baarish ka official partner." },
        { id: "old_seed_21", name: "Cheela Besan", category: "Indian Street Delight", price: 40, available: true, bestseller: false, isVeg: true, image: "../images/menu/cheela-besan.jpg", description: "Jab sabziyaan bore ho jayein, tab Besan Cheela bole – side ho jao." },
        { id: "old_seed_22", name: "Cheela Suji", category: "Indian Street Delight", price: 40, available: true, bestseller: false, isVeg: true, image: "../images/menu/cheela-suji.png", description: "Sujal ka Suji Chilla – breakfast ka asli star." },
        { id: "old_seed_23", name: "Popcorn", category: "Indian Street Delight", price: 50, available: true, bestseller: false, isVeg: true, image: "../images/menu/popcorn.jpg", description: "Movie ka asli hero." },
        { id: "old_seed_24", name: "Chole Bhature", category: "Indian Street Delight", price: 70, available: true, bestseller: true, isVeg: true, image: "../images/menu/chole-bhature.jpg", description: "Itna zabardast combo, diet bole – main chali." },
        { id: "old_seed_25b", name: "Burger", category: "Indian Street Delight", price: 80, available: true, bestseller: false, isVeg: true, image: "../images/menu/burger.png", description: "Messy hands, happy heart." },
        { id: "old_seed_25c", name: "Pizza", category: "Indian Street Delight", price: 99, available: true, bestseller: false, isVeg: true, image: "../images/menu/pizza.png", description: "Ek slice mein history, har bite mein chemistry." },

        // Paratha
        { id: "old_seed_27", name: "Aloo Paratha", category: "Paratha", price: 40, available: true, bestseller: true, isVeg: true, image: "../images/menu/aloo-paratha.jpg", description: "Gym skip karo, Aloo Paratha pick karo." },
        { id: "old_seed_28", name: "Gobhi Paratha", category: "Paratha", price: 50, available: true, bestseller: false, isVeg: true, image: "../images/menu/gobhi-paratha.jpg", description: "Gobhi Paratha – healthy bhi, hearty bhi." },
        { id: "old_seed_29", name: "Mooli Paratha", category: "Paratha", price: 50, available: true, bestseller: false, isVeg: true, image: "../images/menu/mooli-paratha.jpg", description: "Mooli Paratha – khane mein royal, baad mein 'announcement' automatic." },
        { id: "old_seed_30", name: "Paneer Paratha", category: "Paratha", price: 60, available: true, bestseller: false, isVeg: true, image: "../images/menu/paneer-paratha.jpg", description: "Makhan se saja, Paneer se bhara – breakfast ka asli badshah." },
        { id: "old_seed_31", name: "Paneer Mawa Paratha", category: "Paratha", price: 70, available: true, bestseller: false, isVeg: true, image: "../images/menu/paneer-mawa-paratha.jpg", description: "Paneer Mawa Sweet Paratha – shahi mithaas ka asli swaad." },
        { id: "old_seed_32", name: "Matar Paratha", category: "Paratha", price: 50, available: true, bestseller: false, isVeg: true, image: "../images/menu/matar-paratha.jpg", description: "Hari matar ka tadka, breakfast ka dhamaka." },
        { id: "old_seed_33", name: "Plain Paratha", category: "Paratha", price: 20, available: true, bestseller: false, isVeg: true, image: "../images/menu/plain-paratha.png", description: "Plain Paratha – sabke saath set, har plate ka best friend." },

        // South Indian
        { id: "old_seed_34", name: "Idli Sambhar", category: "South Indian", price: 40, available: true, bestseller: false, isVeg: true, image: "../images/menu/idli-sambhar.jpg", description: "Soft idli, spicy sambar – perfect harmony." },
        { id: "old_seed_35", name: "Dosa Masala", category: "South Indian", price: 80, available: true, bestseller: true, isVeg: true, image: "../images/menu/dosa-masala.jpg", description: "Masala Dosa – itna patla aur crispy, bilkul uski girlfriend ke patience jaisa." },
        { id: "old_seed_36", name: "Utpam", category: "South Indian", price: 60, available: true, bestseller: false, isVeg: true, image: "../images/menu/utpam.jpg", description: "Thick, tasty aur full veggie loaded." },
        { id: "old_seed_37", name: "Upama", category: "South Indian", price: 60, available: true, bestseller: false, isVeg: true, image: "../images/menu/upama.jpg", description: "Simple ingredients, solid satisfaction." },

        // Soup
        { id: "old_seed_38", name: "Tomato Soup", category: "Soup", price: 50, available: true, bestseller: false, isVeg: true, image: "../images/menu/tomato-soup.png", description: "Italy ka tomato, India ka tadka – ek ghunt mein do countries ka tour." },
        { id: "old_seed_39", name: "Sweetcorn Soup", category: "Soup", price: 50, available: true, bestseller: false, isVeg: true, image: "../images/menu/sweetcorn-soup.jpg", description: "Har ghunt mein makke ki meethi kahani – diet bhi khush, pet bhi." },
        { id: "old_seed_40", name: "Hot Sure", category: "Soup", price: 50, available: true, bestseller: false, isVeg: true, image: "../images/menu/hot-sure.jpg", description: "Ek bowl mein do emotions – garam bhi, khatta bhi. Bilkul zindagi ki tarah." },
        { id: "old_seed_41", name: "Mix Veg Soup", category: "Soup", price: 50, available: true, bestseller: false, isVeg: true, image: "../images/menu/mix-veg-soup.jpg", description: "Sabziyon ne meeting ki, soup bana diya. Ab koi bahana nahi." },

        // Bread / Sandwich
        { id: "old_seed_42", name: "Bread Jam", category: "Bread", price: 50, available: true, bestseller: false, isVeg: true, image: "../images/menu/bread-jam.jpg", description: "Naani ka nuskha – do slices, ek dollop of sweet memories." },
        { id: "old_seed_43", name: "Bread Butter", category: "Bread", price: 30, available: true, bestseller: false, isVeg: true, image: "../images/menu/bread-butter.jpg", description: "Budget kam, taste zyada. Simplicity hi asli luxury hai." },
        { id: "old_seed_44", name: "Aloo Sandwich", category: "Bread", price: 40, available: true, bestseller: false, isVeg: true, image: "../images/menu/aloo-sandwich.png", description: "Aloo har jagah set ho jaata hai – sandwich mein bhi, dil mein bhi." },
        { id: "old_seed_44b", name: "Veg. Sandwich", category: "Bread", price: 50, available: true, bestseller: false, isVeg: true, image: "../images/menu/veg-sandwich.png", description: "Healthy dikhna ho toh haath mein sandwich lo – gym jaana optional." },
        { id: "old_seed_44c", name: "Veg Cheese Sandwich", category: "Bread", price: 60, available: true, bestseller: true, isVeg: true, image: "../images/menu/veg-cheese-sandwich.png", description: "Cheese daalo, aur life automatically warm ho jaati hai." },

        // Quick Bites
        { id: "old_seed_45", name: "Maggi", category: "Quick Bites", price: 30, available: true, bestseller: false, isVeg: true, image: "../images/menu/maggi.jpg", description: "2-minute promise, lifetime loyalty. India ka pehla crush." },
        { id: "old_seed_46", name: "Veg. Maggi", category: "Quick Bites", price: 40, available: true, bestseller: false, isVeg: true, image: "../images/menu/veg-maggi.jpg", description: "Ab sabziyaan bhi Maggi mein ghusna chahti hain – who blames them?" },
        { id: "old_seed_47", name: "Cheese Maggi", category: "Quick Bites", price: 60, available: true, bestseller: true, isVeg: true, image: "../images/menu/cheese-maggi.jpg", description: "Maggi toh star thi, cheese ne usse superstar bana diya." },
        { id: "old_seed_47b", name: "Chowmein", category: "Quick Bites", price: 60, available: true, bestseller: true, isVeg: true, image: "../images/menu/chowmein.png", description: "China se aaya, India ne apna bana liya – aur masala double kar diya." },

        // Thali / Combos
        { id: "old_seed_48", name: "Regular thali", category: "Thali", price: 100, available: true, bestseller: false, isVeg: true, image: "../images/menu/regular-thali.jpg", description: "Ghar ka khana, restaurant ka vibe – aur budget bhi set." },
        { id: "old_seed_49", name: "Special Thali", category: "Thali", price: 130, available: true, bestseller: true, isVeg: true, image: "../images/menu/special-thali.jpg", description: "Itni dishes ek plate mein, gym bol raha hai – please ruk jao." },
        { id: "old_seed_50", name: "Dal Bati (2 Pc)", category: "Thali", price: 60, available: true, bestseller: false, isVeg: true, image: "../images/menu/dal-bati.jpg", description: "Rajasthan ki shaan, 14th century ka swaad – aaj bhi dil jeet ta hai." },
        { id: "old_seed_51", name: "Dal Bati with Ghee", category: "Thali", price: 80, available: true, bestseller: false, isVeg: true, image: "../images/menu/dal-bati-ghee.jpg", description: "Ghee se naha ke aayi Dal Bati – diet waale door se hi namaskar karo." }
    ],

    /**
     * Seed initial data if storage is empty OR if image paths are outdated.
     * Uses a version key to force a one-time migration.
     */
    seedData: function (initialData) {
        const data = initialData || this.DEFAULTS;
        const CURRENT_VERSION = 'v9'; // Bump this whenever data changes
        const storedVersion = localStorage.getItem('menuItems_version');

        if (storedVersion !== CURRENT_VERSION) {
            // Version mismatch: re-seed with fresh corrected data
            this.saveMenuItems(data);
            localStorage.setItem('menuItems_version', CURRENT_VERSION);
            return;
        }

        // Normal seed: only if empty
        if (this.getMenuItems().length === 0) {
            this.saveMenuItems(data);
        }
    },

    /**
     * Completely reset storage to defaults
     */
    resetToDefault: function () {
        localStorage.removeItem('menuItems');
        localStorage.removeItem('menuItems_version');
        this.saveMenuItems(this.DEFAULTS);
        location.reload(); // Reload to reflect changes
    }
};

// Export globally
window.menuStorage = menuStorage;
