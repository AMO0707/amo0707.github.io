document.addEventListener('DOMContentLoaded', function () {
    console.log('Initializing personal webpage with fullscreen sections');
    // Get all content sections
    const contentSections = document.querySelectorAll('.content-section');

    // Apply animation classes to sections
    applyAnimationClasses(contentSections);

    // Add highlight lines to sections
    addHighlightLines(contentSections);

    // Initialize scroll progress bar
    initScrollProgressBar();

    // Track scroll direction
    initScrollDirectionTracking();

    // Initialize intersection observer for better scroll detection
    initIntersectionObserver(contentSections);

    
    // Initialize dynamic section heights
    initSimpleDynamicSections(contentSections);
    
    // Re-calculate on window resize
    window.addEventListener('resize', function() {
        initSimpleDynamicSections(contentSections);
    });

    console.log('Initialization complete');
});

function initSimpleDynamicSections(sections) {
    const viewportHeight = window.innerHeight;
    
    sections.forEach((section) => {
        // Get the actual content height (all children combined)
        let contentHeight = 0;
        Array.from(section.children).forEach(child => {
            contentHeight += child.offsetHeight;
        });
        
        // Add padding to content height
        contentHeight += 100; // Extra padding for spacing
        
        // Classify section based on content length
        const isLongSection = contentHeight > viewportHeight * 0.8;
        
        // Apply appropriate styles based on section type
        if (isLongSection) {
            // For long sections, remove fixed height and add appropriate padding
            section.style.minHeight = 'auto';
            section.style.paddingTop = '5vh';
            section.style.paddingBottom = '5vh';
            section.classList.add('long-section');
            section.classList.remove('short-section');
        } else {
            // For short sections, maintain full viewport height
            section.style.minHeight = '100vh';
            section.style.paddingTop = '0';
            section.style.paddingBottom = '0';
            section.classList.add('short-section');
            section.classList.remove('long-section');
        }
    });
    
    // Initialize simple intersection observer
    initSimpleObserver(sections);
}

/**
 * Initialize a simple intersection observer for section visibility
 */
function initSimpleObserver(sections) {
    // Create options for the observer
    const observerOptions = {
        rootMargin: '0px',
        threshold: 0.3 // Lower threshold to trigger earlier
    };
    
    // Create the observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const section = entry.target;
            
            if (entry.isIntersecting) {
                // Element is entering the viewport
                if (!section.classList.contains('visible')) {
                    section.classList.add('visible');
                }
            }
        });
    }, observerOptions);
    
    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Apply different animation classes to sections
function applyAnimationClasses(sections) {
    console.log('Applying animation classes');

    sections.forEach((section, index) => {
        // Initially add fade-in-up class to all sections
        section.classList.add('fade-in-up');

        // Store the original animation class for reference
        section.setAttribute('data-original-animation', 'fade-in-up');

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
        // Add highlight line after every heading
        const heading = section.querySelector('h2');
        if (heading) {
            const highlightLine = document.createElement('div');
            highlightLine.className = 'highlight-line';
            heading.parentNode.insertBefore(highlightLine, heading.nextSibling);
        }
    });
}

// Initialize scroll progress bar
function initScrollProgressBar() {
    window.addEventListener('scroll', updateScrollProgressBar, { passive: true });
    updateScrollProgressBar(); // Initial update
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

// Track scroll direction
let lastScrollTop = 0;
let scrollDirection = 'down';

function initScrollDirectionTracking() {
    window.addEventListener('scroll', function () {
        const st = window.scrollY || document.documentElement.scrollTop;

        if (st > lastScrollTop) {
            // Scrolling down
            if (scrollDirection !== 'down') {
                scrollDirection = 'down';
                console.log('Scroll direction changed to DOWN');

                // Update animation classes for all sections
                updateAnimationClasses('fade-in-up');
            }
        } else if (st < lastScrollTop) {
            // Scrolling up
            if (scrollDirection !== 'up') {
                scrollDirection = 'up';
                console.log('Scroll direction changed to UP');

                // Update animation classes for all sections
                updateAnimationClasses('fade-in-down');

                // When direction changes to up, reset all sections that are not in view
                // This ensures they'll animate again when scrolled back into view
                resetSectionsOutOfView();
            }
        }

        lastScrollTop = st <= 0 ? 0 : st; // For mobile or negative scrolling
    }, { passive: true });
}

// Update animation classes based on scroll direction
// function updateAnimationClasses(newAnimationClass) {
//     const sections = document.querySelectorAll('.content-section');

//     sections.forEach(section => {
//         // Remove current animation classes
//         section.classList.remove('fade-in-up', 'fade-in-down');

//         // Add new animation class
//         section.classList.add(newAnimationClass);
//     });
// }

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('close-button').addEventListener('click', function () {
        window.close();

        // Fallback for browsers that block window.close()
        // This will redirect to a blank page if window.close() fails
        setTimeout(function () {
            window.location.href = 'about:blank';
        }, 300);
    });

});

