// ============================================================================
// COASTAL SPIRIT WEBSITE - MAIN JAVASCRIPT
// ============================================================================
// This file contains all the interactive functionality for the Coastal Spirit
// clothing website, including: loading products from an API, shopping cart,
// cookie consent, mobile menu, and smooth scrolling.
// ============================================================================

// ============================================================================
// EVENT LISTENER: DOMContentLoaded
// ============================================================================
// This event fires when the initial HTML document has been completely loaded
// and parsed, without waiting for stylesheets, images, and subframes to finish
// loading. This ensures our JavaScript runs at the right time.
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== LOAD PRODUCTS FROM API =====
    // Call the function that fetches product data from our MockAPI backend
    // This populates the product grid with items from the database
    loadProductsFromAPI();
    
    // ===== SETUP SHOPPING CART =====
    // Initialize the shopping cart functionality - creates cart elements,
    // sets up event listeners, and loads any existing cart items from storage
    setupCart();
    
    // ===== COOKIE CONSENT POPUP =====
    // Get references to the cookie consent popup elements in the HTML
    const cookieConsent = document.getElementById('cookieConsent');  // The popup container
    const acceptAllBtn = document.getElementById('acceptAll');        // Button to accept all cookies
    const acceptEssentialBtn = document.getElementById('acceptEssential'); // Button for essential only
    const cookieSettingsBtn = document.getElementById('cookieSettings');   // Button to reopen settings
    
    // Check if user has already made a choice using localStorage
    // localStorage is a web storage API that persists data even after the browser is closed
    const cookieChoice = localStorage.getItem('cookieConsent');
    
    // If no choice has been made yet (first visit), show the cookie consent popup
    if (!cookieChoice) {
        // Show popup after a short delay (500ms) to avoid interrupting the initial page load
        // This creates a non-intrusive user experience
        setTimeout(() => {
            cookieConsent.classList.add('show'); // Add the 'show' class to make it visible
        }, 500);
    }
    
    // Handle "Accept all" button click
    if (acceptAllBtn) {
        acceptAllBtn.addEventListener('click', function() {
            // Save user's choice to localStorage - this will persist across sessions
            localStorage.setItem('cookieConsent', 'all');
            // Hide the popup by removing the 'show' class
            cookieConsent.classList.remove('show');
            console.log('Cookies accepted: all'); // For demo/debugging purposes
        });
    }
    
    // Handle "Only essentials" button click
    if (acceptEssentialBtn) {
        acceptEssentialBtn.addEventListener('click', function() {
            // Save that user only accepted essential cookies
            localStorage.setItem('cookieConsent', 'essential');
            cookieConsent.classList.remove('show');
            console.log('Cookies accepted: essential only');
        });
    }
    
    // Handle cookie settings button (usually in footer) to reopen the popup
    if (cookieSettingsBtn) {
        cookieSettingsBtn.addEventListener('click', function() {
            // Add the 'show' class to make the cookie popup visible again
            cookieConsent.classList.add('show');
        });
    }
    
    // ===== MOBILE MENU TOGGLE =====
    // Create a button element for the mobile menu toggle (hamburger menu)
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-toggle';           // CSS class for styling
    mobileMenuBtn.setAttribute('aria-label', 'Toggle menu');  // Accessibility label for screen readers
    mobileMenuBtn.innerHTML = '☰';                            // Hamburger icon (Unicode character)
    
    // Get references to the header container and main navigation elements
    const header = document.querySelector('.header-container');
    const nav = document.querySelector('.main-nav');
    
    // Function to check screen size and adjust menu accordingly
    // This creates a responsive design that works on mobile and desktop
    function checkScreenSize() {
        // Check if screen width is mobile size (768px or less)
        if (window.innerWidth <= 768) {
            // Only add the mobile menu button if it doesn't already exist
            if (!document.querySelector('.mobile-menu-toggle')) {
                // Insert the mobile menu button before the navigation
                header.insertBefore(mobileMenuBtn, nav);
                
                // Add click event to toggle mobile menu visibility
                mobileMenuBtn.addEventListener('click', function() {
                    // Toggle between showing and hiding the navigation
                    // If nav is hidden (display none), show it; if visible, hide it
                    nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
                });
            }
        } else {
            // Desktop view: remove mobile menu button and ensure nav is visible
            const existingBtn = document.querySelector('.mobile-menu-toggle');
            if (existingBtn) {
                existingBtn.remove();           // Remove the mobile button
                nav.style.display = '';          // Reset to default CSS display value
            }
        }
    }
    
    // Run checkScreenSize when page loads
    checkScreenSize();
    // Also run it whenever the window is resized (so menu adapts in real-time)
    window.addEventListener('resize', checkScreenSize);
    
    // ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
    // Find all links that start with "#" (internal page links)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');  // Get the href value (e.g., "#story")
            
            // Ignore links that are just "#" (often used for dummy links)
            if (href !== '#') {
                e.preventDefault();  // Prevent default jump-to-anchor behavior
                
                // Find the element on the page that matches the href
                const target = document.querySelector(href);
                if (target) {
                    // Scroll to the target element smoothly
                    target.scrollIntoView({
                        behavior: 'smooth',  // Enable smooth scrolling animation
                        block: 'start'        // Align to top of the element
                    });
                }
            }
        });
    });
    
    console.log('Coastal Spirit site loaded - design improvements demonstrated');
});

