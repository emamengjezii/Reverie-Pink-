// Sample product data for all categories
const products = {
    makeup: [
        { id: 1, name: 'Velvet Lipstick', price: 28.99, rating: 4.8, image: '💄', category: 'makeup', featured: true },
        { id: 2, name: 'Eyeshadow Palette', price: 45.99, rating: 4.9, image: '👁️', category: 'makeup', featured: true },
        { id: 3, name: 'Mascara Pro', price: 22.99, rating: 4.7, image: '💫', category: 'makeup' },
        { id: 4, name: 'Blush Powder', price: 19.99, rating: 4.6, image: '🌸', category: 'makeup' },
        { id: 5, name: 'Foundation SPF', price: 38.99, rating: 4.8, image: '💄', category: 'makeup', featured: true },
        { id: 6, name: 'Eyeliner Liquid', price: 16.99, rating: 4.5, image: '✏️', category: 'makeup' },
    ],
    skincare: [
        { id: 7, name: 'Moisturizing Cream', price: 52.99, rating: 4.9, image: '✨', category: 'skincare', featured: true },
        { id: 8, name: 'Vitamin C Serum', price: 39.99, rating: 4.8, image: '🧪', category: 'skincare', featured: true },
        { id: 9, name: 'Face Cleanser', price: 24.99, rating: 4.7, image: '🧴', category: 'skincare' },
        { id: 10, name: 'Night Mask', price: 34.99, rating: 4.8, image: '🎭', category: 'skincare' },
        { id: 11, name: 'Sunscreen SPF 50', price: 29.99, rating: 4.6, image: '☀️', category: 'skincare', featured: true },
        { id: 12, name: 'Eye Cream', price: 45.99, rating: 4.7, image: '👁️', category: 'skincare' },
    ],
    clothing: [
        { id: 13, name: 'Silk Blouse Pink', price: 89.99, rating: 4.8, image: '👔', category: 'clothing', featured: true },
        { id: 14, name: 'Casual Tee', price: 39.99, rating: 4.6, image: '👕', category: 'clothing' },
        { id: 15, name: 'Elegant Dress', price: 149.99, rating: 4.9, image: '👗', category: 'clothing', featured: true },
        { id: 16, name: 'Denim Jeans', price: 79.99, rating: 4.7, image: '👖', category: 'clothing' },
        { id: 17, name: 'Cardigan Sweater', price: 69.99, rating: 4.8, image: '🧶', category: 'clothing', featured: true },
        { id: 18, name: 'Leather Jacket', price: 199.99, rating: 4.9, image: '🧥', category: 'clothing' },
    ],
    jewelry: [
        { id: 19, name: 'Diamond Ring', price: 299.99, rating: 5.0, image: '💎', category: 'jewelry', featured: true },
        { id: 20, name: 'Pearl Necklace', price: 129.99, rating: 4.9, image: '⛓️', category: 'jewelry', featured: true },
        { id: 21, name: 'Gold Bracelet', price: 189.99, rating: 4.8, image: '💍', category: 'jewelry' },
        { id: 22, name: 'Stud Earrings', price: 69.99, rating: 4.7, image: '💎', category: 'jewelry' },
        { id: 23, name: 'Vintage Brooch', price: 82.99, rating: 4.6, image: '✨', category: 'jewelry' },
        { id: 24, name: 'Ankle Bracelet', price: 45.99, rating: 4.5, image: '⛓️', category: 'jewelry', featured: true },
    ],
    perfumes: [
        { id: 25, name: 'Rose Garden', price: 79.99, rating: 4.9, image: '🌹', category: 'perfumes', featured: true },
        { id: 26, name: 'Lavender Dream', price: 64.99, rating: 4.8, image: '💜', category: 'perfumes', featured: true },
        { id: 27, name: 'Vanilla Bliss', price: 59.99, rating: 4.7, image: '🌸', category: 'perfumes' },
        { id: 28, name: 'Ocean Breeze', price: 69.99, rating: 4.8, image: '🌊', category: 'perfumes', featured: true },
        { id: 29, name: 'Floral Essence', price: 84.99, rating: 4.9, image: '🌺', category: 'perfumes' },
        { id: 30, name: 'Exotic Musk', price: 89.99, rating: 4.6, image: '✨', category: 'perfumes' },
    ]
};

