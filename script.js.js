// Simplified JavaScript for personal webpage with scroll-based content visibility
// Optimized for both PC and mobile devices

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing simplified personal webpage');
    
    // Get all content sections
    const contentSections = document.querySelectorAll('.content-section');
    
    // Apply animation classes to sections
    applyAnimationClasses(contentSections);
    
    // Add highlight lines to sections
    addHighlightLines(contentSections);
    
    // Initialize scroll event listener
    initScrollListener();
    
    // Force initial check for element visibility
    setTimeout(function() {
        checkElementsVisibility();
    }, 100);
    
    // Initialize intersection observer for better scroll detection
    initIntersectionObserver(contentSections);
    
    console.log('Initialization complete');
});

// Apply different animation classes to sections
function applyAnimationClasses(sections) {
    console.log('Applying animation classes');
    const animationClasses = ['fade-in-left', 'fade-in-right', 'zoom-in'];
    
    sections.forEach((section, index) => {
        // Add animation class based on index
        const animationClass = animationClasses[index % animationClasses.length];
        section.classList.add(animationClass);
        
        // Apply staggered animation to items
        const items = section.querySelectorAll('.experience-item, .education-item, .project-item, .skill-item');
        items.forEach((item, itemIndex) => {
            item.style.transitionDelay = `${0.1 * itemIndex}s`;
        });
    });
}

// Add highlight lines to sections
function addHighlightLines(sections) {
    console.log('Adding highlight lines');
    
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

// Initialize scroll event listener
function initScrollListener() {
    console.log('Initializing scroll listener');
    
    // Add scroll event listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Also listen for touchmove events on mobile
    if ('ontouchstart' in window) {
        window.addEventListener('touchmove', handleScroll, { passive: true });
    }
}

// Handle scroll events with throttling for better performance
let isScrolling = false;
function handleScroll() {
    // Update scroll progress bar
    updateScrollProgressBar();
    
    // Use requestAnimationFrame for visual updates
    if (!isScrolling) {
        window.requestAnimationFrame(function() {
            checkElementsVisibility();
            isScrolling = false;
        });
    }
    
    isScrolling = true;
}

// Update scroll progress bar
function updateScrollProgressBar() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        progressBar.style.width = `${scrollPercentage}%`;
    }
}

// Check elements visibility
function checkElementsVisibility() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight;
    
    // Get all content sections and their child elements
    const sections = document.querySelectorAll('.content-section, .fade-in-left, .fade-in-right, .zoom-in');
    
    sections.forEach(function(section) {
        // Calculate element position relative to viewport
        const rect = section.getBoundingClientRect();
        
        // Check if section is in viewport with a buffer
        if (rect.top < viewportHeight - 50 && rect.bottom > 50) {
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
    
    // Experience items
    const experienceItems = section.querySelectorAll('.experience-item:not(.visible), .education-item:not(.visible), .project-item:not(.visible)');
    experienceItems.forEach(item => item.classList.add('visible'));
    
    // Skill items
    const skillItems = section.querySelectorAll('.skill-item:not(.visible)');
    skillItems.forEach(item => item.classList.add('visible'));
}

// Initialize Intersection Observer for better scroll detection
function initIntersectionObserver(sections) {
    console.log('Initializing Intersection Observer');
    
    // Check if Intersection Observer API is available
    if ('IntersectionObserver' in window) {
        const options = {
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
                }
            });
        }, options);
        
        // Observe all sections
        sections.forEach(section => {
            observer.observe(section);
        });
    } else {
        console.log('Intersection Observer not supported, falling back to scroll detection');
    }
}

// Add a manual reveal button for accessibility
(function addManualRevealButton() {
    const revealButton = document.createElement('button');
    revealButton.textContent = 'Show All Content';
    revealButton.className = 'reveal-button';
    revealButton.addEventListener('click', function() {
        document.querySelectorAll('.content-section, .fade-in-left, .fade-in-right, .zoom-in, .highlight-line, .experience-item, .education-item, .project-item, .skill-item')
            .forEach(el => el.classList.add('visible'));
    });
    document.body.appendChild(revealButton);
})();

// Handle window resize events
window.addEventListener('resize', function() {
    checkElementsVisibility();
});
