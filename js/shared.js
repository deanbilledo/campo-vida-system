// Shared functionality across all pages
class CampoVidaApp {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('campoVidaCart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('campoVidaWishlist')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('campoVidaUser')) || null;
        this.userOrderCount = parseInt(localStorage.getItem('campoVidaOrderCount')) || 0;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCartCount();
        this.updateWishlistCount();
        this.updateAuthState();
        this.loadSharedComponents();
    }

    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                const menu = document.getElementById('mobileMenu');
                menu.classList.toggle('hidden');
            });
        }

        // Auth buttons
        const loginBtn = document.getElementById('loginBtn');
        const mobileLoginBtn = document.getElementById('mobileLoginBtn');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                if (this.currentUser) {
                    this.logout();
                } else {
                    this.openLoginModal();
                }
            });
        }

        if (mobileLoginBtn) {
            mobileLoginBtn.addEventListener('click', () => {
                if (this.currentUser) {
                    this.logout();
                } else {
                    this.openLoginModal();
                }
            });
        }

        // Cart buttons
        const cartBtn = document.getElementById('cartBtn');
        const mobileCartBtn = document.getElementById('mobileCartBtn');
        
        if (cartBtn) {
            cartBtn.addEventListener('click', () => this.openCartModal());
        }
        
        if (mobileCartBtn) {
            mobileCartBtn.addEventListener('click', () => this.openCartModal());
        }

        // Wishlist button
        const wishlistBtn = document.getElementById('wishlistBtn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', () => this.openWishlistModal());
        }
    }

    loadSharedComponents() {
        const sharedContainer = document.getElementById('sharedComponents');
        if (sharedContainer) {
            sharedContainer.innerHTML = `
                <!-- Login Modal -->
                <div id="loginModal" class="modal">
                    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div class="p-6">
                            <div class="flex justify-between items-center mb-6">
                                <h3 class="text-2xl font-bold text-gray-900">Login to Campo Vida</h3>
                                <button id="closeLoginModal" class="text-gray-400 hover:text-gray-600">
                                    <i class="fas fa-times w-6 h-6"></i>
                                </button>
                            </div>
                            
                            <form id="loginForm" class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input type="email" id="loginEmail" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="your@email.com" required>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input type="password" id="loginPassword" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Your password" required>
                                </div>
                                <button type="submit" class="w-full bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                                    Login
                                </button>
                            </form>
                            
                            <div class="mt-4 text-center">
                                <p class="text-sm text-gray-600">Demo accounts:</p>
                                <div class="text-xs text-gray-500 mt-2">
                                    <p>Customer: customer@demo.com / password</p>
                                    <p>Admin: admin@demo.com / admin123</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Cart Modal -->
                <div id="cartModal" class="modal">
                    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div class="p-6">
                            <div class="flex justify-between items-center mb-6">
                                <h3 class="text-2xl font-bold text-gray-900">Shopping Cart</h3>
                                <button id="closeCartModal" class="text-gray-400 hover:text-gray-600">
                                    <i class="fas fa-times w-6 h-6"></i>
                                </button>
                            </div>
                            
                            <div id="cartItems" class="space-y-4 mb-6">
                                <!-- Cart items will be populated here -->
                            </div>
                            
                            <div class="border-t pt-4">
                                <div class="flex justify-between items-center mb-4">
                                    <span class="text-lg font-semibold">Total:</span>
                                    <span id="cartTotal" class="text-2xl font-bold text-primary-600">₱0.00</span>
                                </div>
                                <button id="checkoutBtn" class="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Wishlist Modal -->
                <div id="wishlistModal" class="modal">
                    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div class="p-6">
                            <div class="flex justify-between items-center mb-6">
                                <h3 class="text-2xl font-bold text-gray-900">My Wishlist</h3>
                                <button id="closeWishlistModal" class="text-gray-400 hover:text-gray-600">
                                    <i class="fas fa-times w-6 h-6"></i>
                                </button>
                            </div>
                            
                            <div id="wishlistItems" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <!-- Wishlist items will be populated here -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Product Detail Modal -->
                <div id="productModal" class="modal">
                    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div class="p-6">
                            <div class="flex justify-between items-start mb-4">
                                <h3 id="modalTitle" class="text-2xl font-bold text-gray-900"></h3>
                                <button id="closeProductModal" class="text-gray-400 hover:text-gray-600">
                                    <i class="fas fa-times w-6 h-6"></i>
                                </button>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <img id="modalImage" src="" alt="" class="w-full h-64 object-cover rounded-lg">
                                </div>
                                
                                <div class="space-y-4">
                                    <div>
                                        <div class="flex items-center space-x-2 mb-2">
                                            <span id="modalPrice" class="text-2xl font-bold text-primary-600"></span>
                                            <span class="text-gray-500">per <span id="modalUnit">kg</span></span>
                                        </div>
                                        <p id="modalDescription" class="text-gray-600"></p>
                                        <p class="text-sm text-gray-500 mt-2">Farmer: <span id="modalFarmer"></span></p>
                                    </div>
                                    
                                    <div class="space-y-3">
                                        <div class="flex items-center space-x-3">
                                            <label class="text-sm font-medium text-gray-700">Quantity:</label>
                                            <div class="flex items-center space-x-2">
                                                <button id="decreaseQty" class="p-1 border border-gray-300 rounded hover:bg-gray-50">
                                                    <i class="fas fa-minus text-sm"></i>
                                                </button>
                                                <span id="quantity" class="px-3 py-1 border border-gray-300 rounded min-w-[50px] text-center">1</span>
                                                <button id="increaseQty" class="p-1 border border-gray-300 rounded hover:bg-gray-50">
                                                    <i class="fas fa-plus text-sm"></i>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div class="text-lg font-semibold text-gray-900">
                                            Total: ₱<span id="totalPrice">0.00</span>
                                        </div>
                                    </div>

                                    <!-- First Time Buyer Guidance -->
                                    <div id="buyerGuidance" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 hidden">
                                        <div class="flex items-start space-x-3">
                                            <i class="fas fa-info-circle text-yellow-600 mt-0.5"></i>
                                            <div>
                                                <h4 class="font-semibold text-yellow-800 mb-1">First Time Buyer Guidance</h4>
                                                <p class="text-sm text-yellow-700 mb-2">
                                                    Welcome to Campo Vida! For your first purchase, you'll need to pay online. 
                                                    After 5 successful orders, you'll unlock Cash on Delivery (COD) option.
                                                </p>
                                                <div class="text-xs text-yellow-600">
                                                    <span id="orderProgress">Orders completed: 0/5</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="space-y-2">
                                        <button id="buyNowBtn" class="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                                            Buy Now
                                        </button>
                                        <button id="addToCartBtn" class="w-full border border-primary-600 text-primary-600 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Add event listeners for modals
            this.setupModalEventListeners();
        }
    }

    setupModalEventListeners() {
        // Login modal
        const loginModal = document.getElementById('loginModal');
        const closeLoginModal = document.getElementById('closeLoginModal');
        const loginForm = document.getElementById('loginForm');

        if (closeLoginModal) {
            closeLoginModal.addEventListener('click', () => this.closeLoginModal());
        }

        if (loginModal) {
            loginModal.addEventListener('click', (e) => {
                if (e.target === loginModal) this.closeLoginModal();
            });
        }

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Cart modal
        const cartModal = document.getElementById('cartModal');
        const closeCartModal = document.getElementById('closeCartModal');
        const checkoutBtn = document.getElementById('checkoutBtn');

        if (closeCartModal) {
            closeCartModal.addEventListener('click', () => this.closeCartModal());
        }

        if (cartModal) {
            cartModal.addEventListener('click', (e) => {
                if (e.target === cartModal) this.closeCartModal();
            });
        }

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.handleCheckout());
        }

        // Wishlist modal
        const wishlistModal = document.getElementById('wishlistModal');
        const closeWishlistModal = document.getElementById('closeWishlistModal');

        if (closeWishlistModal) {
            closeWishlistModal.addEventListener('click', () => this.closeWishlistModal());
        }

        if (wishlistModal) {
            wishlistModal.addEventListener('click', (e) => {
                if (e.target === wishlistModal) this.closeWishlistModal();
            });
        }
    }

    // Authentication methods
    openLoginModal() {
        document.getElementById('loginModal').classList.add('show');
    }

    closeLoginModal() {
        document.getElementById('loginModal').classList.remove('show');
    }

    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Demo login validation
        if ((email === 'customer@demo.com' && password === 'password') ||
            (email === 'admin@demo.com' && password === 'admin123')) {
            
            this.currentUser = {
                email: email,
                name: email.split('@')[0],
                role: email.includes('admin') ? 'admin' : 'customer',
                orders: this.userOrderCount
            };

            localStorage.setItem('campoVidaUser', JSON.stringify(this.currentUser));
            this.updateAuthState();
            this.closeLoginModal();
            this.showNotification(`Welcome back, ${this.currentUser.name}!`);
        } else {
            this.showNotification('Invalid credentials. Try demo accounts.', 'error');
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('campoVidaUser');
        this.updateAuthState();
        this.showNotification('Logged out successfully');
    }

    updateAuthState() {
        const loginBtn = document.getElementById('loginBtn');
        const mobileLoginBtn = document.getElementById('mobileLoginBtn');
        
        if (this.currentUser) {
            if (loginBtn) {
                loginBtn.innerHTML = `<i class="fas fa-user-circle mr-1"></i>${this.currentUser.name}`;
            }
            if (mobileLoginBtn) {
                mobileLoginBtn.textContent = `Logout (${this.currentUser.name})`;
            }
        } else {
            if (loginBtn) {
                loginBtn.innerHTML = '<i class="fas fa-user w-5 h-5"></i>';
            }
            if (mobileLoginBtn) {
                mobileLoginBtn.textContent = 'Login';
            }
        }
    }

    // Cart methods
    openCartModal() {
        this.renderCartItems();
        document.getElementById('cartModal').classList.add('show');
    }

    closeCartModal() {
        document.getElementById('cartModal').classList.remove('show');
    }

    addToCart(product, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                unit: product.unit,
                quantity: quantity
            });
        }

        this.saveCart();
        this.updateCartCount();
        this.showNotification(`Added ${quantity} ${product.unit} of ${product.name} to cart`);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.renderCartItems();
        this.showNotification('Item removed from cart');
    }

    updateCartCount() {
        const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        const countEl = document.getElementById('cartCount');
        const mobileCountEl = document.getElementById('mobileCartCount');
        
        if (countEl) {
            countEl.textContent = count;
            if (count > 0) {
                countEl.classList.remove('opacity-0', 'scale-0');
                countEl.classList.add('opacity-100', 'scale-100');
            } else {
                countEl.classList.add('opacity-0', 'scale-0');
                countEl.classList.remove('opacity-100', 'scale-100');
            }
        }
        
        if (mobileCountEl) {
            mobileCountEl.textContent = count;
            if (count > 0) {
                mobileCountEl.classList.remove('opacity-0');
            } else {
                mobileCountEl.classList.add('opacity-0');
            }
        }
    }

    renderCartItems() {
        const container = document.getElementById('cartItems');
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        if (this.cart.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <div class="text-6xl text-gray-300 mb-4">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
                    <p class="text-gray-500">Add some fresh products to get started!</p>
                </div>
            `;
            document.getElementById('cartTotal').textContent = '₱0.00';
            return;
        }

        container.innerHTML = this.cart.map(item => `
            <div class="flex items-center space-x-4 border-b border-gray-200 pb-4">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM2YjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZTwvdGV4dD48L3N2Zz4=';">
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">${item.name}</h4>
                    <p class="text-gray-600 text-sm">₱${item.price.toFixed(2)} × ${item.quantity} ${item.unit}</p>
                </div>
                <div class="text-right">
                    <p class="font-semibold text-gray-900">₱${(item.price * item.quantity).toFixed(2)}</p>
                    <button onclick="app.removeFromCart(${item.id})" class="text-red-500 text-sm hover:text-red-700 transition-colors">
                        <i class="fas fa-trash mr-1"></i>Remove
                    </button>
                </div>
            </div>
        `).join('');

        document.getElementById('cartTotal').textContent = `₱${total.toFixed(2)}`;
    }

    handleCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty', 'error');
            return;
        }

        if (!this.currentUser) {
            this.showNotification('Please login to checkout', 'error');
            this.openLoginModal();
            return;
        }

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        if (this.userOrderCount < 5) {
            if (confirm(`Total: ₱${total.toFixed(2)}\\n\\nNote: Online payment required for ${this.userOrderCount < 1 ? 'first-time' : 'new'} buyers (${this.userOrderCount}/5 orders completed). Continue to payment?`)) {
                this.processOrder('online');
            }
        } else {
            const paymentMethod = confirm(`Total: ₱${total.toFixed(2)}\\n\\nChoose payment method:\\nOK = Online Payment\\nCancel = Cash on Delivery`);
            this.processOrder(paymentMethod ? 'online' : 'cod');
        }
    }

    processOrder(paymentMethod) {
        this.userOrderCount++;
        localStorage.setItem('campoVidaOrderCount', this.userOrderCount.toString());
        
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
        this.closeCartModal();
        
        const paymentText = paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment';
        this.showNotification(`Order placed successfully! Payment method: ${paymentText}`);
    }

    // Wishlist methods
    openWishlistModal() {
        this.renderWishlistItems();
        document.getElementById('wishlistModal').classList.add('show');
    }

    closeWishlistModal() {
        document.getElementById('wishlistModal').classList.remove('show');
    }

    toggleWishlist(productId) {
        const index = this.wishlist.indexOf(productId);
        if (index > -1) {
            this.wishlist.splice(index, 1);
            this.showNotification('Removed from wishlist');
        } else {
            this.wishlist.push(productId);
            this.showNotification('Added to wishlist');
        }
        this.updateWishlistCount();
        this.saveWishlist();
    }

    updateWishlistCount() {
        const count = this.wishlist.length;
        const countEl = document.getElementById('wishlistCount');
        
        if (countEl) {
            countEl.textContent = count;
            if (count > 0) {
                countEl.classList.remove('opacity-0', 'scale-0');
                countEl.classList.add('opacity-100', 'scale-100');
            } else {
                countEl.classList.add('opacity-0', 'scale-0');
                countEl.classList.remove('opacity-100', 'scale-100');
            }
        }
    }

    renderWishlistItems() {
        const container = document.getElementById('wishlistItems');
        
        if (this.wishlist.length === 0) {
            container.innerHTML = `
                <div class="col-span-2 text-center py-12">
                    <div class="text-6xl text-gray-300 mb-4">
                        <i class="fas fa-heart"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-600 mb-2">Your wishlist is empty</h3>
                    <p class="text-gray-500">Save products you love for later!</p>
                </div>
            `;
            return;
        }

        // This would need to be implemented with actual product data
        container.innerHTML = `
            <div class="col-span-2 text-center py-12">
                <p class="text-gray-500">Wishlist items would be displayed here</p>
            </div>
        `;
    }

    // Storage methods
    saveCart() {
        localStorage.setItem('campoVidaCart', JSON.stringify(this.cart));
    }

    saveWishlist() {
        localStorage.setItem('campoVidaWishlist', JSON.stringify(this.wishlist));
    }

    // Notification method
    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notificationText');
        
        if (notification && notificationText) {
            notificationText.textContent = message;
            
            // Update notification style based on type
            notification.className = `notification ${type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white px-6 py-3 rounded-lg shadow-lg`;
            
            notification.classList.add('show');

            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.app = new CampoVidaApp();
});
