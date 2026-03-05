/**
 * Combo Storage Utility - Shared between Admin and User panels.
 * Uses localStorage to store meal combos.
 */
const comboStorage = {
    /**
     * Get all combos from localStorage
     * @returns {Array} List of all combos
     */
    getCombos: function () {
        const combos = localStorage.getItem('combos');
        if (!combos) {
            return [];
        }
        return JSON.parse(combos);
    },

    /**
     * Save an array of combos to localStorage
     * @param {Array} combos - The combos to save
     */
    saveCombos: function (combos) {
        localStorage.setItem('combos', JSON.stringify(combos));
        // Dispatch event for same-window updates
        window.dispatchEvent(new CustomEvent('combosUpdated'));
    },

    /**
     * Add a new combo
     * @param {Object} combo - The combo to add
     */
    addCombo: function (combo) {
        const combos = this.getCombos();
        const newCombo = {
            id: 'combo_' + Date.now(),
            active: true,
            ...combo
        };
        combos.push(newCombo);
        this.saveCombos(combos);
        return newCombo;
    },

    /**
     * Update an existing combo
     * @param {string} id - The ID of the combo to update
     * @param {Object} updatedData - The new data for the combo
     */
    updateCombo: function (id, updatedData) {
        const combos = this.getCombos();
        const index = combos.findIndex(c => c.id === id);
        if (index !== -1) {
            combos[index] = { ...combos[index], ...updatedData };
            this.saveCombos(combos);
            return true;
        }
        return false;
    },

    /**
     * Delete a combo
     * @param {string} id - The ID of the combo to delete
     */
    deleteCombo: function (id) {
        let combos = this.getCombos();
        combos = combos.filter(c => c.id !== id);
        this.saveCombos(combos);
    },

    /**
     * Toggle the active status of a combo
     * @param {string} id - The ID of the combo
     */
    toggleComboStatus: function (id) {
        const combos = this.getCombos();
        const index = combos.findIndex(c => c.id === id);
        if (index !== -1) {
            combos[index].active = !combos[index].active;
            this.saveCombos(combos);
            return combos[index].active;
        }
        return null;
    },

    /**
     * Seed initial default combos if empty
     */
    seedData: function () {
        if (this.getCombos().length === 0 || localStorage.getItem('combos_reset_v2') !== 'true') {
            const defaults = [
                {
                    id: "combo_1",
                    name: "Regular Veg Thali",
                    category: "thali",
                    image: "../images/menu/regular-thali.jpg",
                    items: [{ name: "Roti, Chaval, Sabji, Daal", price: 140 }],
                    originalPrice: 140,
                    comboPrice: 100,
                    active: true
                },
                {
                    id: "combo_2",
                    name: "Special Thali",
                    category: "thali",
                    image: "../images/menu/special-thali.jpg",
                    items: [{ name: "Roti, Chaval, Special Sabji, Sweet, Dahi", price: 195 }],
                    originalPrice: 195,
                    comboPrice: 130,
                    active: true
                },
                {
                    id: "combo_3",
                    name: "2 Pav Bhaji + 2 Cold Coffee",
                    category: "value",
                    image: "../images/menu/pav-bhaji.png",
                    items: [{ name: "2x Amul Pav Bhaji, 2x Cold Coffee", price: 260 }],
                    originalPrice: 260,
                    comboPrice: 210,
                    active: true
                },
                {
                    id: "combo_4",
                    name: "Chole Bhature + Lassi",
                    category: "value",
                    image: "../images/menu/chole-bhature.jpg",
                    items: [{ name: "2x Chole Bhature, 2x Sweet Lassi", price: 260 }],
                    originalPrice: 260,
                    comboPrice: 210,
                    active: true
                },
                {
                    id: "combo_5",
                    name: "2 Aloo Paratha + Sabzi + Curd",
                    category: "value",
                    image: "../images/menu/aloo-paratha.jpg",
                    items: [{ name: "2x Aloo Paratha, Mix Veg, Curd", price: 160 }],
                    originalPrice: 160,
                    comboPrice: 120,
                    active: true
                },
                {
                    id: "combo_6",
                    name: "Cheese Blast Combo",
                    category: "value",
                    image: "../images/menu/maggi.jpg",
                    items: [{ name: "Cheese Maggi, Veg Cheese Sandwich", price: 130 }],
                    originalPrice: 130,
                    comboPrice: 99,
                    active: true
                },
                {
                    id: "combo_7",
                    name: "Dabeli + Chai",
                    category: "mini",
                    image: "../images/menu/dabeli.jpg",
                    items: [{ name: "Kutchi Dabeli, Masala Chai", price: 50 }],
                    originalPrice: 50,
                    comboPrice: 35,
                    active: true
                },
                {
                    id: "combo_8",
                    name: "Sandwich + Coffee",
                    category: "mini",
                    image: "../images/menu/aloo-sandwich.png",
                    items: [{ name: "Grilled Aloo Sandwich, Cold Coffee", price: 120 }],
                    originalPrice: 120,
                    comboPrice: 85,
                    active: true
                },
                {
                    id: "combo_9",
                    name: "3 Burgers + 1 Cold Coffee",
                    category: "value",
                    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop",
                    items: [{ name: "3x Veg Burgers, 1x Cold Coffee", price: 280 }],
                    originalPrice: 280,
                    comboPrice: 229,
                    active: true
                },
                {
                    id: "combo_10",
                    name: "Veg Maggi + Cold Coffee",
                    category: "mini",
                    image: "../images/menu/veg-maggi.jpg",
                    items: [{ name: "Veg Maggi, Cold Coffee", price: 100 }],
                    originalPrice: 100,
                    comboPrice: 70,
                    active: true
                }
            ];
            this.saveCombos(defaults);
            localStorage.setItem('combos_reset_v2', 'true');
        }
    }
};

window.comboStorage = comboStorage;
