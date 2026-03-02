class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('desi_chulha_cart')) || [];
        this.orderType = localStorage.getItem('desi_chulha_order_type') || 'delivery';
        this.appliedPromo = localStorage.getItem('desi_chulha_promo') || null;

        // Optional: listen to storage events to sync across tabs
        window.addEventListener('storage', (e) => {
            if (e.key === 'desi_chulha_cart') {
                this.cart = JSON.parse(e.newValue) || [];
                this.updateGlobalWidget();
                if (typeof window.renderCartPage === 'function') window.renderCartPage();
                if (typeof window.syncOrderTypeUI === 'function') window.syncOrderTypeUI();
            }
            if (e.key === 'desi_chulha_order_type') {
                this.orderType = e.newValue || 'delivery';
                if (typeof window.renderCartPage === 'function') window.renderCartPage();
                if (typeof window.syncOrderTypeUI === 'function') window.syncOrderTypeUI();
            }
            if (e.key === 'desi_chulha_promo') {
                this.appliedPromo = e.newValue;
                if (typeof window.renderCartPage === 'function') window.renderCartPage();
            }
        });
    }

    saveCart() {
        localStorage.setItem('desi_chulha_cart', JSON.stringify(this.cart));
        this.updateGlobalWidget();
    }

    setOrderType(type) {
        this.orderType = type;
        localStorage.setItem('desi_chulha_order_type', type);
        // Notify local listeners
        if (typeof window.renderCartPage === 'function') {
            window.renderCartPage();
        }
        if (typeof window.syncOrderTypeUI === 'function') {
            window.syncOrderTypeUI();
        }
    }

    getOrderType() {
        return this.orderType;
    }

    addItem(item) {
        // item = { id, name, price, isVeg }
        // Ensure id exists, fallback to name-based id if missing
        const itemId = item.id || 'item-' + item.name.toLowerCase().replace(/\s+/g, '-');

        const existingItem = this.cart.find(i => i.id === itemId);
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            this.cart.push({
                ...item,
                id: itemId,
                qty: 1
            });
        }
        this.saveCart();
    }

    removeItem(itemId) {
        this.cart = this.cart.filter(i => i.id !== itemId);
        this.saveCart();
    }

    updateQuantity(itemId, action) {
        const existingItem = this.cart.find(i => i.id === itemId);
        if (existingItem) {
            if (action === 'increment') {
                existingItem.qty += 1;
            } else if (action === 'decrement') {
                existingItem.qty -= 1;
                if (existingItem.qty <= 0) {
                    this.removeItem(itemId);
                    return;
                }
            }
            this.saveCart();
        }
    }

    getCart() {
        return this.cart;
    }

    getTotals() {
        const itemTotal = this.cart.reduce((total, item) => total + (item.price * item.qty), 0);
        const itemCount = this.cart.reduce((total, item) => total + item.qty, 0);

        let discount = 0;
        if (this.appliedPromo === 'sujal1401') {
            discount = Math.floor(itemTotal * 0.2);
        }

        return { itemTotal, itemCount, discount, promo: this.appliedPromo };
    }

    applyPromoCode(code) {
        if (code.toUpperCase() === 'SUJAL1401') {
            this.appliedPromo = 'sujal1401';
            localStorage.setItem('desi_chulha_promo', 'sujal1401');
            if (typeof window.renderCartPage === 'function') window.renderCartPage();
            return { success: true, message: 'Promo code sujal1401 applied! Enjoy 20% off.' };
        }
        return { success: false, message: 'Invalid promo code.' };
    }

    removePromoCode() {
        this.appliedPromo = null;
        localStorage.removeItem('desi_chulha_promo');
        if (typeof window.renderCartPage === 'function') window.renderCartPage();
    }

    clearCart() {
        this.cart = [];
        this.appliedPromo = null;
        localStorage.removeItem('desi_chulha_promo');
        this.saveCart();
    }

    updateGlobalWidget() {
        const cartWidget = document.getElementById("desktop-cart-widget");
        if (!cartWidget) return;

        const cartTotalEl = document.getElementById("widget-total");
        const cartCountEl = cartWidget.querySelector(".item-count");
        const totals = this.getTotals();

        if (totals.itemCount > 0) {
            cartCountEl.textContent = totals.itemCount;
            if (cartTotalEl) cartTotalEl.textContent = `₹${totals.itemTotal}`;

            cartWidget.classList.remove("hidden");
        } else {
            cartWidget.classList.add("hidden");
        }
    }
}

// Instantiate globally
window.cartManager = new CartManager();

document.addEventListener('DOMContentLoaded', () => {
    // Initialize widget on load
    window.cartManager.updateGlobalWidget();

    // Hook up checkout button in widget if it exists
    const widgetCheckoutBtn = document.querySelector('#desktop-cart-widget .btn-checkout-full');
    if (widgetCheckoutBtn) {
        // If not already explicitly linked in HTML
        if (!widgetCheckoutBtn.hasAttribute('onclick')) {
            widgetCheckoutBtn.addEventListener('click', () => {
                window.location.href = 'cart.html';
            });
        }
    }
});
