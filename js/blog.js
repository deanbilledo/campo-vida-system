// Blog page functionality
class BlogPage {
    constructor() {
        this.posts = [
            {
                id: 1,
                title: "The Future of Sustainable Farming in Benguet",
                slug: "sustainable-farming-benguet",
                category: "sustainability",
                author: "Maria Santos",
                authorRole: "Head of Sustainability",
                date: "2025-08-08",
                readTime: "8 min read",
                featured: true,
                image: "frontend/public/img/view-1.jpg",
                excerpt: "Explore how our partner farmers are leading the way in environmental stewardship and organic practices that protect our mountain ecosystems.",
                content: `
                    <p>The mountainous region of Benguet has long been known as the salad bowl of the Philippines, but today's farmers are revolutionizing how we think about sustainable agriculture in this crucial growing region.</p>
                    
                    <h3>Climate-Smart Agriculture</h3>
                    <p>Our partner farmers are implementing climate-smart agricultural practices that not only increase yields but also build resilience against changing weather patterns. These include:</p>
                    <ul>
                        <li>Crop rotation systems that improve soil health</li>
                        <li>Water-efficient irrigation techniques</li>
                        <li>Natural pest management using beneficial insects</li>
                        <li>Composting systems that reduce waste and improve nutrition</li>
                    </ul>
                    
                    <h3>Community Impact</h3>
                    <p>The shift to sustainable farming has created a ripple effect throughout local communities. Farmers report not only improved crop quality but also better economic stability and environmental health.</p>
                    
                    <p>As we look to the future, Campo Vida remains committed to supporting these innovative farmers who are proving that sustainable agriculture is not just possible—it's profitable and essential for our planet's future.</p>
                `,
                tags: ["sustainability", "climate", "benguet", "organic"],
                views: 1250,
                likes: 89
            },
            {
                id: 2,
                title: "What's Fresh This Season: August Harvest Guide",
                slug: "seasonal-produce-august",
                category: "farming",
                author: "Juan dela Cruz",
                authorRole: "Farm Manager",
                date: "2025-08-05",
                readTime: "5 min read",
                featured: false,
                image: "frontend/public/img/20250715_132607.jpg",
                excerpt: "Discover the best seasonal produce available now and learn how to make the most of winter harvests in the Philippines.",
                content: `
                    <p>August brings a wonderful variety of fresh produce from our partner farms. Here's what's at peak flavor this month:</p>
                    
                    <h3>Peak Season Vegetables</h3>
                    <ul>
                        <li><strong>Leafy Greens:</strong> Lettuce, spinach, and kale are thriving in the cool mountain air</li>
                        <li><strong>Root Vegetables:</strong> Carrots, radishes, and turnips are sweet and crisp</li>
                        <li><strong>Brassicas:</strong> Cabbage, broccoli, and cauliflower are at their best</li>
                        <li><strong>Herbs:</strong> Fresh parsley, cilantro, and basil are abundant</li>
                    </ul>
                    
                    <h3>Storage Tips</h3>
                    <p>To get the most from your fresh produce:</p>
                    <ul>
                        <li>Store leafy greens in perforated bags in the refrigerator</li>
                        <li>Keep root vegetables in a cool, dark place</li>
                        <li>Use herbs within a week for best flavor</li>
                    </ul>
                    
                    <h3>Recipe Ideas</h3>
                    <p>Try our farm-fresh salad combinations or hearty winter soups that showcase these seasonal flavors.</p>
                `,
                tags: ["seasonal", "harvest", "vegetables", "storage"],
                views: 892,
                likes: 67
            },
            {
                id: 3,
                title: "Meet Farmer Juan: Three Generations of Organic Farming",
                slug: "farmer-juan-story",
                category: "community",
                author: "Ana Rodriguez",
                authorRole: "Community Relations",
                date: "2025-08-02",
                readTime: "6 min read",
                featured: false,
                image: "frontend/public/img/partners.jpg",
                excerpt: "Learn about the dedication and passion behind our produce from one of our longtime farming partners and his family's legacy.",
                content: `
                    <p>In the misty mountains of Benguet, Juan Flores tends to the same soil his grandfather once farmed. But today's methods blend traditional wisdom with modern organic techniques.</p>
                    
                    <h3>A Family Legacy</h3>
                    <p>"My grandfather taught me to read the land," Juan explains as he walks through rows of vibrant lettuce. "But we've learned new ways to work with nature, not against it."</p>
                    
                    <p>The Flores farm has been organic since Juan's father made the transition thirty years ago. "It wasn't easy at first," Juan recalls. "But we saw how much healthier our soil became, how much better our vegetables tasted."</p>
                    
                    <h3>Modern Organic Methods</h3>
                    <p>Today, Juan implements cutting-edge organic farming techniques:</p>
                    <ul>
                        <li>Companion planting to naturally repel pests</li>
                        <li>Beneficial insect habitats throughout the farm</li>
                        <li>Composting systems that turn kitchen scraps into black gold</li>
                        <li>Water conservation through strategic mulching</li>
                    </ul>
                    
                    <h3>Looking Forward</h3>
                    <p>"My son is studying agricultural engineering," Juan says with pride. "He'll bring the fourth generation of knowledge to this land. Each generation learns from the last while finding new ways to improve."</p>
                `,
                tags: ["farmer-story", "family", "tradition", "organic"],
                views: 1456,
                likes: 134
            },
            {
                id: 4,
                title: "Farm-to-Table Vegetable Stir-Fry Recipe",
                slug: "vegetable-stir-fry-recipe",
                category: "recipes",
                author: "Chef Elena Morales",
                authorRole: "Guest Chef",
                date: "2025-07-30",
                readTime: "4 min read",
                featured: false,
                image: "frontend/public/img/20250715_132621.jpg",
                excerpt: "A simple, delicious recipe that showcases the natural flavors of fresh, organic vegetables straight from Campo Vida farms.",
                content: `
                    <p>This colorful stir-fry celebrates the pure flavors of fresh vegetables. The key is high heat, quick cooking, and minimal seasoning to let the vegetables shine.</p>
                    
                    <h3>Ingredients (Serves 4)</h3>
                    <ul>
                        <li>2 cups mixed fresh vegetables (broccoli, carrots, bell peppers)</li>
                        <li>1 cup leafy greens (bok choy or spinach)</li>
                        <li>2 cloves garlic, minced</li>
                        <li>1 inch ginger, sliced thin</li>
                        <li>2 tbsp organic coconut oil</li>
                        <li>2 tbsp soy sauce</li>
                        <li>1 tsp sesame oil</li>
                        <li>Green onions for garnish</li>
                    </ul>
                    
                    <h3>Instructions</h3>
                    <ol>
                        <li>Heat coconut oil in a large wok or skillet over high heat</li>
                        <li>Add garlic and ginger, stir-fry for 30 seconds</li>
                        <li>Add harder vegetables first (carrots, broccoli), cook 2-3 minutes</li>
                        <li>Add softer vegetables (peppers), cook 1-2 minutes</li>
                        <li>Add leafy greens last, cook until just wilted</li>
                        <li>Season with soy sauce and sesame oil</li>
                        <li>Garnish with green onions and serve immediately</li>
                    </ol>
                    
                    <h3>Chef's Tips</h3>
                    <p>The secret to great stir-fry is preparation. Have all ingredients cut and ready before you start cooking. The process moves quickly once the wok gets hot!</p>
                `,
                tags: ["recipe", "vegetables", "cooking", "healthy"],
                views: 2103,
                likes: 156
            },
            {
                id: 5,
                title: "Building Healthy Soil: The Foundation of Organic Farming",
                slug: "healthy-soil-organic-farming",
                category: "farming",
                author: "Dr. Robert Kim",
                authorRole: "Soil Scientist",
                date: "2025-07-28",
                readTime: "7 min read",
                featured: false,
                image: "frontend/public/img/path-1.jpg",
                excerpt: "Understanding soil health is crucial for successful organic farming. Learn the science behind building and maintaining nutrient-rich soil.",
                content: `
                    <p>Healthy soil is the foundation of all successful organic farming. It's a complex ecosystem teeming with billions of microorganisms that work together to support plant growth.</p>
                    
                    <h3>What Makes Soil Healthy?</h3>
                    <p>Healthy soil has several key characteristics:</p>
                    <ul>
                        <li><strong>Rich organic matter:</strong> 3-5% organic content supports microbial life</li>
                        <li><strong>Good structure:</strong> Allows for proper water infiltration and root penetration</li>
                        <li><strong>Balanced pH:</strong> Most vegetables prefer slightly acidic to neutral soil (6.0-7.0)</li>
                        <li><strong>Diverse microbiology:</strong> Bacteria, fungi, and other microorganisms cycling nutrients</li>
                    </ul>
                    
                    <h3>Building Soil Health</h3>
                    <p>Organic farmers use several techniques to improve soil:</p>
                    <ul>
                        <li><strong>Composting:</strong> Adds organic matter and beneficial microorganisms</li>
                        <li><strong>Cover crops:</strong> Protect and feed the soil between growing seasons</li>
                        <li><strong>Crop rotation:</strong> Prevents disease buildup and maintains nutrient balance</li>
                        <li><strong>Minimal tillage:</strong> Preserves soil structure and microbial networks</li>
                    </ul>
                    
                    <h3>Testing Your Soil</h3>
                    <p>Regular soil testing helps farmers understand what their soil needs. Tests should include pH, nutrient levels, and organic matter content.</p>
                    
                    <p>Remember: healthy soil produces healthy plants, which produce nutritious food. It's an investment that pays dividends for years to come.</p>
                `,
                tags: ["soil-health", "science", "composting", "testing"],
                views: 743,
                likes: 92
            },
            {
                id: 6,
                title: "Zero-Waste Kitchen: Making the Most of Your Vegetables",
                slug: "zero-waste-kitchen-vegetables",
                category: "tips",
                author: "Lisa Chen",
                authorRole: "Sustainability Coordinator",
                date: "2025-07-25",
                readTime: "5 min read",
                featured: false,
                image: "frontend/public/img/20250715_133203.jpg",
                excerpt: "Learn practical tips for reducing food waste and making the most of every part of your fresh vegetables.",
                content: `
                    <p>Food waste is a significant environmental issue, but with a few simple techniques, you can use every part of your fresh vegetables and reduce waste in your kitchen.</p>
                    
                    <h3>Don't Throw Away These Parts!</h3>
                    <ul>
                        <li><strong>Vegetable scraps:</strong> Onion skins, carrot tops, and herb stems make excellent vegetable stock</li>
                        <li><strong>Broccoli stems:</strong> Peel and slice for stir-fries or soups</li>
                        <li><strong>Radish leaves:</strong> Sauté like spinach or add to salads</li>
                        <li><strong>Beet greens:</strong> Delicious when sautéed with garlic</li>
                        <li><strong>Cauliflower leaves:</strong> Roast them like kale chips</li>
                    </ul>
                    
                    <h3>Storage Tips to Extend Freshness</h3>
                    <ul>
                        <li>Store herbs in water like flowers</li>
                        <li>Wrap leafy greens in damp paper towels</li>
                        <li>Keep onions and potatoes separate (they spoil each other faster)</li>
                        <li>Freeze vegetable scraps for future stock-making</li>
                    </ul>
                    
                    <h3>Creative Uses for Overripe Vegetables</h3>
                    <ul>
                        <li>Blend into smoothies</li>
                        <li>Make vegetable soups</li>
                        <li>Dehydrate into chips</li>
                        <li>Add to compost for next season's garden</li>
                    </ul>
                    
                    <p>By implementing these zero-waste practices, you'll save money, reduce environmental impact, and discover new flavors you might have been throwing away!</p>
                `,
                tags: ["zero-waste", "kitchen-tips", "sustainability", "storage"],
                views: 1234,
                likes: 178
            },
            {
                id: 7,
                title: "Seasonal Eating: Why It Matters for Your Health",
                slug: "seasonal-eating-health-benefits",
                category: "tips",
                author: "Dr. Sarah Martinez",
                authorRole: "Nutritionist",
                date: "2025-07-22",
                readTime: "6 min read",
                featured: false,
                image: "frontend/public/img/flower-1.jpg",
                excerpt: "Discover the health and environmental benefits of eating seasonally and how to plan meals around fresh, local produce.",
                content: `
                    <p>Eating seasonally means choosing fruits and vegetables that are naturally harvested during the current season in your local area. This practice offers numerous benefits for your health, wallet, and the environment.</p>
                    
                    <h3>Health Benefits of Seasonal Eating</h3>
                    <ul>
                        <li><strong>Peak nutrition:</strong> Seasonal produce is harvested at optimal ripeness, meaning maximum vitamin and mineral content</li>
                        <li><strong>Better taste:</strong> Fresh, local produce simply tastes better than shipped alternatives</li>
                        <li><strong>Natural variety:</strong> Seasonal eating encourages dietary diversity throughout the year</li>
                        <li><strong>Body alignment:</strong> Seasonal foods often provide what our bodies need during that time of year</li>
                    </ul>
                    
                    <h3>Environmental Impact</h3>
                    <p>Choosing seasonal, local produce:</p>
                    <ul>
                        <li>Reduces transportation emissions</li>
                        <li>Supports local agricultural communities</li>
                        <li>Reduces packaging waste</li>
                        <li>Promotes biodiversity in farming</li>
                    </ul>
                    
                    <h3>Getting Started with Seasonal Eating</h3>
                    <ol>
                        <li>Visit local farmers markets to see what's in season</li>
                        <li>Plan meals around seasonal availability</li>
                        <li>Learn to preserve seasonal abundance (freezing, pickling, dehydrating)</li>
                        <li>Try new vegetables you've never cooked before</li>
                        <li>Connect with local farms for seasonal CSA boxes</li>
                    </ol>
                    
                    <p>Start small by incorporating one seasonal ingredient into each meal. You'll be amazed at how much more vibrant and flavorful your cooking becomes!</p>
                `,
                tags: ["seasonal-eating", "nutrition", "health", "local"],
                views: 987,
                likes: 143
            },
            {
                id: 8,
                title: "Companion Planting: Nature's Pest Control",
                slug: "companion-planting-pest-control",
                category: "farming",
                author: "Miguel Santos",
                authorRole: "Farm Consultant",
                date: "2025-07-20",
                readTime: "8 min read",
                featured: false,
                image: "frontend/public/img/flower-3.jpg",
                excerpt: "Learn how strategic plant combinations can naturally deter pests, improve soil health, and increase yields in organic farming.",
                content: `
                    <p>Companion planting is an age-old farming technique that uses the natural relationships between plants to create healthier, more productive gardens without synthetic pesticides.</p>
                    
                    <h3>How Companion Planting Works</h3>
                    <p>Plants can help each other in several ways:</p>
                    <ul>
                        <li><strong>Pest deterrence:</strong> Some plants emit scents that repel harmful insects</li>
                        <li><strong>Beneficial insects:</strong> Flowering plants attract pollinators and predatory insects</li>
                        <li><strong>Soil improvement:</strong> Legumes fix nitrogen, benefiting neighboring plants</li>
                        <li><strong>Space optimization:</strong> Tall and short plants can share growing space efficiently</li>
                    </ul>
                    
                    <h3>Classic Companion Plant Combinations</h3>
                    <ul>
                        <li><strong>Tomatoes + Basil:</strong> Basil repels aphids and may improve tomato flavor</li>
                        <li><strong>Carrots + Chives:</strong> Chives deter carrot flies</li>
                        <li><strong>Lettuce + Marigolds:</strong> Marigolds repel various garden pests</li>
                        <li><strong>Beans + Corn:</strong> Beans fix nitrogen that corn needs</li>
                        <li><strong>Cabbage + Dill:</strong> Dill attracts beneficial wasps that control cabbage worms</li>
                    </ul>
                    
                    <h3>Plants to Avoid Together</h3>
                    <p>Some plants compete or inhibit each other:</p>
                    <ul>
                        <li>Tomatoes and walnuts (walnut roots produce growth inhibitors)</li>
                        <li>Onions and beans (onions can stunt bean growth)</li>
                        <li>Carrots and fennel (fennel inhibits carrot growth)</li>
                    </ul>
                    
                    <h3>Implementing Companion Planting</h3>
                    <p>Start small with proven combinations, observe the results, and gradually expand your companion planting strategies. Keep detailed records of what works in your specific growing conditions.</p>
                `,
                tags: ["companion-planting", "organic", "pest-control", "gardening"],
                views: 654,
                likes: 87
            }
        ];
        
        this.currentCategory = 'all';
        this.searchTerm = '';
        this.displayedPosts = 6;
        this.postsPerLoad = 3;
        
        this.init();
    }
    
