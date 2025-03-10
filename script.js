// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Navigation menu functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navItems = document.querySelectorAll('.nav-menu li');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Add delay to each menu item for staggered animation
            navItems.forEach((item, index) => {
                item.style.setProperty('--i', index);
            });
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('header nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
            
            // Get the target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
            
            // Update active link
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Header scroll effect
    const header = document.querySelector('header');
    const backToTop = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        // Header effect
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
            if (backToTop) backToTop.classList.add('active');
        } else {
            header.classList.remove('scrolled');
            if (backToTop) backToTop.classList.remove('active');
        }
        
        // Update active navigation based on scroll position
        const scrollPosition = window.scrollY + window.innerHeight/2;
        
        // Find which section is currently in view
        let currentSection = '';
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = sectionId;
            }
        });
        
        // Update the active class on navigation links
        if (currentSection !== '') {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    // Back to top button
    if (backToTop) {
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Gallery lightbox functionality
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('#lightbox-img');
    const closeLightbox = document.querySelector('.close-lightbox');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    let currentImgIndex = 0;
    const galleryImages = [];
    
    // Collect all gallery images
    galleryItems.forEach((item, index) => {
        const imgSrc = item.querySelector('img').getAttribute('src');
        galleryImages.push(imgSrc);
        
        // Open lightbox on click
        item.addEventListener('click', function() {
            lightboxImg.setAttribute('src', imgSrc);
            currentImgIndex = index;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
        });
    });
    
    // Close lightbox
    if (closeLightbox) {
        closeLightbox.addEventListener('click', function() {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        });
    }
    
    // Lightbox navigation
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', function() {
            currentImgIndex = (currentImgIndex - 1 + galleryImages.length) % galleryImages.length;
            lightboxImg.setAttribute('src', galleryImages[currentImgIndex]);
        });
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', function() {
            currentImgIndex = (currentImgIndex + 1) % galleryImages.length;
            lightboxImg.setAttribute('src', galleryImages[currentImgIndex]);
        });
    }
    
    // Close lightbox with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Animate elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.skill-level, .gallery-item, .contact-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 50) {
                element.classList.add('animate');
            }
        });
    };
    
    // Run animation check on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Run once on page load
    animateOnScroll();
    
    // Quotes slider functionality
    const quoteItems = document.querySelectorAll('.quote-item');
    const quoteDots = document.querySelectorAll('.quote-dots .dot');
    let currentQuote = 0;
    let quoteInterval;
    
    // Function to show a specific quote
    const showQuote = (index) => {
        // Hide all quotes
        quoteItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            item.style.position = 'absolute';
        });
        
        // Show the selected quotes
        quoteItems[index].style.opacity = '1';
        quoteItems[index].style.transform = 'scale(1)';
        quoteItems[index].style.position = 'relative';
        
        // Update active dot
        quoteDots.forEach(dot => dot.classList.remove('active'));
        quoteDots[index].classList.add('active');
        
        currentQuote = index;
    };
    
    // Function to advance to the next quote
    const nextQuote = () => {
        const nextIndex = (currentQuote + 1) % quoteItems.length;
        showQuote(nextIndex);
    };
    
    // Function to start automatic sliding
    const startAutoSlide = () => {
        // Clear any existing interval first
        if (quoteInterval) {
            clearInterval(quoteInterval);
        }
        // Set new interval to change quote every 3 seconds
        quoteInterval = setInterval(nextQuote, 3000);
    };
    
    // Add click event to dots
    quoteDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showQuote(index);
            
            // Clear the interval when user manually selects a quote
            if (quoteInterval) {
                clearInterval(quoteInterval);
            }
            
            // Restart the automatic sliding after a brief pause
            setTimeout(startAutoSlide, 5000);
        });
    });
    
    // Initialize quotes slider
    if (quoteItems.length > 0) {
        showQuote(0);
        // Start automatic sliding
        startAutoSlide();
    }
});
