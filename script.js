// Enhanced scroll detection and animation system
// This script replaces the previous script.js with a more reliable implementation

// Global variables
let contentSections = [];
let activeDesign = 'design1';
let dynamicContentCount = 0;
const maxDynamicSections = 10; // Maximum number of additional sections to load
let isScrolling = false;
let scrollTimeout;
let lastScrollTop = 0;
let scrollDirection = 'down';
let viewportHeight = window.innerHeight;
let documentHeight = document.body.scrollHeight;
let scrollPercentage = 0;

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded - initializing enhanced scroll features');
    
    // Get all initial content sections
    contentSections = document.querySelectorAll('.content-section');
    
    // Clone content from design1 to design2
    const design1Content = document.getElementById('content-wrapper');
    const design2Content = document.getElementById('content-wrapper-alt');
    design2Content.innerHTML = design1Content.innerHTML;
    
    // Apply animation classes to sections
    applyAnimationClasses();
    
    // Add highlight lines to sections
    addHighlightLines();
    
    // Add quote containers
    addQuoteContainers();
    
    // Initialize scroll event listener with passive option for better performance
    initScrollListener();
    
    // Initialize design switcher
    document.getElementById('switch-design').addEventListener('click', switchDesign);
    
    // Listen for resize events with debounce
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 100);
    });
    
    // Force initial check for element visibility
    setTimeout(function() {
        updateScrollMetrics();
        checkAllElementsVisibility();
    }, 100);
    
    // Add intersection observer as a fallback for scroll detection
    initIntersectionObserver();
    
    // Log initialization complete
    console.log('Enhanced scroll features initialized');
});

// Apply different animation classes to sections
function applyAnimationClasses() {
    console.log('Applying animation classes to sections');
    const sections = document.querySelectorAll('.content-section');
    const animationClasses = ['fade-in-left', 'fade-in-right', 'zoom-in', 'rotate-in'];
    
    sections.forEach((section, index) => {
        // Keep content-section class for styling
        
        // Add animation class based on index
        const animationClass = animationClasses[index % animationClasses.length];
        section.classList.add(animationClass);
        
        // Add parallax background to some sections
        if (index % 4 === 0) {
            section.classList.add('parallax-bg');
        }
        
        // Apply staggered animation to experience/education items
        const items = section.querySelectorAll('.experience-item, .education-item, .project-item');
        items.forEach((item, itemIndex) => {
            item.style.transitionDelay = `${0.2 * itemIndex}s`;
        });
        
        // Apply staggered animation to skill items
        const skillItems = section.querySelectorAll('.skill-item');
        skillItems.forEach((item, itemIndex) => {
            item.style.transitionDelay = `${0.1 * itemIndex}s`;
        });
    });
}

// Add highlight lines to sections
function addHighlightLines() {
    console.log('Adding highlight lines to sections');
    const sections = document.querySelectorAll('.content-section');
    
    sections.forEach((section, index) => {
        // Add highlight line after every second heading
        if (index % 2 === 1) {
            const heading = section.querySelector('h2');
            if (heading) {
                const highlightLine = document.createElement('div');
                highlightLine.className = 'highlight-line';
                heading.parentNode.insertBefore(highlightLine, heading.nextSibling);
            }
        }
    });
}