// ============================================================================
// FUNCTION: loadProductsFromAPI
// ============================================================================
// This asynchronous function fetches product data from our MockAPI backend,
// transforms the data (which contains random person data) into clothing products,
// and displays them in the product grid.
async function loadProductsFromAPI() {
    try {
        // ===== API CONFIGURATION =====
        // Your MockAPI URL - this endpoint returns JSON data with 66 random person records
        const API_URL = 'https://69b7410effbcd0286094d2cb.mockapi.io/products';
        
        // ===== FIND PRODUCT GRID =====
        // Locate the HTML element where products will be displayed
        const grid = document.querySelector('.category-grid');
        if (!grid) {
            console.log('No product grid found');
            return; // Exit function if grid doesn't exist
        }
        
        // ===== SHOW LOADING STATE =====
        // Display a loading message while fetching data
        // This improves user experience by indicating content is on its way
        grid.innerHTML = '<p class="loading">Loading our coastal collection...</p>';
        
        // ===== FETCH DATA FROM API =====
        // The fetch API is used to make HTTP requests
        // await pauses execution until the promise resolves
        const response = await fetch(API_URL);
        
        // Check if the HTTP response is successful (status code 200-299)
        if (!response.ok) {
            throw new Error('Failed to load products');
        }
        
        // Parse the JSON response body into a JavaScript array
        // This contains 66 objects with properties: id, name, avatar, createdAt
        const products = await response.json();
        
        // ===== CLEAR LOADING MESSAGE =====
        // Remove the loading message now that we have data
        grid.innerHTML = '';
        
        // ===== DATA TRANSFORMATION ARRAYS =====
        // Arrays to transform random person data into clothing products
        
        // Clothing types - these will be combined with first names to create product names
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
        
        // Categories for filtering/organization
        const categories = ['men', 'women', 'unisex', 'accessories'];
        
        // ===== LOOP THROUGH PRODUCTS =====
        // Iterate over each item returned from the API
        products.forEach((item, index) => {
            // Transform the data using modulo (%) to cycle through arrays
            // This ensures even distribution of categories and clothing types
            const category = categories[index % categories.length];
            const clothingItem = clothingTypes[index % clothingTypes.length];
            
            // ===== CLEAN UP THE NAME =====
            // The API returns full names with titles like "Dr. John Smith"
            // We need to extract just the first name for our product names
            let firstName = item.name;
            
            // Remove common titles using regular expression
            // The pattern matches titles like Dr., Mrs., Ms., etc. followed by whitespace
            firstName = firstName.replace(/(Dr\.|Mrs\.|Ms\.|Miss|Mr\.|PhD|DVM|IV|III|II|V)\s*/g, '');
            
            // Take only the first word (the first name)
            // split(' ') divides the string by spaces, [0] takes the first element
            firstName = firstName.split(' ')[0];
            
            // ===== CREATE PRODUCT NAME =====
            // Combine first name with clothing item
            // Example: "Domingo" + "'s " + "Coastal Sweatshirt" = "Domingo's Coastal Sweatshirt"
            const productName = `${firstName}'s ${clothingItem}`;
            
            // ===== GENERATE PRICE =====
            // Create a random price between £25 and £95
            // Math.random() returns 0-0.999, multiply by 70 gives 0-69.99, add 25 gives 25-94.99
            // toFixed(2) formats to 2 decimal places (e.g., 45.99)
            const price = (Math.random() * 70 + 25).toFixed(2);
            
            // ===== GET IMAGE URL =====
            // Use avatar image from API, or fallback to placeholder if not available
            const imageUrl = item.avatar || 'images/placeholder.jpg';
            
            // ===== CREATE PRODUCT CARD =====
            // Create a new div element for this product
            const card = document.createElement('div');
            card.className = 'category-card'; // Apply CSS styling
            
            // Set the inner HTML of the card
            // This uses template literals (backticks) for multi-line strings with variable interpolation
            card.innerHTML = `
                <div class="card-image">
                    <img src="${imageUrl}" 
                         alt="${productName}" 
                         loading="lazy"
                         onerror="this.src='images/placeholder.jpg'">
                </div>
                <h3>${productName}</h3>
                <p class="price">£${price}</p>
                <p><small>${category} · Sustainable</small></p>
                <button class="btn btn-secondary add-to-cart" 
                        data-id="${item.id}"
                        data-name="${productName.replace(/'/g, "\\'")}"
                        data-price="${price}"
                        data-image="${imageUrl}"
                        onclick="addToCart('${item.id}', '${productName.replace(/'/g, "\\'")}', ${price}, '${imageUrl}')">
                    Add to bag
                </button>
            `;
            
            // ===== ADD CARD TO GRID =====
            // Append the newly created card to the product grid
            grid.appendChild(card);
        });
        
        console.log(`✅ Loaded ${products.length} coastal products from API`);
        
    } catch (error) {
        // ===== ERROR HANDLING =====
        // If anything goes wrong (network error, API down, etc.), use fallback products
        console.log('⚠️ API failed, using fallback products:', error);
        useFallbackProducts();
    }
}

