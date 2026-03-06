# API Migration Guide: localStorage to Backend APIs

This guide shows how to gradually replace localStorage utilities with API calls.

## 📁 File Structure

### Admin Panel
```
admin/utils/
├── menuStorage.js     (Original - KEEP as reference)
├── menuApi.js         (NEW - API service)
├── orderStorage.js    (Original - KEEP as reference)
├── orderApi.js        (NEW - API service)
├── comboStorage.js    (Original - KEEP as reference)
├── comboApi.js        (NEW - API service)
├── offerStorage.js    (Original - KEEP as reference)
└── offerApi.js        (NEW - API service)
```

### User Panel
```
user/utils/
├── menuStorage.js     (Original - KEEP as reference)
├── menuApi.js         (NEW - API service)
├── orderStorage.js    (Original - KEEP as reference)
├── orderApi.js        (NEW - API service)
├── comboStorage.js    (Original - KEEP as reference)
├── comboApi.js        (NEW - API service)
├── offerStorage.js    (Original - KEEP as reference)
└── offerApi.js        (NEW - API service)
```

## 🔄 Migration Examples

### Menu Operations

**Before (localStorage):**
```javascript
// Get all menu items
const menuItems = menuStorage.getMenuItems();

// Add new item
const newItem = menuStorage.addMenuItem({
    name: "Butter Chicken",
    category: "main_course",
    price: 299,
    image: "butter-chicken.jpg"
});

// Update item
menuStorage.updateMenuItem(itemId, { available: false });

// Delete item
menuStorage.deleteMenuItem(itemId);
```

**After (API):**
```javascript
// Get all menu items
const menuItems = await menuApi.getMenuItems();

// Add new item
const newItem = await menuApi.addMenuItem({
    name: "Butter Chicken",
    category: "main_course",
    price: 299,
    image: "butter-chicken.jpg"
});

// Update item
await menuApi.updateMenuItem(itemId, { available: false });

// Delete item
await menuApi.deleteMenuItem(itemId);
```

### Order Operations

**Before (localStorage):**
```javascript
// Create order
orderStorage.addOrder({
    customerName: "John Doe",
    items: [...],
    totalAmount: 598,
    status: "pending"
});

// Get all orders
const orders = orderStorage.getOrders();

// Update status
orderStorage.updateOrderStatus(orderId, "confirmed");
```

**After (API):**
```javascript
// Create order
await orderApi.createOrder({
    userId: "user123",
    customerName: "John Doe",
    items: [...],
    totalAmount: 598,
    status: "pending"
});

// Get all orders
const orders = await orderApi.getOrders();

// Update status
await orderApi.updateOrderStatus(orderId, "confirmed");
```

### Combo Operations

**Before (localStorage):**
```javascript
// Get combos
const combos = comboStorage.getCombos();

// Add combo
comboStorage.addCombo({
    name: "Special Thali",
    items: [...],
    comboPrice: 130
});
```

**After (API):**
```javascript
// Get combos
const combos = await comboApi.getCombos();

// Add combo
await comboApi.addCombo({
    name: "Special Thali",
    items: [...],
    comboPrice: 130
});
```

### Offer Operations

**Before (localStorage):**
```javascript
// Get offers
const offers = offerStorage.getOffers();

// Validate offer
const offer = offers.find(o => o.code === "WELCOME20");
```

**After (API):**
```javascript
// Get offers
const offers = await offerApi.getOffers();

// Validate offer
const validation = await offerApi.validateAndApplyOffer("WELCOME20", 500);
if (validation.valid) {
    console.log(`Discount: ₹${validation.discountAmount}`);
}
```

## 🚀 Step-by-Step Migration

### Step 1: Include API Services
Add this script to your HTML files (after the existing storage scripts):
```html
<!-- Admin Panel -->
<script src="utils/menuApi.js"></script>
<script src="utils/orderApi.js"></script>
<script src="utils/comboApi.js"></script>
<script src="utils/offerApi.js"></script>

<!-- User Panel -->
<script src="utils/menuApi.js"></script>
<script src="utils/orderApi.js"></script>
<script src="utils/comboApi.js"></script>
<script src="utils/offerApi.js"></script>
```

### Step 2: Update Function Calls
Replace synchronous calls with async/await:

```javascript
// Before
function loadMenu() {
    const items = menuStorage.getMenuItems();
    renderMenu(items);
}

// After
async function loadMenu() {
    try {
        const items = await menuApi.getMenuItems();
        renderMenu(items);
    } catch (error) {
        console.error('Failed to load menu:', error);
        // Fallback to localStorage if needed
        const items = menuStorage.getMenuItems();
        renderMenu(items);
    }
}
```

### Step 3: Handle Loading States
Add loading indicators for async operations:

```javascript
async function loadMenu() {
    showLoadingSpinner();
    try {
        const items = await menuApi.getMenuItems();
        renderMenu(items);
    } catch (error) {
        showError('Failed to load menu items');
    } finally {
        hideLoadingSpinner();
    }
}
```

### Step 4: Error Handling
Add proper error handling:

```javascript
async function createOrder(orderData) {
    try {
        const order = await orderApi.createOrder(orderData);
        showSuccess('Order created successfully!');
        return order;
    } catch (error) {
        showError('Failed to create order: ' + error.message);
        // Optional: Fallback to localStorage
        return orderStorage.addOrder(orderData);
    }
}
```

## 🔄 Event System Compatibility

The API services maintain compatibility with the existing event system:

```javascript
// This still works with API services
window.addEventListener('menuUpdated', () => {
    console.log('Menu data updated');
    refreshMenuDisplay();
});

window.addEventListener('orderUpdated', () => {
    console.log('Order data updated');
    refreshOrderDisplay();
});
```

## 🛡️ Fallback Mechanism

All API services include automatic fallback to localStorage:

- If API call fails → Uses localStorage
- If network is down → Uses localStorage
- During development → Uses localStorage

This ensures the application works even when the backend is not available.

## 📝 Key Differences

### Data Structure Changes
- **localStorage**: Uses `id` field (string)
- **API**: Uses `_id` field (MongoDB ObjectId)

The API services handle both formats for compatibility.

### Async vs Sync
- **localStorage**: Synchronous operations
- **API**: Asynchronous operations (returns Promises)

### Error Handling
- **localStorage**: No network errors
- **API**: Must handle network errors, timeouts, etc.

## 🧪 Testing the Migration

1. **Start with read operations** (GET requests)
2. **Test with backend server running**
3. **Test with backend server stopped** (fallback mode)
4. **Gradually add write operations** (POST, PUT, DELETE)
5. **Monitor browser console for errors**

## 🎯 Recommended Migration Order

1. **Menu APIs** (Read-only first)
2. **Combo APIs** (Read-only first)
3. **Offer APIs** (Read-only first)
4. **Order APIs** (Create orders first)
5. **Admin write operations** (Update/Delete)

This gradual approach ensures your application remains functional during the migration process.
