// Simple JavaScript for interactive elements

document.addEventListener('DOMContentLoaded', function() {
    
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
    
    // ===== MOBILE MENU TOGGLE (optional enhancement) =====
    // This is a simple placeholder - you could expand this later
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-toggle';
    mobileMenuBtn.setAttribute('aria-label', 'Toggle menu');
    mobileMenuBtn.innerHTML = '☰';
    
    const header = document.querySelector('.header-container');
    const nav = document.querySelector('.main-nav');
    
    // Only add mobile toggle on small screens (via CSS media query)
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
                nav.style.display = ''; // Reset to default (flex/grid)
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