// Add quote containers
function addQuoteContainers() {
    console.log('Adding quote containers');
    const quotes = [
        { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
        { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" }
    ];
    
    // Add quotes to specific sections
    const sections = document.querySelectorAll('.content-section');
    
    sections.forEach((section, index) => {
        // Add quote to every third section
        if (index % 3 === 2 && index < quotes.length * 3) {
            const quoteIndex = Math.floor(index / 3);
            const quote = quotes[quoteIndex];
            
            const quoteContainer = document.createElement('div');
            quoteContainer.className = 'quote-container';
            
            const quoteText = document.createElement('div');
            quoteText.className = 'quote-text';
            quoteText.textContent = `"${quote.text}"`;
            
            const quoteAuthor = document.createElement('div');
            quoteAuthor.className = 'quote-author';
            quoteAuthor.textContent = `— ${quote.author}`;
            
            quoteContainer.appendChild(quoteText);
            quoteContainer.appendChild(quoteAuthor);
            
            // Add after the first paragraph
            const firstParagraph = section.querySelector('p');
            if (firstParagraph && firstParagraph.nextSibling) {
                section.insertBefore(quoteContainer, firstParagraph.nextSibling);
            } else {
                section.appendChild(quoteContainer);
            }
        }
    });
}

// Initialize scroll event listener
function initScrollListener() {
    console.log('Initializing scroll listener');
    // Get the active design container
    const activeContainer = document.querySelector('.design.active');
    
    // Update scroll metrics
    updateScrollMetrics();
    
    // Add scroll event listener with passive option for better performance
    activeContainer.addEventListener('scroll', handleScroll, { passive: true });
    
    // Also listen for touchmove events on mobile
    if ('ontouchstart' in window) {
        activeContainer.addEventListener('touchmove', handleScroll, { passive: true });
    }
}

// Handle scroll events with throttling for better performance
function handleScroll(e) {
    // Get the active design container
    const activeContainer = document.querySelector('.design.active');
    const scrollTop = activeContainer.scrollTop;
    
    // Determine scroll direction
    scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
    lastScrollTop = scrollTop;
    
    // Update scroll percentage
    updateScrollMetrics();
    
    // Update progress bar immediately for smooth effect
    updateScrollProgressBar();
    
    // Use requestAnimationFrame for visual updates
    if (!isScrolling) {
        window.requestAnimationFrame(function() {
            checkAllElementsVisibility();
            checkTemporaryElements();
            checkInfiniteScroll();
        });
    }
    
    isScrolling = true;
    
    // Clear the timeout
    clearTimeout(scrollTimeout);
    
    // Set a timeout to run after scrolling ends
    scrollTimeout = setTimeout(function() {
        isScrolling = false;
        // Final check after scrolling stops
        checkAllElementsVisibility();
    }, 100);
}

// Update scroll metrics
function updateScrollMetrics() {
    const activeContainer = document.querySelector('.design.active');
    viewportHeight = activeContainer.clientHeight;
    documentHeight = activeContainer.scrollHeight;
    scrollPercentage = (lastScrollTop / (documentHeight - viewportHeight)) * 100;
}

// Update scroll progress bar
function updateScrollProgressBar() {
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        progressBar.style.width = `${scrollPercentage}%`;
    }
}

// Check temporary elements visibility based on scroll progress
function checkTemporaryElements() {
    // Top notification
    const topNotification = document.querySelector('.temp-top');
    if (topNotification) {
        if (scrollPercentage >= 0 && scrollPercentage <= 20) {
            topNotification.classList.add('visible');
        } else {
            topNotification.classList.remove('visible');
        }
    }
    
    // Middle notification
    const middleNotification = document.querySelector('.temp-middle');
    if (middleNotification) {
        if (scrollPercentage >= 40 && scrollPercentage <= 60) {
            middleNotification.classList.add('visible');
        } else {
            middleNotification.classList.remove('visible');
        }
    }
    
    // Bottom notification
    const bottomNotification = document.querySelector('.temp-bottom');
    if (bottomNotification) {
        if (scrollPercentage >= 80 && scrollPercentage <= 100) {
            bottomNotification.classList.add('visible');
        } else {
            bottomNotification.classList.remove('visible');
        }
    }
}

// Check all elements visibility
function checkAllElementsVisibility() {
    const activeContainer = document.querySelector('.design.active');
    const scrollTop = activeContainer.scrollTop;
    
    // Get all content sections and their child elements
    const sections = activeContainer.querySelectorAll('.content-section, .fade-in-left, .fade-in-right, .zoom-in, .rotate-in');
    
    sections.forEach(function(section) {
        // Calculate element position relative to viewport
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + scrollTop - activeContainer.offsetTop;
        const sectionHeight = rect.height;
        
        // Check if section is in viewport with a buffer
        // More generous threshold to ensure elements become visible
        if (scrollTop + viewportHeight > sectionTop + 50 && 
            scrollTop < sectionTop + sectionHeight - 50) {
            
            // Add visible class if not already present
            if (!section.classList.contains('visible')) {
                console.log('Making section visible:', section);
                section.classList.add('visible');
            }
            
            // Also check for child elements that need their own animations
            makeChildElementsVisible(section);
        }
    });
}

// Make child elements visible
function makeChildElementsVisible(section) {
    // Highlight lines
    const highlightLines = section.querySelectorAll('.highlight-line:not(.visible)');
    highlightLines.forEach(line => line.classList.add('visible'));
    
    // Quote containers
    const quoteContainers = section.querySelectorAll('.quote-container:not(.visible)');
    quoteContainers.forEach(quote => quote.classList.add('visible'));
    
    // Experience items
    const experienceItems = section.querySelectorAll('.experience-item:not(.visible), .education-item:not(.visible), .project-item:not(.visible)');
    experienceItems.forEach(item => item.classList.add('visible'));
    
    // Skill items
    const skillItems = section.querySelectorAll('.skill-item:not(.visible)');
    skillItems.forEach(item => item.classList.add('visible'));
    
    // Mobile-specific elements
    const mobileElements = section.querySelectorAll('.mobile-reveal:not(.visible), .mobile-divider:not(.visible)');
    mobileElements.forEach(item => item.classList.add('visible'));
}

// Initialize Intersection Observer as a fallback for scroll detection
function initIntersectionObserver() {
    console.log('Initializing Intersection Observer');
    // Check if Intersection Observer API is available
    if ('IntersectionObserver' in window) {
        const options = {
            root: document.querySelector('.design.active'),
            rootMargin: '0px',
            threshold: 0.1 // Trigger when at least 10% of the element is visible
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Element is visible
                    entry.target.classList.add('visible');
                    
                    // Also make child elements visible
                    makeChildElementsVisible(entry.target);
                    
                    // Unobserve after making visible to improve performance
                    // observer.unobserve(entry.target);
                }
            });
        }, options);
        
        // Observe all sections
        document.querySelectorAll('.content-section, .fade-in-left, .fade-in-right, .zoom-in, .rotate-in').forEach(section => {
            observer.observe(section);
        });
    } else {
        console.log('Intersection Observer not supported, falling back to scroll detection');
    }
}

