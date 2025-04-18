// Fallback animation system to ensure content appears when scrolling
// This script provides additional animation triggers if the main system fails

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing fallback animation system');
    
    // Wait a short time to ensure main script has run
    setTimeout(initFallbackSystem, 500);
    
    // Also add a manual trigger for animations
    addManualAnimationTrigger();
});

// Initialize fallback animation system
function initFallbackSystem() {
    // Check if any sections are already visible
    const visibleSections = document.querySelectorAll('.content-section.visible, .fade-in-left.visible, .fade-in-right.visible, .zoom-in.visible, .rotate-in.visible');
    
    // If no sections are visible yet, apply fallback
    if (visibleSections.length === 0) {
        console.log('No visible sections detected, applying fallback animation system');
        
        // Force first section to be visible immediately
        const firstSection = document.querySelector('.content-section, .fade-in-left, .fade-in-right, .zoom-in, .rotate-in');
        if (firstSection) {
            firstSection.classList.add('visible');
            makeChildElementsVisible(firstSection);
        }
        
        // Add scroll-based fallback with simpler detection
        addScrollFallback();
        
        // Add timer-based fallback
        addTimerFallback();
        
        // Add scroll position markers
        addScrollPositionMarkers();
    } else {
        console.log('Sections already visible, fallback not needed');
    }
    
    // Add global error handler for animation issues
    window.addEventListener('error', function(e) {
        console.log('Error detected, triggering fallback animations', e);
        forceAllElementsVisible();
    });
}

// Add scroll-based fallback with simpler detection
function addScrollFallback() {
    const activeContainer = document.querySelector('.design.active');
    
    // Simple scroll handler as fallback
    activeContainer.addEventListener('scroll', function() {
        const scrollTop = activeContainer.scrollTop;
        const viewportHeight = activeContainer.clientHeight;
        
        // Get all sections
        const sections = activeContainer.querySelectorAll('.content-section, .fade-in-left, .fade-in-right, .zoom-in, .rotate-in');
        
        sections.forEach(function(section) {
            // Simple position calculation
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // Very generous threshold to ensure visibility
            if (scrollTop + viewportHeight > sectionTop && scrollTop < sectionTop + sectionHeight) {
                if (!section.classList.contains('visible')) {
                    console.log('Fallback making section visible:', section);
                    section.classList.add('visible');
                    makeChildElementsVisible(section);
                }
            }
        });
    }, { passive: true });
}

// Add timer-based fallback
function addTimerFallback() {
    // Set a timer to gradually reveal sections regardless of scroll
    let sectionIndex = 0;
    const revealInterval = setInterval(function() {
        const sections = document.querySelectorAll('.content-section, .fade-in-left, .fade-in-right, .zoom-in, .rotate-in');
        
        if (sectionIndex < sections.length) {
            const section = sections[sectionIndex];
            if (!section.classList.contains('visible')) {
                console.log('Timer fallback making section visible:', section);
                section.classList.add('visible');
                makeChildElementsVisible(section);
            }
            sectionIndex++;
        } else {
            // All sections revealed, clear interval
            clearInterval(revealInterval);
        }
    }, 2000); // Check every 2 seconds
    
    // Clear interval after 30 seconds to avoid unnecessary processing
    setTimeout(function() {
        clearInterval(revealInterval);
    }, 30000);
}

// Add scroll position markers
function addScrollPositionMarkers() {
    const activeContainer = document.querySelector('.design.active');
    const contentWrapper = activeContainer.querySelector('[id^="content-wrapper"]');
    
    // Create markers at different scroll positions
    for (let i = 1; i <= 5; i++) {
        const marker = document.createElement('div');
        marker.className = 'scroll-marker';
        marker.style.position = 'absolute';
        marker.style.left = '0';
        marker.style.width = '100%';
        marker.style.height = '2px';
        marker.style.background = 'transparent';
        marker.style.top = `${i * 20}%`;
        marker.style.zIndex = '-1';
        
        // Add data attribute for debugging
        marker.setAttribute('data-position', `${i * 20}%`);
        
        contentWrapper.appendChild(marker);
        
        // Add intersection observer for this marker
        if ('IntersectionObserver' in window) {
            const markerObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    console.log(`Scroll marker at ${i * 20}% triggered`);
                    // Reveal sections near this marker
                    revealSectionsNearPosition(i * 20);
                }
            }, {
                root: activeContainer,
                threshold: 0.1
            });
            
            markerObserver.observe(marker);
        }
    }
}