    init() {
        this.renderFeaturedPost();
        this.renderBlogPosts();
        this.setupEventListeners();
        this.loadUrlParams();
    }
    
    setupEventListeners() {
        // Category buttons
        document.querySelectorAll('.category-tab').forEach(button => {
            button.addEventListener('click', (e) => {
                this.setActiveCategory(e.target.dataset.category);
            });
        });
        
        // Search input
        document.getElementById('blogSearch').addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.displayedPosts = 6; // Reset displayed posts
            this.renderBlogPosts();
            this.updateLoadMoreButton();
        });
        
        // Load more button
        document.getElementById('loadMoreBtn').addEventListener('click', () => {
            this.loadMorePosts();
        });
        
        // Newsletter form
        document.getElementById('newsletterForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleNewsletterSignup(e.target);
        });
    }
    
    loadUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        const postSlug = urlParams.get('post');
        
        if (category) {
            this.setActiveCategory(category);
        }
        
        if (postSlug) {
            const post = this.posts.find(p => p.slug === postSlug);
            if (post) {
                this.openArticleModal(post);
            }
        }
    }
    
    setActiveCategory(category) {
        this.currentCategory = category;
        this.displayedPosts = 6; // Reset displayed posts
        
        // Update active button
        document.querySelectorAll('.category-tab').forEach(button => {
            button.classList.remove('active');
            button.classList.add('text-gray-600', 'bg-white', 'hover:bg-gray-100');
        });
        
        const activeButton = document.querySelector(`[data-category="${category}"]`);
        activeButton.classList.add('active');
        activeButton.classList.remove('text-gray-600', 'bg-white', 'hover:bg-gray-100');
        
        this.renderBlogPosts();
        this.updateLoadMoreButton();
    }
    
    filterPosts() {
        return this.posts.filter(post => {
            const matchesCategory = this.currentCategory === 'all' || post.category === this.currentCategory;
            const matchesSearch = !this.searchTerm || 
                post.title.toLowerCase().includes(this.searchTerm) ||
                post.excerpt.toLowerCase().includes(this.searchTerm) ||
                post.author.toLowerCase().includes(this.searchTerm) ||
                post.tags.some(tag => tag.toLowerCase().includes(this.searchTerm));
                
            return matchesCategory && matchesSearch;
        });
    }
    
    renderFeaturedPost() {
        const featuredPost = this.posts.find(post => post.featured);
        if (!featuredPost) return;
        
        const container = document.getElementById('featuredPost');
        const postDate = new Date(featuredPost.date);
        const formattedDate = postDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        container.innerHTML = `
            <div class="grid md:grid-cols-2 gap-8 items-center p-8">
                <div class="text-white">
                    <div class="flex items-center space-x-4 mb-4">
                        <span class="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                            Featured Article
                        </span>
                        <span class="text-primary-100">${formattedDate}</span>
                    </div>
                    <h2 class="text-3xl md:text-4xl font-bold mb-4">${featuredPost.title}</h2>
                    <p class="text-primary-100 text-lg mb-6 leading-relaxed">${featuredPost.excerpt}</p>
                    <div class="flex items-center space-x-4 mb-6">
                        <div class="flex items-center space-x-2">
                            <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <i class="fas fa-user text-white text-sm"></i>
                            </div>
                            <span class="text-primary-100">${featuredPost.author}</span>
                        </div>
                        <span class="text-primary-200">•</span>
                        <span class="text-primary-100">${featuredPost.readTime}</span>
                    </div>
                    <button onclick="blogPage.openArticleModal(${JSON.stringify(featuredPost).replace(/"/g, '&quot;')})" 
                            class="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
                        Read Full Article
                    </button>
                </div>
                <div class="relative">
                    <img src="${featuredPost.image}" alt="${featuredPost.title}" 
                         class="w-full h-64 md:h-80 object-cover rounded-xl shadow-xl"
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZlYXR1cmVkIEFydGljbGU8L3RleHQ+PC9zdmc+';">
                </div>
            </div>
        `;
    }
    
    renderBlogPosts() {
        const filteredPosts = this.filterPosts().filter(post => !post.featured);
        const postsToShow = filteredPosts.slice(0, this.displayedPosts);
        const grid = document.getElementById('blogGrid');
        
        if (postsToShow.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
                    <p class="text-gray-500">Try adjusting your search or category filter.</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = postsToShow.map(post => this.createPostCard(post)).join('');
        this.updateLoadMoreButton();
    }
    
    createPostCard(post) {
        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        return `
            <article class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div class="relative">
                    <img src="${post.image}" alt="${post.title}" 
                         class="w-full h-48 object-cover"
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJsb2cgSW1hZ2U8L3RleHQ+PC9zdmc+';">
                    <div class="absolute top-4 left-4">
                        <span class="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                            ${post.category.replace('-', ' ')}
                        </span>
                    </div>
                </div>
                
                <div class="p-6">
                    <div class="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <span>${formattedDate}</span>
                        <span>${post.readTime}</span>
                    </div>
                    
                    <h3 class="text-xl font-bold text-gray-900 mb-3 hover:text-primary-600 transition-colors cursor-pointer"
                        onclick="blogPage.openArticleModal(${JSON.stringify(post).replace(/"/g, '&quot;')})">
                        ${post.title}
                    </h3>
                    
                    <p class="text-gray-600 mb-4 line-clamp-3">${post.excerpt}</p>
                    
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <i class="fas fa-user text-gray-500 text-sm"></i>
                            </div>
                            <div>
                                <div class="text-sm font-medium text-gray-900">${post.author}</div>
                                <div class="text-xs text-gray-500">${post.authorRole}</div>
                            </div>
                        </div>
                        
                        <div class="flex items-center space-x-4 text-sm text-gray-500">
                            <span class="flex items-center space-x-1">
                                <i class="fas fa-eye"></i>
                                <span>${post.views}</span>
                            </span>
                            <span class="flex items-center space-x-1">
                                <i class="fas fa-heart"></i>
                                <span>${post.likes}</span>
                            </span>
                        </div>
                    </div>
                    
                    <div class="flex flex-wrap gap-1 mt-4">
                        ${post.tags.slice(0, 3).map(tag => `
                            <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                ${tag}
                            </span>
                        `).join('')}
                    </div>
                    
                    <button onclick="blogPage.openArticleModal(${JSON.stringify(post).replace(/"/g, '&quot;')})" 
                            class="w-full mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                        Read More
                    </button>
                </div>
            </article>
        `;
    }
    
    loadMorePosts() {
        this.displayedPosts += this.postsPerLoad;
        this.renderBlogPosts();
    }
    
    updateLoadMoreButton() {
        const filteredPosts = this.filterPosts().filter(post => !post.featured);
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        
        if (this.displayedPosts >= filteredPosts.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-block';
        }
    }
    
    openArticleModal(post) {
        const modal = document.getElementById('articleModal');
        const modalContent = document.getElementById('articleModalContent');
        
        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        modalContent.innerHTML = `
            <div class="relative">
                <button onclick="blogPage.closeArticleModal()" 
                        class="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-gray-600 hover:text-gray-800 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                    <i class="fas fa-times"></i>
                </button>
                
                <img src="${post.image}" alt="${post.title}" 
                     class="w-full h-64 md:h-80 object-cover"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFydGljbGUgSW1hZ2U8L3RleHQ+PC9zdmc+';">
                
                <div class="p-8">
                    <div class="flex items-center space-x-4 mb-4">
                        <span class="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium capitalize">
                            ${post.category.replace('-', ' ')}
                        </span>
                        <span class="text-gray-500">${formattedDate}</span>
                        <span class="text-gray-500">•</span>
                        <span class="text-gray-500">${post.readTime}</span>
                    </div>
                    
                    <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">${post.title}</h1>
                    
                    <div class="flex items-center space-x-4 mb-8 pb-6 border-b border-gray-200">
                        <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <i class="fas fa-user text-gray-500"></i>
                        </div>
                        <div>
                            <div class="font-semibold text-gray-900">${post.author}</div>
                            <div class="text-gray-600">${post.authorRole}</div>
                        </div>
                        <div class="flex items-center space-x-6 ml-auto text-sm text-gray-500">
                            <span class="flex items-center space-x-1">
                                <i class="fas fa-eye"></i>
                                <span>${post.views}</span>
                            </span>
                            <span class="flex items-center space-x-1">
                                <i class="fas fa-heart"></i>
                                <span>${post.likes}</span>
                            </span>
                        </div>
                    </div>
                    
                    <div class="prose prose-lg max-w-none">
                        ${post.content}
                    </div>
                    
                    <div class="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-200">
                        <span class="text-sm font-medium text-gray-700">Tags:</span>
                        ${post.tags.map(tag => `
                            <span class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                                ${tag}
                            </span>
                        `).join('')}
                    </div>
                    
                    <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                        <button onclick="blogPage.shareArticle('${post.slug}')" 
                                class="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors">
                            <i class="fas fa-share"></i>
                            <span>Share Article</span>
                        </button>
                        <button onclick="blogPage.likeArticle(${post.id})" 
                                class="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
                            <i class="fas fa-heart"></i>
                            <span>Like (${post.likes})</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    closeArticleModal() {
        document.getElementById('articleModal').classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    shareArticle(slug) {
        if (navigator.share) {
            navigator.share({
                title: 'Campo Vida Blog',
                url: `${window.location.origin}/blog.html?post=${slug}`
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(`${window.location.origin}/blog.html?post=${slug}`);
            window.campoVidaApp.showNotification('Article link copied to clipboard!', 'success');
        }
    }
    
    likeArticle(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.likes++;
            window.campoVidaApp.showNotification('Thanks for liking this article!', 'success');
            // Re-render to update like count
            this.renderBlogPosts();
            // Update modal if it's open
            const modal = document.getElementById('articleModal');
            if (modal.classList.contains('show')) {
                this.openArticleModal(post);
            }
        }
    }
    
    handleNewsletterSignup(form) {
        const formData = new FormData(form);
        const email = formData.get('email');
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Subscribing...';
        submitButton.disabled = true;
        
        setTimeout(() => {
            window.campoVidaApp.showNotification(
                `Successfully subscribed ${email} to our newsletter!`, 
                'success'
            );
            
            form.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 1500);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.blogPage = new BlogPage();
});
