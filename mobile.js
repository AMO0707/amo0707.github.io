// Mobile-specific enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Check if mobile device
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Add mobile-specific CSS
        addMobileCss();
        
        // Add mobile scroll hint
        addMobileScrollHint();
        
        // Add swipe indicator
        addSwipeIndicator();
        
        // Add mobile notifications
        addMobileNotifications();
        
        // Add mobile reveal sections
        addMobileRevealSections();
        
        // Add floating elements
        addFloatingElements();
        
        // Add mobile dividers
        addMobileDividers();
        
        // Add tap highlight effect
        initTapHighlight();
        
        // Add pull-to-refresh indicator
        addPullIndicator();
        
        // Update scroll handler for mobile-specific elements
        enhanceMobileScrollHandler();
    }
});

// Add mobile CSS
function addMobileCss() {
    const mobileCssLink = document.createElement('link');
    mobileCssLink.rel = 'stylesheet';
    mobileCssLink.href = 'mobile-enhancements.css';
    document.head.appendChild(mobileCssLink);
}

// Add mobile scroll hint
function addMobileScrollHint() {
    const scrollHint = document.createElement('div');
    scrollHint.className = 'mobile-scroll-hint';
    scrollHint.textContent = 'Scroll down to explore';
    document.body.appendChild(scrollHint);
    
    // Hide after 4 seconds
    setTimeout(() => {
        scrollHint.classList.add('hidden');
    }, 4000);
}

// Add swipe indicator
function addSwipeIndicator() {
    const swipeIndicator = document.createElement('div');
    swipeIndicator.className = 'swipe-indicator';
    document.body.appendChild(swipeIndicator);
    
    // Hide after 5 seconds
    setTimeout(() => {
        swipeIndicator.classList.add('hidden');
    }, 5000);
}

// Add mobile notifications
function addMobileNotifications() {
    const notifications = [
        { text: "Welcome to my personal page", showAt: 5, hideAt: 15 },
        { text: "Discover my skills and experience", showAt: 30, hideAt: 40 },
        { text: "Keep scrolling for more content", showAt: 60, hideAt: 70 },
        { text: "Thanks for visiting!", showAt: 90, hideAt: 100 }
    ];
    
    notifications.forEach((notif, index) => {
        const notification = document.createElement('div');
        notification.className = 'mobile-notification';
        notification.style.top = `${index * 40}px`;
        notification.textContent = notif.text;
        notification.dataset.showAt = notif.showAt;
        notification.dataset.hideAt = notif.hideAt;
        document.body.appendChild(notification);
    });
}

// Add mobile reveal sections
function addMobileRevealSections() {
    const sections = document.querySelectorAll('.content-section');
    
    sections.forEach((section, index) => {
        // Apply to every third section
        if (index % 3 === 2) {
            section.classList.add('mobile-reveal');
            
            const revealButton = document.createElement('button');
            revealButton.className = 'mobile-reveal-button';
            revealButton.textContent = 'Tap to reveal more';
            section.appendChild(revealButton);
            
            // Add click event to reveal content
            revealButton.addEventListener('click', function() {
                section.classList.add('visible');
            });
        }
    });
}

// Add floating elements
function addFloatingElements() {
    for (let i = 1; i <= 3; i++) {
        const floatingElement = document.createElement('div');
        floatingElement.className = `floating-element floating-element-${i}`;
        document.body.appendChild(floatingElement);
    }
}

// Add mobile dividers
function addMobileDividers() {
    const sections = document.querySelectorAll('.content-section');
    
    sections.forEach((section, index) => {
        // Add after every second section
        if (index % 2 === 1 && index > 0) {
            const divider = document.createElement('div');
            divider.className = 'mobile-divider';
            
            // Insert after the section
            if (section.nextSibling) {
                section.parentNode.insertBefore(divider, section.nextSibling);
            } else {
                section.parentNode.appendChild(divider);
            }
        }
    });
}