function updateAnimationClasses(newAnimationClass) {
    // Don't change classes of sections already in view
    const sections = document.querySelectorAll('.content-section:not(.visible)');

    sections.forEach(section => {
        // Remove current animation classes
        section.classList.remove('fade-in-up', 'fade-in-down');

        // Add new animation class
        section.classList.add(newAnimationClass);
    });
}

// Reset sections that are not currently in the viewport
function resetSectionsOutOfView() {
    const sections = document.querySelectorAll('.content-section');

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // If section is not in viewport
        if (rect.bottom <= 0 || rect.top >= viewportHeight) {
            // Remove visible class to reset animation state
            section.classList.remove('visible');

            // Also reset child elements
            const childElements = section.querySelectorAll('.highlight-line, .experience-item, .education-item, .project-item, .skill-item');
            childElements.forEach(element => {
                element.classList.remove('visible');
            });
        }
    });
}

// Initialize Intersection Observer for better scroll detection
function initIntersectionObserver(sections) {
    console.log('Initializing Intersection Observer for fullscreen sections');

    // Check if Intersection Observer API is available
    if ('IntersectionObserver' in window) {
        // Create options for the observer
        const options = {
            // Root margin to trigger slightly before/after element enters/exits viewport
            //rootMargin: '-10% 0px -10% 0px',
            rootMargin: '0px',
            threshold: 0.5
        };

        // Create the observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const section = entry.target;

                if (entry.isIntersecting) {
                    // Element is entering the viewport
                    console.log('Section entering viewport:', section.dataset.index);

                    // Add visible class to trigger animation
                    if (!section.classList.contains('visible')) {
                        section.classList.add('visible');

                        // Also make child elements visible with animation
                        animateChildElements(section);
                    }
                } else {
                    // Element is exiting the viewport
                    // If scrolling up, remove visible class to prepare for re-animation
                    if (scrollDirection === 'up') {
                        section.classList.remove('visible');
                        resetChildElements(section);
                    }
                }
            });
        }, options);

        // Observe all sections
        sections.forEach(section => {
            observer.observe(section);
        });
    } else {
        console.log('Intersection Observer not supported, falling back to scroll detection');
        // Fallback to traditional scroll event
        window.addEventListener('scroll', handleScrollFallback, { passive: true });
    }
}

// Animate child elements with staggered delay
function animateChildElements(section) {
    // Highlight lines
    const highlightLines = section.querySelectorAll('.highlight-line');
    highlightLines.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add('visible');
        }, 200);
    });

    // Experience, education, and project items
    const items = section.querySelectorAll('.experience-item, .education-item, .project-item');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('visible');
        }, 300 + (index * 150));
    });

    // Skill items
    const skillItems = section.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('visible');
        }, 300 + (index * 100));
    });
}

// Reset child elements animation state
function resetChildElements(section) {
    const elements = section.querySelectorAll('.highlight-line, .experience-item, .education-item, .project-item, .skill-item');
    elements.forEach(element => {
        element.classList.remove('visible');
    });
}

// Fallback scroll handler for browsers without Intersection Observer
function handleScrollFallback() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight;

    // Update scroll progress
    updateScrollProgressBar();

    // Get all content sections
    const sections = document.querySelectorAll('.content-section');

    sections.forEach(function (section) {
        // Calculate element position relative to viewport
        const rect = section.getBoundingClientRect();

        // Check if section is in viewport
        if (rect.top < viewportHeight * 0.9 && rect.bottom > viewportHeight * 0.1) {
            // Section is visible
            if (!section.classList.contains('visible')) {
                section.classList.add('visible');
                animateChildElements(section);
            }
        } else {
            // Section is not visible
            // If scrolling up, remove visible class to prepare for re-animation
            if (scrollDirection === 'up') {
                section.classList.remove('visible');
                resetChildElements(section);
            }
        }
    });
}

// Handle window resize events
window.addEventListener('resize', function () {
    // Recalculate section visibility on resize
    if (!('IntersectionObserver' in window)) {
        handleScrollFallback();
    }
});

// Parallax effect for background elements
window.addEventListener('scroll', function () {
    const scrollPosition = window.scrollY;

    document.querySelectorAll('.parallax-layer').forEach(layer => {
        const speed = layer.getAttribute('data-speed');
        const yPos = -(scrollPosition * speed);
        layer.style.transform = `translateY(${yPos}px)`;
    });
});