// ============================================================================
// FUNCTION: useFallbackProducts
// ============================================================================
// This function provides hard-coded fallback products in case the API is unavailable.
// It ensures the website still displays products even if the backend is down.
function useFallbackProducts() {
    // Find the product grid element
    const grid = document.querySelector('.category-grid');
    if (!grid) return; // Exit if grid doesn't exist
    
    // Clear any existing content (like error messages)
    grid.innerHTML = '';
    
    // ===== FALLBACK PRODUCT DATA =====
    // Hard-coded array of product objects with all necessary properties
    // These will be displayed if the API fails to load
    const fallbackProducts = [
        {
            id: 'fb1',
            name: "Men's Coastal Sweatshirt",
            price: "45.00",
            category: "men",
            image: "mens-new.jpg"
        },
        {
            id: 'fb2',
            name: "Women's Merino Knit",
            price: "65.00",
            category: "women",
            image: "womens-new.jpg"
        },
        {
            id: 'fb3',
            name: "Organic Cotton Tee",
            price: "28.00",
            category: "unisex",
            image: "placeholder.jpg"
        },
        {
            id: 'fb4',
            name: "Coastal Fleece Jacket",
            price: "85.00",
            category: "women",
            image: "placeholder.jpg"
        },
        {
            id: 'fb5',
            name: "Wool Beanie",
            price: "22.00",
            category: "accessories",
            image: "placeholder.jpg"
        },
        {
            id: 'fb6',
            name: "Canvas Tote Bag",
            price: "32.00",
            category: "accessories",
            image: "placeholder.jpg"
        }
    ];
    
    // ===== LOOP THROUGH FALLBACK PRODUCTS =====
    // Iterate over each fallback product and create a card
    fallbackProducts.forEach(product => {
        // Create new div for product card
        const card = document.createElement('div');
        card.className = 'category-card';
        
        // Set HTML content with product data
        card.innerHTML = `
            <div class="card-image">
                <img src="images/${product.image}" 
                     alt="${product.name}"
                     onerror="this.src='images/placeholder.jpg'">
            </div>
            <h3>${product.name}</h3>
            <p class="price">£${product.price}</p>
            <p><small>${product.category} · Sustainable</small></p>
            <button class="btn btn-secondary add-to-cart"
                    onclick="addToCart('${product.id}', '${product.name}', ${product.price}, 'images/${product.image}')">
                Add to bag
            </button>
        `;
        
        // Add card to grid
        grid.appendChild(card);
    });
    
    console.log('✅ Using fallback products');
}

