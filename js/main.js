// Simple JavaScript for interactive elements

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== LOAD PRODUCTS FROM API =====
    loadProductsFromAPI();
    
    // ===== COOKIE CONSENT POPUP =====
    const cookieConsent = document.getElementById('cookieConsent');
    const acceptAllBtn = document.getElementById('acceptAll');
    const acceptEssentialBtn = document.getElementById('acceptEssential');
    const cookieSettingsBtn = document.getElementById('cookieSettings');
    
    // Check if user has already made a choice (simulated with localStorage)
    const cookieChoice = localStorage.getItem('cookieConsent');
    
    if (!cookieChoice) {
        // Show popup after a short delay (non-intrusive)
        setTimeout(() => {
            cookieConsent.classList.add('show');
        }, 500);
    }
    
    // Handle "Accept all" button
    if (acceptAllBtn) {
        acceptAllBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'all');
            cookieConsent.classList.remove('show');
            console.log('Cookies accepted: all'); // For demo purposes
        });
    }
    
    // Handle "Only essentials" button
    if (acceptEssentialBtn) {
        acceptEssentialBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'essential');
            cookieConsent.classList.remove('show');
            console.log('Cookies accepted: essential only'); // For demo purposes
        });
    }
    
    // Re-open cookie settings from footer
    if (cookieSettingsBtn) {
        cookieSettingsBtn.addEventListener('click', function() {
            cookieConsent.classList.add('show');
        });
    }
    
    // ===== MOBILE MENU TOGGLE =====
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-toggle';
    mobileMenuBtn.setAttribute('aria-label', 'Toggle menu');
    mobileMenuBtn.innerHTML = '☰';
    
    const header = document.querySelector('.header-container');
    const nav = document.querySelector('.main-nav');
    
    // Only add mobile toggle on small screens
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            if (!document.querySelector('.mobile-menu-toggle')) {
                header.insertBefore(mobileMenuBtn, nav);
                
                mobileMenuBtn.addEventListener('click', function() {
                    nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
                });
            }
        } else {
            const existingBtn = document.querySelector('.mobile-menu-toggle');
            if (existingBtn) {
                existingBtn.remove();
                nav.style.display = ''; // Reset to default
            }
        }
    }
    
    // Run on load and resize
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    // ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    console.log('Coastal Spirit site loaded - design improvements demonstrated');
});

// ===== NEW: LOAD PRODUCTS FROM MOCKAPI =====
async function loadProductsFromAPI() {
    try {
        // Your MockAPI URL
        const API_URL = 'https://69b7410effbcd0286094d2cb.mockapi.io/products';
        
        // Find the product grid
        const grid = document.querySelector('.category-grid');
        if (!grid) {
            console.log('No product grid found');
            return;
        }
        
        // Show loading state
        grid.innerHTML = '<p class="loading">Loading our coastal collection...</p>';
        
        // Fetch products from API
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Failed to load products');
        }
        
        const products = await response.json();
        
        // Clear loading message
        grid.innerHTML = '';
        
        // Clothing types to cycle through
        const clothingTypes = [
            'Coastal Sweatshirt',
            'Merino Knit',
            'Organic Cotton Tee',
            'Fleece Jacket',
            'Linen Shirt',
            'Wool Beanie',
            'Canvas Tote',
            'Denim Jacket',
            'Cargo Pants',
            'Waterproof Jacket'
        ];
        
        // Categories to cycle through
        const categories = ['men', 'women', 'unisex', 'accessories'];
        
        // Loop through products from API
        products.forEach((item, index) => {
            // Transform the data
            const category = categories[index % categories.length];
            const clothingItem = clothingTypes[index % clothingTypes.length];
            
            // Clean up the name - remove titles and get first name
            let firstName = item.name;
            // Remove common titles
            firstName = firstName.replace(/(Dr\.|Mrs\.|Ms\.|Miss|Mr\.|PhD|DVM|IV|III|II|V)\s*/g, '');
            // Take first word only
            firstName = firstName.split(' ')[0];
            
            // Create product name
            const productName = `${firstName}'s ${clothingItem}`;
            
            // Generate a price between £25 and £95
            const price = (Math.random() * 70 + 25).toFixed(2);
            
            // Create product card
            const card = document.createElement('div');
            card.className = 'category-card';
            card.innerHTML = `
                <div class="card-image">
                    <img src="${item.avatar}" 
                         alt="${productName}" 
                         loading="lazy"
                         onerror="this.src='images/placeholder.jpg'">
                </div>
                <h3>${productName}</h3>
                <p class="price">£${price}</p>
                <p><small>${category} · Sustainable</small></p>
                <button class="btn btn-secondary add-to-cart" 
                        data-id="${item.id}"
                        onclick="addToCart('${item.id}', '${productName}', ${price})">
                    Add to bag
                </button>
            `;
            
            grid.appendChild(card);
        });
        
        console.log(`✅ Loaded ${products.length} coastal products from API`);
        
    } catch (error) {
        console.log('⚠️ API failed, using fallback products:', error);
        useFallbackProducts();
    }
}

// ===== FALLBACK PRODUCTS (if API fails) =====
function useFallbackProducts() {
    const grid = document.querySelector('.category-grid');
    if (!grid) return;
    
    grid.innerHTML = ''; // Clear
    
    const fallbackProducts = [
        {
            name: "Men's Coastal Sweatshirt",
            price: "45.00",
            category: "men",
            image: "mens-new.jpg"
        },
        {
            name: "Women's Merino Knit",
            price: "65.00",
            category: "women",
            image: "womens-new.jpg"
        },
        {
            name: "Organic Cotton Tee",
            price: "28.00",
            category: "unisex",
            image: "placeholder.jpg"
        },
        {
            name: "Coastal Fleece Jacket",
            price: "85.00",
            category: "women",
            image: "placeholder.jpg"
        },
        {
            name: "Wool Beanie",
            price: "22.00",
            category: "accessories",
            image: "placeholder.jpg"
        },
        {
            name: "Canvas Tote Bag",
            price: "32.00",
            category: "accessories",
            image: "placeholder.jpg"
        }
    ];
    
    fallbackProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
            <div class="card-image">
                <img src="images/${product.image}" 
                     alt="${product.name}"
                     onerror="this.src='images/placeholder.jpg'">
            </div>
            <h3>${product.name}</h3>
            <p class="price">£${product.price}</p>
            <p><small>${product.category} · Sustainable</small></p>
            <button class="btn btn-secondary">Add to bag</button>
        `;
        grid.appendChild(card);
    });
    
    console.log('✅ Using fallback products');
}

// ===== ADD TO CART FUNCTION =====
function addToCart(id, name, price) {
    // Simple cart using localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item already in cart
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Simple feedback
    alert(`${name} added to bag!`);
    console.log('Cart:', cart);
}
