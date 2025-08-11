// Events page functionality
class EventsPage {
    constructor() {
        this.events = [
            {
                id: 1,
                title: "Organic Farming Workshop",
                category: "workshop",
                date: "2025-08-18",
                time: "9:00 AM - 4:00 PM",
                location: "Campo Vida Farm, Baguio City",
                price: "₱1,500",
                description: "Learn the fundamentals of organic farming including soil preparation, composting, natural pest control, and sustainable growing techniques.",
                image: "frontend/public/img/20250715_132607.jpg",
                spotsLeft: 12,
                totalSpots: 20,
                featured: true,
                tags: ["beginner-friendly", "hands-on", "certification"]
            },
            {
                id: 2,
                title: "Farm-to-Table Cooking Class",
                category: "workshop",
                date: "2025-08-22",
                time: "10:00 AM - 2:00 PM",
                location: "Campo Vida Kitchen, Baguio City",
                price: "₱2,200",
                description: "Cook delicious meals using fresh ingredients straight from our farm. Learn seasonal recipes and food preservation techniques.",
                image: "frontend/public/img/20250715_132621.jpg",
                spotsLeft: 8,
                totalSpots: 15,
                featured: false,
                tags: ["cooking", "seasonal", "family-friendly"]
            },
            {
                id: 3,
                title: "Guided Farm Tour & Harvest Experience",
                category: "tour",
                date: "2025-08-15",
                time: "8:00 AM - 12:00 PM",
                location: "Campo Vida Farm, Baguio City",
                price: "₱800",
                description: "Join us for a guided tour of our organic farm followed by a hands-on harvesting experience. Perfect for families and school groups.",
                image: "frontend/public/img/view-1.jpg",
                spotsLeft: 25,
                totalSpots: 30,
                featured: true,
                tags: ["family-friendly", "educational", "harvesting"]
            },
            {
                id: 4,
                title: "Weekend Farmers Market",
                category: "market",
                date: "2025-08-16",
                time: "6:00 AM - 2:00 PM",
                location: "Baguio Public Market",
                price: "Free",
                description: "Visit our booth at the weekly farmers market. Fresh produce, live demonstrations, and special weekend-only products.",
                image: "frontend/public/img/partners.jpg",
                spotsLeft: null,
                totalSpots: null,
                featured: false,
                tags: ["free", "market", "fresh-produce"]
            },
            {
                id: 5,
                title: "Composting & Soil Health Seminar",
                category: "workshop",
                date: "2025-08-25",
                time: "2:00 PM - 6:00 PM",
                location: "Campo Vida Learning Center",
                price: "₱1,200",
                description: "Deep dive into soil health, composting techniques, and creating nutrient-rich growing mediums for your home garden.",
                image: "frontend/public/img/path-1.jpg",
                spotsLeft: 15,
                totalSpots: 25,
                featured: false,
                tags: ["advanced", "soil-health", "composting"]
            },
            {
                id: 6,
                title: "Community Garden Project",
                category: "community",
                date: "2025-08-29",
                time: "8:00 AM - 5:00 PM",
                location: "Barangay Community Center",
                price: "₱500",
                description: "Help us establish a new community garden. Volunteer day with free lunch and learning opportunities for all skill levels.",
                image: "frontend/public/img/hutt.jpg",
                spotsLeft: 40,
                totalSpots: 50,
                featured: true,
                tags: ["volunteer", "community", "team-building"]
            },
            {
                id: 7,
                title: "Herb Garden Design Workshop",
                category: "workshop",
                date: "2025-09-01",
                time: "9:00 AM - 1:00 PM",
                location: "Campo Vida Greenhouse",
                price: "₱1,800",
                description: "Design and plant your own herb garden. Learn about companion planting, herb preservation, and creating beautiful edible landscapes.",
                image: "frontend/public/img/flower-1.jpg",
                spotsLeft: 10,
                totalSpots: 18,
                featured: false,
                tags: ["design", "herbs", "gardening"]
            },
            {
                id: 8,
                title: "Sustainable Living Fair",
                category: "community",
                date: "2025-09-05",
                time: "9:00 AM - 6:00 PM",
                location: "Burnham Park, Baguio City",
                price: "Free",
                description: "A full day of sustainable living demonstrations, local vendors, organic food tastings, and environmental awareness activities.",
                image: "frontend/public/img/view-2.jpg",
                spotsLeft: null,
                totalSpots: null,
                featured: true,
                tags: ["free", "sustainable", "fair", "family-friendly"]
            },
            {
                id: 9,
                title: "Advanced Permaculture Design",
                category: "workshop",
                date: "2025-09-08",
                time: "8:00 AM - 6:00 PM",
                location: "Campo Vida Farm",
                price: "₱3,500",
                description: "Intensive workshop on permaculture principles, design methodology, and implementing sustainable food systems.",
                image: "frontend/public/img/path-2.jpg",
                spotsLeft: 6,
                totalSpots: 12,
                featured: false,
                tags: ["advanced", "permaculture", "intensive", "certification"]
            },
            {
                id: 10,
                title: "Kids Farm Adventure Day",
                category: "tour",
                date: "2025-09-12",
                time: "9:00 AM - 3:00 PM",
                location: "Campo Vida Farm",
                price: "₱1,000",
                description: "Special farm experience designed for children aged 5-12. Animal feeding, vegetable planting, and fun farm activities with healthy snacks.",
                image: "frontend/public/img/20250715_133203.jpg",
                spotsLeft: 20,
                totalSpots: 25,
                featured: true,
                tags: ["kids", "family", "animals", "educational"]
            }
        ];
        
        this.currentFilter = 'all';
        this.searchTerm = '';
        
        this.init();
    }
    
