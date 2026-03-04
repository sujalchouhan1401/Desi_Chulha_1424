/**
 * ProfileManager - Handles user profile data and addresses using localStorage
 */
class ProfileManager {
    constructor() {
        this.userData = JSON.parse(localStorage.getItem('desi_user_profile')) || {
            fullName: '',
            email: '',
            phone: localStorage.getItem('desi_user_phone') || '',
            deliveryAddress: '',
            profilePic: null  // base64 string or null
        };
        this.addresses = JSON.parse(localStorage.getItem('desi_user_addresses')) || [];
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.renderProfileUI();
            this.attachListeners();
        });
    }

    attachListeners() {
        // Save button
        const saveBtn = document.getElementById('save-profile-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveUserDetails());
        }

        // Profile picture upload
        const picInput = document.getElementById('profilePicInput');
        if (picInput) {
            picInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const base64 = ev.target.result;
                    this.userData.profilePic = base64;
                    // Persist immediately so other pages see it right away
                    localStorage.setItem('desi_user_profile', JSON.stringify(this.userData));
                    this.renderProfileUI();
                };
                reader.readAsDataURL(file);
            });
        }

        // Address form
        const addressForm = document.querySelector('#address-modal form');
        if (addressForm) {
            addressForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveAddress(addressForm);
            });
        }
    }

    _avatarUrl(name, size) {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=F07A5D&color=fff&size=${size || 40}&font-size=0.4`;
    }

    saveUserDetails() {
        const nameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const addrInput = document.getElementById('deliveryAddress');

        if (nameInput) this.userData.fullName = nameInput.value.trim();
        if (emailInput) this.userData.email = emailInput.value.trim();
        if (phoneInput) this.userData.phone = phoneInput.value.trim();
        if (addrInput) this.userData.deliveryAddress = addrInput.value.trim();

        localStorage.setItem('desi_user_profile', JSON.stringify(this.userData));
        this.renderProfileUI();

        // Success feedback
        const btn = document.getElementById('save-profile-btn');
        if (btn) {
            const orig = btn.textContent;
            btn.textContent = '✅ Saved!';
            btn.disabled = true;
            setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 2000);
        }
    }

    saveAddress(form) {
        const label = form.querySelector('select').value;
        const street = document.getElementById('addr-street').value;
        const city = document.getElementById('addr-city').value;
        const pincode = document.getElementById('addr-pincode').value;

        const newAddress = {
            id: Date.now(),
            label,
            street,
            city,
            pincode,
            isDefault: this.addresses.length === 0
        };

        this.addresses.push(newAddress);
        this.persistAddresses();
        this.renderProfileUI();

        form.reset();
        if (window.closeAddressModal) window.closeAddressModal();
    }

    deleteAddress(id) {
        if (confirm('Are you sure you want to delete this address?')) {
            this.addresses = this.addresses.filter(addr => addr.id !== id);
            this.persistAddresses();
            this.renderProfileUI();
        }
    }

    setDefaultAddress(id) {
        this.addresses.forEach(addr => { addr.isDefault = (addr.id === id); });
        this.persistAddresses();
        this.renderProfileUI();
    }

    persistAddresses() {
        localStorage.setItem('desi_user_addresses', JSON.stringify(this.addresses));
    }

    renderProfileUI() {
        const displayName = this.userData.fullName || 'Your Name';
        const smallPic = this.userData.profilePic || this._avatarUrl(this.userData.fullName, 40);
        const largePic = this.userData.profilePic || this._avatarUrl(this.userData.fullName, 100);

        // ── Large profile pic (profile page form preview) ──
        const formPic = document.getElementById('profile-pic-preview');
        if (formPic) formPic.src = largePic;

        // ── Sidebar avatar (profile page) ──
        const sidebarAvatar = document.querySelector('.user-summary .avatar-lg');
        if (sidebarAvatar) sidebarAvatar.src = largePic;

        // ── All nav avatars on ANY page ──
        document.querySelectorAll(
            '.nav-profile .avatar-wrap img, .header-profile-container .avatar-wrap img'
        ).forEach(img => { img.src = smallPic; });

        // ── Username span on home page nav ──
        const userNameSpan = document.querySelector('.user-name');
        if (userNameSpan) userNameSpan.textContent = displayName;

        // ── Sidebar text (profile page) ──
        const sidebarName = document.querySelector('.user-summary h3');
        const sidebarPhone = document.querySelector('.user-summary p');
        if (sidebarName) sidebarName.textContent = displayName;
        if (sidebarPhone) sidebarPhone.textContent = this.userData.phone || 'No phone saved';

        // ── Inline name preview above form pic ──
        const inlineName = document.getElementById('sidebar-name-preview');
        if (inlineName) inlineName.textContent = displayName;

        // ── Form fields ──
        const nameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const addrInput = document.getElementById('deliveryAddress');

        if (nameInput) nameInput.value = this.userData.fullName || '';
        if (emailInput) emailInput.value = this.userData.email || '';
        if (phoneInput) phoneInput.value = this.userData.phone || '';
        if (addrInput) addrInput.value = this.userData.deliveryAddress || '';

        // ── Address cards ──
        const addressGrid = document.querySelector('.address-grid');
        if (addressGrid) {
            const addBtn = addressGrid.querySelector('.add-new-address');
            addressGrid.querySelectorAll('.address-card').forEach(c => c.remove());

            this.addresses.forEach(addr => {
                const card = document.createElement('div');
                card.className = 'address-card';
                card.innerHTML = `
                    <div class="address-tag">${addr.label}</div>
                    <h4>${this.userData.fullName || 'Customer'}</h4>
                    <p>${addr.street}<br>${addr.city}, Rajasthan ${addr.pincode}</p>
                    <div class="address-actions" style="justify-content:space-between; align-items:center;">
                        <div style="display:flex; gap:16px;">
                            <button type="button" onclick="window.profileManager.deleteAddress(${addr.id})" class="delete-btn">Delete</button>
                        </div>
                        <label style="font-size:13px; color:var(--text-muted); display:flex; gap:6px; cursor:pointer;">
                            <input type="radio" name="default_addr" ${addr.isDefault ? 'checked' : ''} onchange="window.profileManager.setDefaultAddress(${addr.id})"> Set as Default
                        </label>
                    </div>
                `;
                addressGrid.insertBefore(card, addBtn);
            });
        }

        // ── Sync default delivery address to cart page if present ──
        const cartAddrDisplay = document.getElementById('addr-display');
        if (cartAddrDisplay) {
            const defaultAddr = this.addresses.find(a => a.isDefault);
            if (defaultAddr) {
                cartAddrDisplay.textContent = `${defaultAddr.street}, ${defaultAddr.city}, Rajasthan ${defaultAddr.pincode}`;
            } else if (this.userData.deliveryAddress) {
                cartAddrDisplay.textContent = this.userData.deliveryAddress;
            }
        }

        // Render Orders History
        this.renderOrders();

        // ── Rewards ──
        this.renderRewards();
    }

    renderOrders() {
        if (!window.orderStorage) return;

        const orderList = document.querySelector('.order-list');
        const emptyState = document.querySelector('.profile-section#my-orders .empty-state');
        const userId = this.userData.phone;
        const orders = window.orderStorage.getUserOrders(userId);

        if (!orderList) return;

        if (orders.length === 0) {
            orderList.innerHTML = '';
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');

        let html = '';
        orders.forEach(order => {
            const date = new Date(order.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const itemsText = order.items.map(i => `${i.quantity}x ${i.name}`).join(', ');
            const statusClass = `status-${order.status.toLowerCase()}`;

            html += `
                <div class="order-card">
                    <div class="order-info">
                        <h4>Order ${order.id}</h4>
                        <div class="order-meta">
                            <span>📅 ${date}</span>
                            <span>•</span>
                            <span>💳 ₹${order.totalAmount} (${order.orderType})</span>
                        </div>
                        <div class="order-items">
                            ${itemsText}
                        </div>
                    </div>
                    <div class="order-status-actions">
                        <span class="status-badge ${statusClass}">${this.getStatusIcon(order.status)} ${order.status}</span>
                        ${order.status === 'Pending' ? '<button class="btn-reorder" style="border-color:#F07A5D; color:#F07A5D;">Track Order</button>' : '<button class="btn-reorder">Reorder</button>'}
                    </div>
                </div>
            `;
        });

        orderList.innerHTML = html;
    }

    getStatusIcon(status) {
        switch (status) {
            case 'Pending': return '⏳';
            case 'Preparing': return '🍳';
            case 'Completed': return '✓';
            case 'Cancelled': return '✕';
            default: return '📦';
        }
    }

    renderRewards() {
        const coinsDisplay = document.getElementById('rewards-coins-display');
        const valueDisplay = document.getElementById('rewards-value-display');
        const historyEl = document.getElementById('rewards-history');
        if (!coinsDisplay) return; // not on profile page

        const totalCoins = parseInt(localStorage.getItem('desi_chulha_coins')) || 0;
        const coinHistory = JSON.parse(localStorage.getItem('desi_chulha_coin_history')) || [];

        // Update balance card
        coinsDisplay.innerHTML = `${totalCoins} <span style="font-size:18px;font-weight:500;">DC Coins</span>`;
        if (valueDisplay) valueDisplay.textContent = `₹${totalCoins}`;

        // Update history list
        if (historyEl) {
            if (coinHistory.length === 0) {
                historyEl.textContent = 'No coin history yet.';
            } else {
                historyEl.innerHTML = coinHistory.slice().reverse().map(h => `
                    <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #fdf2f0;">
                        <span>${h.label}</span>
                        <span style="font-weight:600;color:var(--primary-color);">+${h.coins} 🪙</span>
                    </div>
                `).join('');
            }
        }
    }

    earnCoins(itemTotal) {
        const earned = Math.floor(itemTotal / 10);
        if (earned <= 0) return;

        const current = parseInt(localStorage.getItem('desi_chulha_coins')) || 0;
        localStorage.setItem('desi_chulha_coins', current + earned);

        const history = JSON.parse(localStorage.getItem('desi_chulha_coin_history')) || [];
        history.push({
            label: `Order on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} (₹${itemTotal} spent)`,
            coins: earned,
            date: Date.now()
        });
        localStorage.setItem('desi_chulha_coin_history', JSON.stringify(history));
    }

    logout() {
        // Clear all user profile data
        localStorage.removeItem('desi_user_profile');
        localStorage.removeItem('desi_user_addresses');
        localStorage.removeItem('desi_user_phone');

        // Clear cart & session data
        localStorage.removeItem('desi_chulha_cart');
        localStorage.removeItem('desi_chulha_order_type');
        localStorage.removeItem('desi_chulha_promo');
        localStorage.removeItem('desi_chulha_orders');
        localStorage.removeItem('desi_chulha_coins');
        localStorage.removeItem('desi_chulha_coin_history');

        // Redirect to login/index
        window.location.href = '../../index.html';
    }
}

// Instantiate globally
window.profileManager = new ProfileManager();

// Expose logout globally so any page's logout button can call it
window.logout = function () {
    window.profileManager.logout();
};