// Initialize tap highlight effect
function initTapHighlight() {
    document.addEventListener('touchstart', function(e) {
        // Only add effect occasionally for aesthetic purposes
        if (Math.random() > 0.7) {
            const highlight = document.createElement('div');
            highlight.className = 'tap-highlight';
            highlight.style.left = `${e.touches[0].clientX}px`;
            highlight.style.top = `${e.touches[0].clientY}px`;
            document.body.appendChild(highlight);
            
            // Remove after animation completes
            setTimeout(() => {
                highlight.remove();
            }, 800);
        }
    });
}

// Add pull-to-refresh indicator
function addPullIndicator() {
    const pullIndicator = document.createElement('div');
    pullIndicator.className = 'pull-indicator';
    document.body.appendChild(pullIndicator);
    
    let startY = 0;
    let currentY = 0;
    
    document.addEventListener('touchstart', function(e) {
        const activeContainer = document.querySelector('.design.active');
        // Only activate at top of page
        if (activeContainer.scrollTop <= 0) {
            startY = e.touches[0].clientY;
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', handleTouchEnd);
        }
    });
    
    function handleTouchMove(e) {
        currentY = e.touches[0].clientY;
        const pullDistance = currentY - startY;
        
        if (pullDistance > 0) {
            // Prevent default scrolling behavior
            e.preventDefault();
            
            // Calculate pull percentage (max 100%)
            const pullPercent = Math.min(pullDistance / 100, 1);
            
            // Show pull indicator based on pull distance
            pullIndicator.style.transform = `translateY(${-100 + (pullPercent * 100)}%)`;
            
            if (pullPercent >= 1) {
                pullIndicator.classList.add('visible');
            }
        }
    }
    
    function handleTouchEnd() {
        // Reset pull indicator
        pullIndicator.style.transform = 'translateY(-100%)';
        pullIndicator.classList.remove('visible');
        
        // Remove event listeners
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        
        // If pulled enough, refresh content
        const pullDistance = currentY - startY;
        if (pullDistance > 100) {
            // Simulate content refresh
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }
    }
}

// Enhance scroll handler for mobile-specific elements
function enhanceMobileScrollHandler() {
    const activeContainer = document.querySelector('.design.active');
    
    activeContainer.addEventListener('scroll', function() {
        // Get scroll progress
        const scrollPosition = activeContainer.scrollTop;
        const documentHeight = activeContainer.scrollHeight;
        const viewportHeight = activeContainer.clientHeight;
        const scrollProgress = (scrollPosition / (documentHeight - viewportHeight)) * 100;
        
        // Update mobile notifications
        document.querySelectorAll('.mobile-notification').forEach(notification => {
            const showAt = parseFloat(notification.dataset.showAt);
            const hideAt = parseFloat(notification.dataset.hideAt);
            
            if (scrollProgress >= showAt && scrollProgress <= hideAt) {
                notification.classList.add('visible');
            } else {
                notification.classList.remove('visible');
            }
        });
        
        // Update floating elements
        if (scrollProgress > 20) {
            document.querySelector('.floating-element-1').classList.add('visible');
        } else {
            document.querySelector('.floating-element-1').classList.remove('visible');
        }
        
        if (scrollProgress > 40) {
            document.querySelector('.floating-element-2').classList.add('visible');
        } else {
            document.querySelector('.floating-element-2').classList.remove('visible');
        }
        
        if (scrollProgress > 60) {
            document.querySelector('.floating-element-3').classList.add('visible');
        } else {
            document.querySelector('.floating-element-3').classList.remove('visible');
        }
        
        // Update mobile dividers
        document.querySelectorAll('.mobile-divider').forEach(divider => {
            const dividerTop = divider.offsetTop;
            const dividerHeight = divider.offsetHeight;
            
            if (scrollPosition + viewportHeight > dividerTop && 
                scrollPosition < dividerTop + dividerHeight) {
                divider.classList.add('visible');
            }
        });
        
        // Hide scroll indicators after some scrolling
        if (scrollProgress > 15) {
            document.querySelector('.mobile-scroll-hint').classList.add('hidden');
            document.querySelector('.swipe-indicator').classList.add('hidden');
        }
    });
}