// ============================================================================
// FUNCTION: setupCart
// ============================================================================
// This function initializes the shopping cart functionality.
// It creates cart elements if they don't exist, sets up event listeners,
// and loads any existing cart items from localStorage.
function setupCart() {
    // ===== CREATE CART ELEMENTS =====
    // Check if cart already exists in the DOM
    if (!document.getElementById('miniCart')) {
        createCartElements(); // If not, create all cart HTML elements
    }
    
    // ===== GET CART ELEMENT REFERENCES =====
    const cartToggle = document.getElementById('cartToggle'); // Button to open cart
    const miniCart = document.getElementById('miniCart');     // The cart panel itself
    const closeCart = document.getElementById('closeCart');   // Button to close cart
    
    // ===== CREATE OVERLAY =====
    // The overlay is a semi-transparent background that appears when cart is open
    // It prevents interaction with the main page and provides a way to close the cart
    let overlay = document.querySelector('.cart-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'cart-overlay';
        document.body.appendChild(overlay);
    }
    
    // ===== OPEN CART EVENT =====
    // When cart toggle button is clicked, open the cart
    if (cartToggle) {
        cartToggle.addEventListener('click', function() {
            miniCart.classList.add('open');     // Slide in the cart
            overlay.classList.add('show');       // Show the overlay
            updateCartDisplay();                  // Refresh cart contents
            updateHeaderCartCount();               // Update header cart count
        });
    }
    
    // ===== CLOSE CART FUNCTION =====
    // Define a reusable function to close the cart
    function closeCartFunction() {
        miniCart.classList.remove('open');  // Hide the cart
        overlay.classList.remove('show');    // Hide the overlay
    }
    
    // ===== CLOSE CART EVENTS =====
    // Close cart when X button is clicked
    if (closeCart) {
        closeCart.addEventListener('click', closeCartFunction);
    }
    
    // Close cart when overlay is clicked (clicking outside the cart)
    overlay.addEventListener('click', closeCartFunction);
    
    // ===== INITIAL CART DISPLAY =====
    // Update cart display from localStorage (shows any items already in cart)
    updateCartDisplay();
    updateHeaderCartCount(); // Update header cart count on page load
}