// State management
let cart = [];
let wishlist = [];
let selectedRatings = [];
let maxPrice = 500;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
    renderAllProducts();
    renderBestSellers();
    loadCartFromStorage();
    loadWishlistFromStorage();
    updateCounts();
});

// ========== INITIALIZATION ==========
function initializeFilters() {
    const priceFilter = document.getElementById('priceFilter');
    const ratingCheckboxes = document.querySelectorAll('.rating-checkbox');

    priceFilter.addEventListener('input', (e) => {
        maxPrice = parseInt(e.target.value);
        document.getElementById('priceValue').textContent = `$${maxPrice}`;
        filterProducts();
    });

    ratingCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateRatingFilters();
            filterProducts();
        });
    });
}

function updateRatingFilters() {
    selectedRatings = Array.from(document.querySelectorAll('.rating-checkbox:checked')).map(cb => parseInt(cb.value));
}

// ========== PRODUCTS RENDERING ==========
function renderAllProducts() {
    Object.keys(products).forEach(category => {
        const gridId = `${category}Category`;
        const container = document.getElementById(gridId);
        const categoryProducts = products[category];
        container.innerHTML = categoryProducts.map(product => createProductCard(product)).join('');
        attachProductListeners(container);
    });
}

function renderBestSellers() {
    const bestSellersGrid = document.getElementById('bestSellersGrid');
    const allProducts = Object.values(products).flat();
    const bestSellers = allProducts.filter(p => p.featured);
    bestSellersGrid.innerHTML = bestSellers.map(product => createProductCard(product)).join('');
    attachProductListeners(bestSellersGrid);
}

function createProductCard(product) {
    const isInCart = cart.some(item => item.id === product.id);
    const isInWishlist = wishlist.some(item => item.id === product.id);
    
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                ${product.image}
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-rating">
                    <span class="rating-stars">${getStarRating(product.rating)}</span>
                    <span>(${product.rating})</span>
                </div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="wishlist-btn ${isInWishlist ? 'active' : ''}" onclick="toggleWishlistItem(${product.id}, event)">
                        ❤️
                    </button>
                    <button class="add-to-cart-btn ${isInCart ? 'active' : ''}" onclick="addToCart(${product.id}, event)">
                        🛒
                    </button>
                </div>
            </div>
        </div>
    `;
}

function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '⭐'.repeat(fullStars);
    if (hasHalfStar) stars += '✨';
    return stars;
}

function attachProductListeners(container) {
    const cards = container.querySelectorAll('.product-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// ========== CART FUNCTIONALITY ==========
function addToCart(productId, event) {
    event.preventDefault();
    event.stopPropagation();
    
    const allProducts = Object.values(products).flat();
    const product = allProducts.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCartToStorage();
    updateCounts();
    renderCart();
    updateProductUI();
    showNotification(`${product.name} added to cart!`);
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-message">Your cart is empty</p>';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span style="flex: 1; text-align: center; font-weight: 600;">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');

    updateCartTotal();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCartToStorage();
            renderCart();
            updateCounts();
            updateCartTotal();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCounts();
    renderCart();
    updateProductUI();
    showNotification('Item removed from cart');
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
}

// ========== WISHLIST FUNCTIONALITY ==========
function toggleWishlistItem(productId, event) {
    event.preventDefault();
    event.stopPropagation();
    
    const allProducts = Object.values(products).flat();
    const product = allProducts.find(p => p.id === productId);
    const existingItem = wishlist.find(item => item.id === productId);

    if (existingItem) {
        wishlist = wishlist.filter(item => item.id !== productId);
        showNotification(`${product.name} removed from wishlist`);
    } else {
        wishlist.push(product);
        showNotification(`${product.name} added to wishlist!`);
    }

    saveWishlistToStorage();
    updateCounts();
    renderWishlist();
    updateProductUI();
}

function renderWishlist() {
    const wishlistItemsContainer = document.getElementById('wishlistItems');
    
    if (wishlist.length === 0) {
        wishlistItemsContainer.innerHTML = '<p class="empty-message">Your wishlist is empty</p>';
        return;
    }

    wishlistItemsContainer.innerHTML = wishlist.map(item => `
        <div class="wishlist-item">
            <div class="wishlist-item-name">${item.name}</div>
            <div class="wishlist-item-price">$${item.price.toFixed(2)}</div>
            <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
                <button class="remove-btn" onclick="removeFromWishlist(${item.id})" style="flex: 1;">Remove</button>
                <button class="remove-btn" onclick="addToCart(${item.id}, event)" style="flex: 1; background-color: var(--gold); color: var(--text-black);">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function removeFromWishlist(productId) {
    wishlist = wishlist.filter(item => item.id !== productId);
    saveWishlistToStorage();
    updateCounts();
    renderWishlist();
    updateProductUI();
    showNotification('Item removed from wishlist');
}

// ========== FILTERING ==========
function filterProducts() {
    const allProducts = Object.values(products).flat();
    
    // Apply filters
    const filtered = allProducts.filter(product => {
        const priceMatch = product.price <= maxPrice;
        const ratingMatch = selectedRatings.length === 0 || selectedRatings.some(rating => product.rating >= rating);
        return priceMatch && ratingMatch;
    });

    // Update all category grids
    Object.keys(products).forEach(category => {
        const gridId = `${category}Category`;
        const container = document.getElementById(gridId);
        const categoryFiltered = filtered.filter(p => p.category === category);
        
        if (categoryFiltered.length === 0) {
            container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-black); padding: 2rem;">No products match your filters</p>';
        } else {
            container.innerHTML = categoryFiltered.map(product => createProductCard(product)).join('');
            attachProductListeners(container);
        }
    });

    // Update best sellers
    const filteredBestSellers = filtered.filter(p => p.featured);
    const bestSellersGrid = document.getElementById('bestSellersGrid');
    if (filteredBestSellers.length === 0) {
        bestSellersGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-black); padding: 2rem;">No best sellers match your filters</p>';
    } else {
        bestSellersGrid.innerHTML = filteredBestSellers.map(product => createProductCard(product)).join('');
        attachProductListeners(bestSellersGrid);
    }
}

