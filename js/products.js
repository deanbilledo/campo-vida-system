// Products page specific functionality
class ProductsPage {
    constructor() {
        this.products = [
            // Vegetables
            {
                id: 1,
                name: "Fresh Organic Tomatoes",
                price: 85.00,
                category: "vegetables",
                image: "frontend/public/img/20250715_132607.jpg",
                description: "Premium organic tomatoes grown in the fertile highlands of Benguet. Rich in lycopene and perfect for salads, cooking, and sauces.",
                stock: 50,
                unit: "kg",
                farmer: "Benguet Farmers Collective"
            },
            {
                id: 2,
                name: "Organic Bell Peppers",
                price: 120.00,
                category: "vegetables",
                image: "frontend/public/img/20250715_132621.jpg",
                description: "Colorful bell peppers packed with vitamins C and A. Available in red, yellow, and green varieties.",
                stock: 30,
                unit: "kg",
                farmer: "Highland Vegetable Farms"
            },
            {
                id: 3,
                name: "Fresh Lettuce",
                price: 65.00,
                category: "vegetables",
                image: "frontend/public/img/20250715_132626.jpg",
                description: "Crisp and fresh lettuce perfect for salads. Grown using sustainable farming practices.",
                stock: 40,
                unit: "kg",
                farmer: "Green Valley Organics"
            },
            {
                id: 4,
                name: "Organic Carrots",
                price: 90.00,
                category: "vegetables",
                image: "frontend/public/img/20250715_132634.jpg",
                description: "Sweet and crunchy organic carrots. High in beta-carotene and perfect for snacking or cooking.",
                stock: 60,
                unit: "kg",
                farmer: "Mountain Harvest Co."
            },
            {
                id: 5,
                name: "Fresh Cabbage",
                price: 55.00,
                category: "vegetables",
                image: "frontend/public/img/20250715_133203.jpg",
                description: "Fresh organic cabbage perfect for stir-fries, soups, and fermentation.",
                stock: 35,
                unit: "kg",
                farmer: "Baguio Fresh Farms"
            },
            {
                id: 6,
                name: "Organic Broccoli",
                price: 150.00,
                category: "vegetables",
                image: "frontend/public/img/20250715_133213.jpg",
                description: "Nutrient-dense broccoli packed with vitamins and minerals. Perfect for healthy meals.",
                stock: 25,
                unit: "kg",
                farmer: "Cordillera Organics"
            },

            // Fruits
            {
                id: 7,
                name: "Fresh Strawberries",
                price: 200.00,
                category: "fruits",
                image: "frontend/public/img/20250709_153424.jpg",
                description: "Sweet and juicy strawberries from Baguio's cool mountain climate. Hand-picked at peak ripeness.",
                stock: 20,
                unit: "kg",
                farmer: "Strawberry Hills Farm"
            },
            {
                id: 8,
                name: "Organic Bananas",
                price: 75.00,
                category: "fruits",
                image: "frontend/public/img/20250709_153634.jpg",
                description: "Fresh organic bananas, perfectly ripe and naturally sweet. Great source of potassium.",
                stock: 80,
                unit: "kg",
                farmer: "Tropical Farms Collective"
            },
            {
                id: 9,
                name: "Fresh Apples",
                price: 180.00,
                category: "fruits",
                image: "frontend/public/img/20250709_153946.jpg",
                description: "Crisp and sweet apples from high-altitude orchards. Perfect for snacking or baking.",
                stock: 45,
                unit: "kg",
                farmer: "Mountain Apple Orchards"
            },
            {
                id: 10,
                name: "Organic Pineapple",
                price: 95.00,
                category: "fruits",
                image: "frontend/public/img/pineapple.jpg",
                description: "Sweet and tangy organic pineapples. Rich in vitamin C and digestive enzymes.",
                stock: 15,
                unit: "piece",
                farmer: "Tropical Paradise Farms"
            },

            // Herbs & Spices
            {
                id: 11,
                name: "Fresh Basil",
                price: 45.00,
                category: "herbs",
                image: "frontend/public/img/flower-1.jpg",
                description: "Aromatic basil perfect for Italian dishes, pesto, and Thai cooking.",
                stock: 25,
                unit: "bundle",
                farmer: "Herb Garden Collective"
            },
            {
                id: 12,
                name: "Organic Mint",
                price: 40.00,
                category: "herbs",
                image: "frontend/public/img/flower-2.jpg",
                description: "Fresh mint leaves perfect for teas, mojitos, and Middle Eastern cuisine.",
                stock: 30,
                unit: "bundle",
                farmer: "Fresh Herb Co."
            },
            {
                id: 13,
                name: "Organic Rosemary",
                price: 50.00,
                category: "herbs",
                image: "frontend/public/img/flower-3.jpg",
                description: "Fragrant rosemary ideal for roasted meats, potatoes, and bread baking.",
                stock: 20,
                unit: "bundle",
                farmer: "Mountain Herbs Farm"
            },
            {
                id: 14,
                name: "Fresh Cilantro",
                price: 35.00,
                category: "herbs",
                image: "frontend/public/img/flower-4.jpg",
                description: "Fresh cilantro leaves perfect for Mexican, Asian, and Indian dishes.",
                stock: 40,
                unit: "bundle",
                farmer: "Garden Fresh Herbs"
            },

            // Dairy Products
            {
                id: 15,
                name: "Farm Fresh Milk",
                price: 85.00,
                category: "dairy",
                image: "frontend/public/img/20250709_153953.jpg",
                description: "Fresh organic milk from grass-fed cows. Rich, creamy, and nutritious.",
                stock: 20,
                unit: "liter",
                farmer: "Mountain Dairy Farm"
            },
            {
                id: 16,
                name: "Organic Cheese",
                price: 350.00,
                category: "dairy",
                image: "frontend/public/img/20250709_153959.jpg",
                description: "Artisanal organic cheese made from farm-fresh milk. Available in various flavors.",
                stock: 12,
                unit: "kg",
                farmer: "Artisan Cheese Makers"
            }
        ];

        this.filteredProducts = [...this.products];
        this.currentPage = 1;
        this.productsPerPage = 8;
        this.selectedProduct = null;

        this.init();
    }