// ============================================================================
// FUNCTION: createCartElements
// ============================================================================
// This function creates all the HTML elements needed for the shopping cart
// and adds them to the DOM. This includes the cart toggle button and the
// mini cart panel.
function createCartElements() {
    // ===== CREATE CART TOGGLE BUTTON =====
    // This button floats on the page and shows the current item count
    const cartToggle = document.createElement('button');
    cartToggle.id = 'cartToggle';                     // ID for JavaScript access
    cartToggle.className = 'cart-toggle';              // CSS class for styling
    cartToggle.innerHTML = `
        <span class="cart-icon">🛍️</span>              <!-- Shopping bag emoji -->
        <span class="cart-count" id="cartCount">0</span> <!-- Item count badge -->
    `;
    // Add the button to the page (appends to end of body)
    document.body.appendChild(cartToggle);
    
    // ===== CREATE MINI CART PANEL =====
    // This is the slide-out cart panel that appears from the right
    const miniCart = document.createElement('div');
    miniCart.id = 'miniCart';
    miniCart.className = 'mini-cart';
    miniCart.innerHTML = `
        <!-- Cart Header with title and close button -->
        <div class="mini-cart-header">
            <h3>Your Bag</h3>
            <button class="close-cart" id="closeCart">✕</button>
        </div>
        
        <!-- Cart Items Container - will be populated dynamically -->
        <div class="mini-cart-items" id="cartItems">
            <p class="empty-cart">Your bag is empty</p>
        </div>
        
        <!-- Cart Footer with total and checkout button -->
        <div class="mini-cart-footer">
            <div class="cart-total">
                <span>Total:</span>
                <span id="cartTotal">£0.00</span>
            </div>
            <button class="btn btn-primary checkout-btn" onclick="window.location.href='checkout.html'">Checkout</button>
        </div>
    `;
    // Add the cart panel to the page
    document.body.appendChild(miniCart);
}

// ============================================================================
// FUNCTION: addToCart
// ============================================================================
// This function adds an item to the shopping cart.
// It stores cart data in localStorage so it persists across page reloads.
// Parameters:
//   id - Unique identifier for the product
//   name - Product name
//   price - Product price as string (converted to number)
//   image - URL of product image
function addToCart(id, name, price, image) {
    // ===== GET EXISTING CART =====
    // Retrieve cart from localStorage, or create empty array if none exists
    // JSON.parse converts the stored JSON string back to a JavaScript array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // ===== CHECK IF ITEM ALREADY IN CART =====
    // Use find() to search for an item with matching id
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        // ===== INCREMENT QUANTITY =====
        // If item exists, increase quantity by 1
        // Use (existingItem.quantity || 1) to handle items without quantity property
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        // ===== ADD NEW ITEM =====
        // If item doesn't exist, add it to cart with quantity 1
        cart.push({
            id: id,
            name: name,
            price: parseFloat(price), // Convert string price to number
            quantity: 1,
            image: image || 'images/placeholder.jpg' // Use placeholder if no image
        });
    }
    
    // ===== SAVE TO LOCALSTORAGE =====
    // JSON.stringify converts the JavaScript array to a JSON string for storage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // ===== UPDATE DISPLAY =====
    updateCartDisplay();
    updateHeaderCartCount(); // Update header cart count
    
    // ===== VISUAL FEEDBACK =====
    // Add pulse animation to cart button to show item was added
    const cartToggle = document.getElementById('cartToggle');
    if (cartToggle) {
        cartToggle.classList.add('pulse');  // Add animation class
        // Remove animation class after 300ms so it can play again next time
        setTimeout(() => cartToggle.classList.remove('pulse'), 300);
    }
    
    // ===== AUTO-OPEN CART =====
    // Automatically open the cart when user adds an item
    const miniCart = document.getElementById('miniCart');
    const overlay = document.querySelector('.cart-overlay');
    if (miniCart && overlay) {
        miniCart.classList.add('open');  // Slide in cart
        overlay.classList.add('show');    // Show overlay
    }
    
    console.log('Added to cart:', { id, name, price });
}

