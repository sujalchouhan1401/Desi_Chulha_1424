import sys
import re

def resolve(filepath, replacement):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace anything bounded by <<<<<<< HEAD and >>>>>>> ... commit-hash
    new_content = re.sub(r'<<<<<<< HEAD\n.*?>>>>>>> [a-f0-9]+(?:[ \t]+\S+)*\n?', replacement, content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

resolve('user/js/menu.js', 'let menuItems = [];\n')
resolve('user/pages/profile.html', '                    <div class="order-list">\n                        <!-- Orders are rendered dynamically from localStorage by profile-manager.js -->\n                    </div>\n')
resolve('user/js/home.js', '')
resolve('user/pages/combos-mobile.html', '')
resolve('user/pages/cart.html', '                    <button class="btn-checkout-full" id="btn-proceed-pay" onclick="placeOrder()">Proceed to Pay\n')

# profile-manager.js
profile_replacement = """        // Render Orders History
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
"""
resolve('user/js/profile-manager.js', profile_replacement)
print("Finished resolving conflicts.")