function resetFilters() {
    document.getElementById('priceFilter').value = 500;
    document.getElementById('priceValue').textContent = '$500';
    document.querySelectorAll('.rating-checkbox').forEach(cb => cb.checked = false);
    maxPrice = 500;
    selectedRatings = [];
    renderAllProducts();
    renderBestSellers();
}

// ========== UI MANAGEMENT ==========
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    cartSidebar.classList.toggle('open');
    overlay.classList.toggle('open');
    
    if (cartSidebar.classList.contains('open')) {
        renderCart();
    }
}

function toggleWishlist() {
    const wishlistSidebar = document.getElementById('wishlistSidebar');
    const overlay = document.getElementById('overlay');
    wishlistSidebar.classList.toggle('open');
    overlay.classList.toggle('open');
    
    if (wishlistSidebar.classList.contains('open')) {
        renderWishlist();
    }
}

function closeModals() {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('wishlistSidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('open');
}

function updateCounts() {
    document.getElementById('cartCount').textContent = cart.length;
    document.getElementById('wishlistCount').textContent = wishlist.length;
}

function updateProductUI() {
    const cartIds = cart.map(item => item.id);
    const wishlistIds = wishlist.map(item => item.id);
    
    document.querySelectorAll('.product-card').forEach(card => {
        const productId = parseInt(card.dataset.productId);
        const wishlistBtn = card.querySelector('.wishlist-btn');
        const cartBtn = card.querySelector('.add-to-cart-btn');
        
        if (wishlistIds.includes(productId)) {
            wishlistBtn.classList.add('active');
        } else {
            wishlistBtn.classList.remove('active');
        }
        
        if (cartIds.includes(productId)) {
            cartBtn.classList.add('active');
        } else {
            cartBtn.classList.remove('active');
        }
    });
}

// ========== STORAGE MANAGEMENT ==========
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const saved = localStorage.getItem('cart');
    if (saved) {
        cart = JSON.parse(saved);
    }
}

function saveWishlistToStorage() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function loadWishlistFromStorage() {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
        wishlist = JSON.parse(saved);
    }
}

// ========== NOTIFICATIONS ==========
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: var(--text-black);
        color: var(--gold);
        padding: 1rem 1.5rem;
        border-radius: 8px;
        border: 2px solid var(--gold);
        font-weight: 600;
        z-index: 2000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
