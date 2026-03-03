/**
 * ProfileManager - Handles user profile data and addresses using localStorage
 */
class ProfileManager {
    constructor() {
        this.userData = JSON.parse(localStorage.getItem('desi_user_profile')) || {
            fullName: 'Guest User',
            email: '',
            phone: localStorage.getItem('desi_user_phone') || '+91 0000000000'
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
        const saveBtn = document.querySelector('.btn-save');
        if (saveBtn && saveBtn.closest('#my-profile')) {
            saveBtn.addEventListener('click', () => this.saveUserDetails());
        }

        const addressForm = document.querySelector('#address-modal form');
        if (addressForm) {
            addressForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveAddress(addressForm);
            });
        }
    }

    saveUserDetails() {
        const nameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('email');

        if (nameInput) this.userData.fullName = nameInput.value;
        if (emailInput) this.userData.email = emailInput.value;

        localStorage.setItem('desi_user_profile', JSON.stringify(this.userData));
        this.renderProfileUI();
        alert('Profile updated successfully!');
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
            isDefault: this.addresses.length === 0 // First address is default
        };

        this.addresses.push(newAddress);
        this.persistAddresses();
        this.renderProfileUI();

        // Reset form and close modal
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
        this.addresses.forEach(addr => {
            addr.isDefault = (addr.id === id);
        });
        this.persistAddresses();
        this.renderProfileUI();
    }

    persistAddresses() {
        localStorage.setItem('desi_user_addresses', JSON.stringify(this.addresses));
    }

    renderProfileUI() {
        // Update Sidebar/Header
        const headerName = document.querySelector('.nav-profile .avatar-wrap img');
        if (headerName) {
            headerName.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.userData.fullName)}&background=F07A5D&color=fff&size=40&font-size=0.4`;
        }

        const sidebarName = document.querySelector('.user-summary h3');
        const sidebarPhone = document.querySelector('.user-summary p');
        const sidebarAvatar = document.querySelector('.user-summary img');

        if (sidebarName) sidebarName.textContent = this.userData.fullName;
        if (sidebarPhone) sidebarPhone.textContent = this.userData.phone;
        if (sidebarAvatar) {
            sidebarAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.userData.fullName)}&background=F07A5D&color=fff&size=100&font-size=0.4`;
        }

        // Update Form Fields
        const nameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');

        if (nameInput) nameInput.value = this.userData.fullName;
        if (emailInput) emailInput.value = this.userData.email;
        if (phoneInput) phoneInput.value = this.userData.phone;

        // Render Address Cards
        const addressGrid = document.querySelector('.address-grid');
        if (addressGrid) {
            // Keep the "Add New Address" button
            const addBtn = addressGrid.querySelector('.add-new-address');

            // Clear existing cards (except the button)
            const cards = addressGrid.querySelectorAll('.address-card');
            cards.forEach(card => card.remove());

            this.addresses.forEach(addr => {
                const card = document.createElement('div');
                card.className = 'address-card';
                card.innerHTML = `
                    <div class="address-tag">${addr.label}</div>
                    <h4>${this.userData.fullName}</h4>
                    <p>${addr.street}<br>${addr.city}, Rajasthan ${addr.pincode}</p>
                    <div class="address-actions" style="justify-content: space-between; align-items: center;">
                        <div style="display:flex; gap:16px;">
                            <button type="button" onclick="window.profileManager.deleteAddress(${addr.id})" class="delete-btn">Delete</button>
                        </div>
                        <label style="font-size: 13px; color: var(--text-muted); display:flex; gap:6px; cursor:pointer;">
                            <input type="radio" name="default_addr" ${addr.isDefault ? 'checked' : ''} onchange="window.profileManager.setDefaultAddress(${addr.id})"> Set as Default
                        </label>
                    </div>
                `;
                addressGrid.insertBefore(card, addBtn);
            });
        }

        // Update Cart Page Default Address
        const cartAddrDisplay = document.getElementById('addr-display');
        if (cartAddrDisplay) {
            const defaultAddr = this.addresses.find(a => a.isDefault);
            if (defaultAddr) {
                cartAddrDisplay.textContent = `${defaultAddr.street}, ${defaultAddr.city}, Rajasthan ${defaultAddr.pincode}`;
            }
        }
    }
}

// Instantiate globally
window.profileManager = new ProfileManager();