// Reveal sections near a specific position percentage
function revealSectionsNearPosition(positionPercent) {
    const activeContainer = document.querySelector('.design.active');
    const contentHeight = activeContainer.scrollHeight;
    const targetPosition = (contentHeight * positionPercent) / 100;
    
    // Get all sections
    const sections = activeContainer.querySelectorAll('.content-section, .fade-in-left, .fade-in-right, .zoom-in, .rotate-in');
    
    sections.forEach(function(section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        // Check if section is near the target position
        if (Math.abs(sectionTop - targetPosition) < contentHeight * 0.2) { // Within 20% of content height
            if (!section.classList.contains('visible')) {
                console.log('Position marker making section visible:', section);
                section.classList.add('visible');
                makeChildElementsVisible(section);
            }
        }
    });
}

// Add manual animation trigger
function addManualAnimationTrigger() {
    // Create a hidden button that can be triggered by tapping in a specific area
    const triggerButton = document.createElement('button');
    triggerButton.textContent = 'Reveal Content';
    triggerButton.style.position = 'fixed';
    triggerButton.style.bottom = '10px';
    triggerButton.style.left = '10px';
    triggerButton.style.zIndex = '1000';
    triggerButton.style.padding = '8px 12px';
    triggerButton.style.backgroundColor = '#2575fc';
    triggerButton.style.color = 'white';
    triggerButton.style.border = 'none';
    triggerButton.style.borderRadius = '4px';
    triggerButton.style.opacity = '0.7';
    
    triggerButton.addEventListener('click', function() {
        console.log('Manual animation trigger activated');
        forceAllElementsVisible();
    });
    
    document.body.appendChild(triggerButton);
    
    // Also add a triple-tap anywhere to trigger animations
    let tapCount = 0;
    let lastTapTime = 0;
    
    document.addEventListener('touchend', function(e) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTapTime;
        
        if (tapLength < 500 && tapLength > 0) {
            tapCount++;
            
            if (tapCount >= 3) {
                console.log('Triple tap detected, triggering animations');
                forceAllElementsVisible();
                tapCount = 0;
            }
        } else {
            tapCount = 1;
        }
        
        lastTapTime = currentTime;
    });
}

// Force all elements to be visible
function forceAllElementsVisible() {
    // Get all sections
    const sections = document.querySelectorAll('.content-section, .fade-in-left, .fade-in-right, .zoom-in, .rotate-in');
    
    sections.forEach(function(section) {
        section.classList.add('visible');
        makeChildElementsVisible(section);
    });
    
    // Also make all temporary content visible
    document.querySelectorAll('.temporary-content').forEach(function(element) {
        element.classList.add('visible');
    });
    
    // Update progress bar to 100%
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        progressBar.style.width = '100%';
    }
}

// Make child elements visible (copied from main script for independence)
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

// Add a CSS-only fallback animation system
(function addCssFallback() {
    // Create a style element
    const style = document.createElement('style');
    
    // CSS that will gradually reveal elements regardless of scroll
    style.textContent = `
        /* CSS-only fallback animation system */
        @media (max-width: 768px) {
            /* Ensure first section is always visible */
            .content-section:first-child,
            .fade-in-left:first-child,
            .fade-in-right:first-child,
            .zoom-in:first-child,
            .rotate-in:first-child {
                opacity: 1 !important;
                transform: none !important;
            }
            
            /* Gradually reveal sections with pure CSS animation */
            .content-section:nth-child(2) { animation: forceVisible 0.5s 1s forwards; }
            .content-section:nth-child(3) { animation: forceVisible 0.5s 2s forwards; }
            .content-section:nth-child(4) { animation: forceVisible 0.5s 3s forwards; }
            .content-section:nth-child(5) { animation: forceVisible 0.5s 4s forwards; }
            .content-section:nth-child(6) { animation: forceVisible 0.5s 5s forwards; }
            .content-section:nth-child(7) { animation: forceVisible 0.5s 6s forwards; }
            .content-section:nth-child(8) { animation: forceVisible 0.5s 7s forwards; }
            
            /* Animation to force visibility */
            @keyframes forceVisible {
                to {
                    opacity: 1;
                    transform: none;
                }
            }
            
            /* Ensure highlight lines appear */
            .highlight-line {
                animation: expandWidth 1s 1.5s forwards;
            }
            
            @keyframes expandWidth {
                to {
                    width: 100%;
                }
            }
            
            /* Ensure quote containers appear */
            .quote-container {
                animation: fadeIn 1s 2s forwards;
            }
            
            .quote-text, .quote-author {
                animation: fadeIn 1s 2.5s forwards;
            }
            
            @keyframes fadeIn {
                to {
                    opacity: 1;
                    transform: none;
                }
            }
        }
    `;
    
    // Add the style element to the head
    document.head.appendChild(style);
})();