    init() {
        this.renderProducts();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('productSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                this.filteredProducts = this.products.filter(product => 
                    product.name.toLowerCase().includes(searchTerm) ||
                    product.description.toLowerCase().includes(searchTerm) ||
                    product.category.toLowerCase().includes(searchTerm) ||
                    product.farmer.toLowerCase().includes(searchTerm)
                );
                this.currentPage = 1;
                this.renderProducts();
            });
        }

        // Sort functionality
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                const sortType = e.target.value;
                this.sortProducts(sortType);
                this.renderProducts();
            });
        }

        // Category filter
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.filterProducts(category);
                
                // Update active state
                document.querySelectorAll('.category-btn').forEach(b => {
                    b.classList.remove('active', 'bg-primary-600', 'text-white');
                    b.classList.add('bg-white', 'text-gray-700', 'border-gray-200');
                });
                e.target.classList.add('active', 'bg-primary-600', 'text-white');
                e.target.classList.remove('bg-white', 'text-gray-700', 'border-gray-200');
            });
        });

        // Product modal event listeners
        this.setupProductModalListeners();
    }

    setupProductModalListeners() {
        // Close modal
        const closeBtn = document.getElementById('closeProductModal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeProductModal());
        }

        const modal = document.getElementById('productModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeProductModal();
            });
        }

        // Quantity controls
        const decreaseBtn = document.getElementById('decreaseQty');
        const increaseBtn = document.getElementById('increaseQty');

        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => {
                const qtyEl = document.getElementById('quantity');
                let qty = parseInt(qtyEl.textContent);
                if (qty > 1) {
                    qty--;
                    qtyEl.textContent = qty;
                    this.updateTotalPrice();
                }
            });
        }

        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => {
                const qtyEl = document.getElementById('quantity');
                let qty = parseInt(qtyEl.textContent);
                if (qty < this.selectedProduct.stock) {
                    qty++;
                    qtyEl.textContent = qty;
                    this.updateTotalPrice();
                }
            });
        }

        // Action buttons
        const buyNowBtn = document.getElementById('buyNowBtn');
        const addToCartBtn = document.getElementById('addToCartBtn');

        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', () => this.buyNow());
        }

        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => this.addToCart());
        }
    }

    filterProducts(category) {
        if (category === 'all') {
            this.filteredProducts = [...this.products];
        } else {
            this.filteredProducts = this.products.filter(product => product.category === category);
        }
        this.currentPage = 1;
        this.renderProducts();
    }

    sortProducts(sortType) {
        switch (sortType) {
            case 'name':
                this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'category':
                this.filteredProducts.sort((a, b) => a.category.localeCompare(b.category));
                break;
        }
    }

    renderProducts() {
        const container = document.getElementById('productsGrid');
        if (!container) return;

        if (this.filteredProducts.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="text-6xl text-gray-300 mb-4">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                    <p class="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }

        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(0, endIndex);

        container.innerHTML = productsToShow.map(product => `
            <div class="product-card bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
                <div class="relative overflow-hidden">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover transform hover:scale-110 transition-transform duration-500" 
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPiR7cHJvZHVjdC5uYW1lfTwvdGV4dD48L3N2Zz4=';">
                    <div class="absolute top-3 left-3">
                        <span class="bg-primary-600 text-white text-xs px-2 py-1 rounded-full font-medium capitalize">${product.category}</span>
                    </div>
                    <div class="absolute top-3 right-3">
                        <button onclick="app.toggleWishlist(${product.id})" class="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                            <i class="fas fa-heart ${app.wishlist.includes(product.id) ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-colors"></i>
                        </button>
                    </div>
                    ${product.stock < 10 ? '<div class="absolute bottom-3 left-3"><span class="bg-red-500 text-white text-xs px-2 py-1 rounded-full">Low Stock</span></div>' : ''}
                </div>
                <div class="p-6">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">${product.name}</h3>
                    </div>
                    <p class="text-gray-600 text-sm mb-4 line-clamp-2">${product.description}</p>
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <span class="text-2xl font-bold text-primary-600">₱${product.price.toFixed(2)}</span>
                            <span class="text-gray-500 text-sm">/${product.unit}</span>
                        </div>
                        <div class="text-right">
                            <div class="text-sm text-gray-500">Stock: ${product.stock}</div>
                            <div class="text-xs text-gray-400">${product.farmer}</div>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="productsPage.openProductModal(${product.id})" class="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                            <i class="fas fa-eye mr-2"></i>View Details
                        </button>
                        <button onclick="productsPage.quickAddToCart(${product.id})" class="px-4 py-2 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Show/hide load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            if (endIndex < this.filteredProducts.length) {
                loadMoreBtn.classList.remove('hidden');
                loadMoreBtn.onclick = () => {
                    this.currentPage++;
                    this.renderProducts();
                };
            } else {
                loadMoreBtn.classList.add('hidden');
            }
        }
    }

    openProductModal(productId) {
        this.selectedProduct = this.products.find(p => p.id === productId);
        if (!this.selectedProduct) return;

        document.getElementById('modalTitle').textContent = this.selectedProduct.name;
        document.getElementById('modalImage').src = this.selectedProduct.image;
        document.getElementById('modalImage').alt = this.selectedProduct.name;
        document.getElementById('modalPrice').textContent = `₱${this.selectedProduct.price.toFixed(2)}`;
        document.getElementById('modalUnit').textContent = this.selectedProduct.unit;
        document.getElementById('modalDescription').textContent = this.selectedProduct.description;
        document.getElementById('modalFarmer').textContent = this.selectedProduct.farmer;
        document.getElementById('quantity').textContent = '1';
        
        this.updateTotalPrice();
        this.updateBuyerGuidance();
        
        document.getElementById('productModal').classList.add('show');
    }

    closeProductModal() {
        document.getElementById('productModal').classList.remove('show');
        this.selectedProduct = null;
    }

    updateTotalPrice() {
        if (!this.selectedProduct) return;
        const qty = parseInt(document.getElementById('quantity').textContent);
        const total = this.selectedProduct.price * qty;
        document.getElementById('totalPrice').textContent = total.toFixed(2);
    }

    updateBuyerGuidance() {
        const guidanceEl = document.getElementById('buyerGuidance');
        const progressEl = document.getElementById('orderProgress');
        
        if (app.userOrderCount < 5) {
            guidanceEl.classList.remove('hidden');
            progressEl.textContent = `Orders completed: ${app.userOrderCount}/5`;
        } else {
            guidanceEl.classList.add('hidden');
        }
    }

    quickAddToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        app.addToCart(product, 1);
    }

    addToCart() {
        if (!this.selectedProduct) return;

        const qty = parseInt(document.getElementById('quantity').textContent);
        app.addToCart(this.selectedProduct, qty);
        this.closeProductModal();
    }

    buyNow() {
        if (!this.selectedProduct) return;
        
        this.addToCart();
        app.openCartModal();
    }
}

// Initialize products page
document.addEventListener('DOMContentLoaded', function() {
    window.productsPage = new ProductsPage();
});