// Check if we need to load more content (infinite scroll)
function checkInfiniteScroll() {
    const activeContainer = document.querySelector('.design.active');
    const contentWrapper = activeContainer.querySelector('[id^="content-wrapper"]');
    const scrollTop = activeContainer.scrollTop;
    const contentHeight = contentWrapper.offsetHeight;
    
    // If we're near the bottom and haven't reached max sections
    if (scrollTop + viewportHeight > contentHeight - 300 && 
        dynamicContentCount < maxDynamicSections) {
        loadMoreContent();
    }
}

// Load more content dynamically
function loadMoreContent() {
    console.log('Loading more content');
    // Get template content
    const template = document.getElementById('content-template');
    if (!template) return;
    
    // Clone template content
    const newSection = document.importNode(template.content, true).querySelector('.content-section');
    
    // Update content to make it unique
    dynamicContentCount++;
    newSection.setAttribute('data-index', contentSections.length + dynamicContentCount);
    newSection.querySelector('h2').textContent = `Additional Section ${dynamicContentCount}`;
    
    // Add some random paragraphs
    const paragraphs = [
        "As you continue scrolling, you'll discover more about my journey and experiences. This section represents content that is dynamically loaded as you explore the page.",
        "The infinite scrolling feature allows this page to load content progressively, creating a smooth and engaging browsing experience without overwhelming you with information all at once.",
        "This approach to content presentation helps maintain performance while still allowing for rich, detailed information to be shared as you express interest by scrolling further.",
        "Feel free to continue exploring to see more dynamically generated content. In a real implementation, this would be meaningful information about your background, projects, or interests."
    ];
    
    // Add random paragraphs
    const pContainer = document.createElement('div');
    for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++) {
        const p = document.createElement('p');
        p.textContent = paragraphs[Math.floor(Math.random() * paragraphs.length)];
        pContainer.appendChild(p);
    }
    
    // Replace existing paragraph
    const existingP = newSection.querySelector('p');
    if (existingP && existingP.parentNode) {
        existingP.parentNode.replaceChild(pContainer, existingP);
    } else {
        newSection.appendChild(pContainer);
    }
    
    // Apply a random animation class
    const animationClasses = ['fade-in-left', 'fade-in-right', 'zoom-in', 'rotate-in'];
    const randomAnimationClass = animationClasses[Math.floor(Math.random() * animationClasses.length)];
    newSection.classList.add(randomAnimationClass);
    
    // Add to both designs
    document.getElementById('content-wrapper').appendChild(newSection.cloneNode(true));
    document.getElementById('content-wrapper-alt').appendChild(newSection.cloneNode(true));
    
    // Update scroll metrics after adding new content
    updateScrollMetrics();
    
    // Force check visibility of new section
    setTimeout(function() {
        checkAllElementsVisibility();
        
        // Also add to intersection observer if available
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        makeChildElementsVisible(entry.target);
                    }
                });
            }, {
                root: document.querySelector('.design.active'),
                threshold: 0.1
            });
            
            observer.observe(newSection);
        }
    }, 100);
}

// Handle resize events
function handleResize() {
    console.log('Handling resize event');
    updateScrollMetrics();
    checkAllElementsVisibility();
    
    // Check if mobile and apply optimizations
    if (window.innerWidth <= 768) {
        // Simplify some animations for better performance on mobile
        document.querySelectorAll('.rotate-in').forEach(el => {
            el.classList.remove('rotate-in');
            el.classList.add('fade-in-left');
        });
    }
}

// Switch between designs
function switchDesign() {
    console.log('Switching design');
    const design1 = document.getElementById('design1');
    const design2 = document.getElementById('design2');
    
    if (activeDesign === 'design1') {
        design1.classList.remove('active');
        design2.classList.add('active');
        activeDesign = 'design2';
    } else {
        design2.classList.remove('active');
        design1.classList.add('active');
        activeDesign = 'design1';
    }
    
    // Reinitialize scroll listener for the new active design
    initScrollListener();
    
    // Reset scroll position
    document.querySelector('.design.active').scrollTop = 0;
    
    // Force check visibility after design switch
    setTimeout(function() {
        updateScrollMetrics();
        checkAllElementsVisibility();
    }, 100);
}