// ============================================================================
// FUNCTION: updateCartDisplay
// ============================================================================
// This function updates the visual display of the shopping cart.
// It reads cart data from localStorage and renders the items in the cart panel,
// updates the total price, and updates the item count badge.
function updateCartDisplay() {
    // ===== GET CART DATA =====
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // ===== GET ELEMENT REFERENCES =====
    const cartItems = document.getElementById('cartItems'); // Container for cart items
    const cartTotal = document.getElementById('cartTotal'); // Total price element
    const cartCount = document.getElementById('cartCount'); // Item count badge
    
    // ===== UPDATE ITEM COUNT =====
    // Calculate total number of items (sum of quantities)
    // reduce() iterates through array, accumulating a total
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    if (cartCount) {
        cartCount.textContent = totalItems; // Update badge text
    }
    
    // ===== EXIT IF CART ITEMS CONTAINER DOESN'T EXIST =====
    if (!cartItems) return;
    
    // ===== HANDLE EMPTY CART =====
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your bag is empty</p>';
        if (cartTotal) cartTotal.textContent = '£0.00';
        return;
    }
    
    // ===== BUILD CART ITEMS HTML =====
    let html = '';
    let total = 0;
    
    // Loop through each item in cart
    cart.forEach(item => {
        // Calculate item total (price × quantity)
        const itemTotal = item.price * (item.quantity || 1);
        total += itemTotal; // Add to running total
        
        // Build HTML for this cart item
        html += `
            <div class="cart-item">
                <!-- Product image -->
                <img src="${item.image || 'images/placeholder.jpg'}" 
                     alt="${item.name}" 
                     class="cart-item-image"
                     onerror="this.src='images/placeholder.jpg'">
                
                <!-- Item details -->
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">£${item.price.toFixed(2)}</div>
                    <div>Qty: ${item.quantity || 1}</div>
                    <!-- Remove button - calls removeFromCart with item id -->
                    <div class="cart-item-remove" onclick="removeFromCart('${item.id}')">Remove</div>
                </div>
            </div>
        `;
    });
    
    // ===== UPDATE THE DOM =====
    cartItems.innerHTML = html;                     // Update cart items
    if (cartTotal) cartTotal.textContent = `£${total.toFixed(2)}`; // Update total
}

// ============================================================================
// FUNCTION: updateHeaderCartCount
// ============================================================================
// This function updates the cart count badge in the header next to the bag icon.
// It reads cart data from localStorage and displays the total number of items.
function updateHeaderCartCount() {
    // Get cart data from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Calculate total number of items (sum of quantities)
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    // Update the header cart count badge
    const headerCount = document.getElementById('cartCountHeader');
    if (headerCount) {
        headerCount.textContent = totalItems;
    }
}

// ============================================================================
// FUNCTION: removeFromCart
// ============================================================================
// This function removes an item from the shopping cart.
// Parameters:
//   id - Unique identifier of the product to remove
function removeFromCart(id) {
    // ===== GET CURRENT CART =====
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // ===== FILTER OUT THE ITEM =====
    // filter() creates a new array with all items that don't match the id
    // This effectively removes the item we want to delete
    cart = cart.filter(item => item.id !== id);
    
    // ===== SAVE UPDATED CART =====
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // ===== UPDATE DISPLAY =====
    updateCartDisplay();
    updateHeaderCartCount(); // Update header cart count
}

// ============================================================================
// ADD PULSE ANIMATION STYLE
// ============================================================================
// This creates a CSS keyframe animation dynamically and adds it to the page.
// The pulse animation makes the cart button grow and shrink briefly to
// provide visual feedback when items are added.
const style = document.createElement('style');
style.textContent = `
    /* Define the keyframes for the pulse animation */
    @keyframes pulse {
        0% { transform: scale(1); }      /* Normal size */
        50% { transform: scale(1.1); }    /* Grow to 110% */
        100% { transform: scale(1); }      /* Back to normal */
    }
    
    /* Class that applies the pulse animation */
    .cart-toggle.pulse {
        animation: pulse 0.3s ease;  /* 0.3s duration with easing */
    }
`;
// Add the style element to the document head
document.head.appendChild(style);