    init() {
        this.renderEvents();
        this.setupEventListeners();
        this.loadUrlParams();
    }
    
    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-tab').forEach(button => {
            button.addEventListener('click', (e) => {
                this.setActiveFilter(e.target.dataset.filter);
            });
        });
        
        // Search input
        document.getElementById('eventSearch').addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.renderEvents();
        });
        
        // Registration form
        document.getElementById('registrationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegistration(e.target);
        });
    }
    
    loadUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        const eventId = urlParams.get('event');
        
        if (category) {
            this.setActiveFilter(category);
        }
        
        if (eventId) {
            const event = this.events.find(e => e.id === parseInt(eventId));
            if (event) {
                this.openEventModal(event);
            }
        }
    }
    
    setActiveFilter(filter) {
        this.currentFilter = filter;
        
        // Update active button
        document.querySelectorAll('.filter-tab').forEach(button => {
            button.classList.remove('active');
            button.classList.add('text-gray-600', 'bg-gray-100', 'hover:bg-gray-200');
        });
        
        const activeButton = document.querySelector(`[data-filter="${filter}"]`);
        activeButton.classList.add('active');
        activeButton.classList.remove('text-gray-600', 'bg-gray-100', 'hover:bg-gray-200');
        
        this.renderEvents();
    }
    
    filterEvents() {
        return this.events.filter(event => {
            const matchesFilter = this.currentFilter === 'all' || event.category === this.currentFilter;
            const matchesSearch = !this.searchTerm || 
                event.title.toLowerCase().includes(this.searchTerm) ||
                event.description.toLowerCase().includes(this.searchTerm) ||
                event.location.toLowerCase().includes(this.searchTerm) ||
                event.tags.some(tag => tag.toLowerCase().includes(this.searchTerm));
                
            return matchesFilter && matchesSearch;
        });
    }
    
    renderEvents() {
        const filteredEvents = this.filterEvents();
        const grid = document.getElementById('eventsGrid');
        
        if (filteredEvents.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-calendar-times text-4xl text-gray-400 mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
                    <p class="text-gray-500">Try adjusting your search or filter criteria.</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = filteredEvents.map(event => this.createEventCard(event)).join('');
    }
    
    createEventCard(event) {
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        const spotsInfo = event.spotsLeft !== null ? 
            `<div class="flex items-center text-sm ${event.spotsLeft < 5 ? 'text-red-600' : 'text-green-600'}">
                <i class="fas fa-users mr-1"></i>
                ${event.spotsLeft} spots left
            </div>` : '';
            
        const featuredBadge = event.featured ? 
            '<div class="absolute top-4 left-4 bg-accent-600 text-white px-3 py-1 rounded-full text-sm font-medium">Featured</div>' : '';
            
        return `
            <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div class="relative">
                    <img src="${event.image}" alt="${event.title}" 
                         class="w-full h-48 object-cover" 
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkV2ZW50IEltYWdlPC90ZXh0Pjwvc3ZnPg==';">
                    ${featuredBadge}
                    <div class="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                        <span class="text-primary-600 font-semibold text-lg">${event.price}</span>
                    </div>
                </div>
                
                <div class="p-6">
                    <div class="flex items-center justify-between mb-3">
                        <span class="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium capitalize">
                            ${event.category.replace('-', ' ')}
                        </span>
                        ${spotsInfo}
                    </div>
                    
                    <h3 class="text-xl font-bold text-gray-900 mb-3">${event.title}</h3>
                    
                    <div class="space-y-2 mb-4">
                        <div class="flex items-center text-gray-600">
                            <i class="fas fa-calendar-alt mr-2 text-primary-600"></i>
                            <span>${formattedDate}</span>
                        </div>
                        <div class="flex items-center text-gray-600">
                            <i class="fas fa-clock mr-2 text-primary-600"></i>
                            <span>${event.time}</span>
                        </div>
                        <div class="flex items-center text-gray-600">
                            <i class="fas fa-map-marker-alt mr-2 text-primary-600"></i>
                            <span>${event.location}</span>
                        </div>
                    </div>
                    
                    <p class="text-gray-600 mb-4 line-clamp-3">${event.description}</p>
                    
                    <div class="flex flex-wrap gap-1 mb-4">
                        ${event.tags.map(tag => `
                            <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                ${tag}
                            </span>
                        `).join('')}
                    </div>
                    
                    <button onclick="eventsPage.openEventModal(${JSON.stringify(event).replace(/"/g, '&quot;')})" 
                            class="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors ${event.spotsLeft === 0 ? 'opacity-50 cursor-not-allowed' : ''}"
                            ${event.spotsLeft === 0 ? 'disabled' : ''}>
                        ${event.spotsLeft === 0 ? 'Event Full' : event.price === 'Free' ? 'Learn More' : 'Register Now'}
                    </button>
                </div>
            </div>
        `;
    }
    
    openEventModal(event) {
        const modal = document.getElementById('eventModal');
        const modalContent = document.getElementById('eventModalContent');
        
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        modalContent.innerHTML = `
            <div class="mb-6">
                <img src="${event.image}" alt="${event.title}" 
                     class="w-full h-48 object-cover rounded-lg mb-4"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkV2ZW50IEltYWdlPC90ZXh0Pjwvc3ZnPg==';">
                
                <h4 class="text-xl font-bold text-gray-900 mb-3">${event.title}</h4>
                
                <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div class="flex items-center text-gray-600">
                        <i class="fas fa-calendar-alt mr-2 text-primary-600"></i>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="flex items-center text-gray-600">
                        <i class="fas fa-clock mr-2 text-primary-600"></i>
                        <span>${event.time}</span>
                    </div>
                    <div class="flex items-center text-gray-600">
                        <i class="fas fa-map-marker-alt mr-2 text-primary-600"></i>
                        <span>${event.location}</span>
                    </div>
                    <div class="flex items-center text-gray-600">
                        <i class="fas fa-tag mr-2 text-primary-600"></i>
                        <span class="font-semibold text-primary-600">${event.price}</span>
                    </div>
                </div>
                
                <p class="text-gray-600 mb-4">${event.description}</p>
                
                ${event.spotsLeft !== null ? `
                    <div class="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <span class="text-sm text-gray-600">Available Spots:</span>
                        <span class="font-semibold ${event.spotsLeft < 5 ? 'text-red-600' : 'text-green-600'}">
                            ${event.spotsLeft} / ${event.totalSpots}
                        </span>
                    </div>
                ` : ''}
            </div>
        `;
        
        // Show/hide registration form based on event type
        const form = document.getElementById('registrationForm');
        if (event.price === 'Free' && event.spotsLeft === null) {
            form.style.display = 'none';
        } else {
            form.style.display = 'block';
            // Store event ID for form submission
            form.dataset.eventId = event.id;
        }
        
        modal.classList.add('show');
    }
    
    closeEventModal() {
        document.getElementById('eventModal').classList.remove('show');
    }
    
    handleRegistration(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        const eventId = parseInt(form.dataset.eventId);
        
        // Simulate registration process
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Processing...';
        submitButton.disabled = true;
        
        setTimeout(() => {
            // Update event spots
            const event = this.events.find(e => e.id === eventId);
            if (event && event.spotsLeft !== null) {
                const attendees = parseInt(data.attendees.replace('+', '')) || 1;
                event.spotsLeft = Math.max(0, event.spotsLeft - attendees);
            }
            
            // Show success message
            window.campoVidaApp.showNotification(
                `Registration successful! Confirmation details sent to ${data.email}`, 
                'success'
            );
            
            // Close modal and refresh display
            this.closeEventModal();
            this.renderEvents();
            
            // Reset form
            form.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 1500);
    }
}

// Modal control functions
function closeEventModal() {
    if (window.eventsPage) {
        window.eventsPage.closeEventModal();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.eventsPage = new EventsPage();
});
