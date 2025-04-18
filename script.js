// Global variables
let lastScrollPosition = 0;
let ticking = false;
let contentSections = [];
let activeDesign = 'design1';
let dynamicContentCount = 0;
const maxDynamicSections = 10; // Maximum number of additional sections to load
let temporaryElements = [];
let scrollProgress = 0;
let viewportHeight = 0;
let documentHeight = 0;
let isMobile = window.innerWidth <= 768;

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get all initial content sections
    contentSections = document.querySelectorAll('.content-section');
    
    // Clone content from design1 to design2
    const design1Content = document.getElementById('content-wrapper');
    const design2Content = document.getElementById('content-wrapper-alt');
    design2Content.innerHTML = design1Content.innerHTML;
    
    // Add scroll progress indicator
    createScrollProgressBar();
    
    // Add scroll indicator
    createScrollIndicator();
    
    // Add temporary content elements
    createTemporaryElements();
    
    // Add highlight lines to sections
    addHighlightLines();
    
    // Add quote containers
    addQuoteContainers();
    
    // Apply animation classes to sections
    applyAnimationClasses();
    
    // Initialize scroll event listener
    initScrollListener();
    
    // Check initial visibility
    checkSectionsVisibility();
    
    // Initialize design switcher
    document.getElementById('switch-design').addEventListener('click', switchDesign);
    
    // Check if mobile
    checkIfMobile();
    
    // Listen for resize events
    window.addEventListener('resize', handleResize);
});

// Create scroll progress bar
function createScrollProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
}

// Create scroll indicator
function createScrollIndicator() {
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    document.body.appendChild(scrollIndicator);
    
    // Hide scroll indicator after 5 seconds
    setTimeout(() => {
        scrollIndicator.classList.add('hidden');
    }, 5000);
}

// Create temporary content elements
function createTemporaryElements() {
    // Top notification
    const topNotification = document.createElement('div');
    topNotification.className = 'temporary-content temp-top';
    topNotification.innerHTML = '<p>Scroll down to discover more about me</p>';
    document.body.appendChild(topNotification);
    
    // Middle notification
    const middleNotification = document.createElement('div');
    middleNotification.className = 'temporary-content temp-middle';
    middleNotification.innerHTML = '<p>You\'re exploring my journey!</p>';
    document.body.appendChild(middleNotification);
    
    // Bottom notification
    const bottomNotification = document.createElement('div');
    bottomNotification.className = 'temporary-content temp-bottom';
    bottomNotification.innerHTML = '<p>Keep scrolling for more content</p>';
    document.body.appendChild(bottomNotification);
    
    // Store references to temporary elements
    temporaryElements = [
        { element: topNotification, showAt: 0, hideAt: 20 },
        { element: middleNotification, showAt: 40, hideAt: 60 },
        { element: bottomNotification, showAt: 80, hideAt: 100 }
    ];
}

// Add highlight lines to sections
function addHighlightLines() {
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

// Apply different animation classes to sections
function applyAnimationClasses() {
    const sections = document.querySelectorAll('.content-section');
    const animationClasses = ['fade-in-left', 'fade-in-right', 'zoom-in', 'rotate-in'];
    
    sections.forEach((section, index) => {
        // Remove default animation class
        section.classList.remove('content-section');
        
        // Add content-section class back (for margin and other styles)
        section.classList.add('content-section');
        
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

// Check if mobile device
function checkIfMobile() {
    isMobile = window.innerWidth <= 768;
    
    // Apply mobile-specific optimizations
    if (isMobile) {
        // Simplify some animations for better performance on mobile
        document.querySelectorAll('.rotate-in').forEach(el => {
            el.classList.remove('rotate-in');
            el.classList.add('fade-in-left');
        });
    }
}

// Handle resize events
function handleResize() {
    checkIfMobile();
    updateScrollMetrics();
}

// Update scroll metrics
function updateScrollMetrics() {
    const activeContainer = document.querySelector('.design.active');
    viewportHeight = activeContainer.clientHeight;
    documentHeight = activeContainer.scrollHeight;
}

// Initialize scroll event listener
function initScrollListener() {
    // Get the active design container
    const activeContainer = document.querySelector('.design.active');
    
    // Update scroll metrics
    updateScrollMetrics();
    
    // Add scroll event listener
    activeContainer.addEventListener('scroll', function(e) {
        lastScrollPosition = activeContainer.scrollTop;
        
        // Calculate scroll progress percentage
        scrollProgress = (lastScrollPosition / (documentHeight - viewportHeight)) * 100;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateScrollProgressBar();
                checkSectionsVisibility();
                checkTemporaryElements();
                checkParallaxEffects();
                checkInfiniteScroll();
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

// Update scroll progress bar
function updateScrollProgressBar() {
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        progressBar.style.width = `${scrollProgress}%`;
    }
    
    // Hide scroll indicator after some scrolling
    if (scrollProgress > 10) {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.classList.add('hidden');
        }
    }
}

// Check temporary elements visibility based on scroll progress
function checkTemporaryElements() {
    temporaryElements.forEach(item => {
        if (scrollProgress >= item.showAt && scrollProgress <= item.hideAt) {
            item.element.classList.add('visible');
        } else {
            item.element.classList.remove('visible');
        }
    });
}

// Check parallax effects
function checkParallaxEffects() {
    const activeContainer = document.querySelector('.design.active');
    const parallaxElements = activeContainer.querySelectorAll('.parallax-bg');
    
    parallaxElements.forEach(element => {
        const elementTop = element.offsetTop;
        const elementHeight = element.offsetHeight;
        const centerPosition = elementTop + elementHeight / 2;
        const distanceFromCenter = centerPosition - (lastScrollPosition + viewportHeight / 2);
        const parallaxValue = distanceFromCenter * 0.1;
        
        element.style.backgroundPositionY = `calc(50% + ${parallaxValue}px)`;
    });
}

// Check if sections are visible and apply animation
function checkSectionsVisibility() {
    const activeContainer = document.querySelector('.design.active');
    const viewportHeight = activeContainer.clientHeight;
    const scrollPosition = activeContainer.scrollTop;
    
    // Get all content sections in the active design
    const sections = activeContainer.querySelectorAll('.content-section, .fade-in-left, .fade-in-right, .zoom-in, .rotate-in');
    
    sections.forEach(function(section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        // Check if section is in viewport
        if (scrollPosition + viewportHeight > sectionTop + 100 && 
            scrollPosition < sectionTop + sectionHeight - 100) {
            section.classList.add('visible');
            
            // Also check for child elements that need their own animations
            const highlightLines = section.querySelectorAll('.highlight-line');
            highlightLines.forEach(line => line.classList.add('visible'));
            
            const quoteContainers = section.querySelectorAll('.quote-container');
            quoteContainers.forEach(quote => quote.classList.add('visible'));
            
            const experienceItems = section.querySelectorAll('.experience-item, .education-item, .project-item');
            experienceItems.forEach(item => item.classList.add('visible'));
            
            const skillItems = section.querySelectorAll('.skill-item');
            skillItems.forEach(item => item.classList.add('visible'));
        } else if (scrollPosition > sectionTop + sectionHeight || 
                  scrollPosition + viewportHeight < sectionTop) {
            // Optional: Remove visible class when section is far out of viewport
            // Uncomment the next line to make elements animate again when scrolling back
            // section.classList.remove('visible');
        }
    });
}

// Check if we need to load more content (infinite scroll)
function checkInfiniteScroll() {
    const activeContainer = document.querySelector('.design.active');
    const contentWrapper = activeContainer.querySelector('[id^="content-wrapper"]');
    const scrollPosition = activeContainer.scrollTop;
    const contentHeight = contentWrapper.offsetHeight;
    const viewportHeight = activeContainer.clientHeight;
    
    // If we're near the bottom and haven't reached max sections
    if (scrollPosition + viewportHeight > contentHeight - 300 && 
        dynamicContentCount < maxDynamicSections) {
        loadMoreContent();
    }
}

// Load more content dynamically
function loadMoreContent() {
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
    
    // Add highlight line with 50% chance
    if (Math.random() > 0.5) {
        const highlightLine = document.createElement('div');
        highlightLine.className = 'highlight-line';
        newSection.insertBefore(highlightLine, newSection.firstChild.nextSibling);
    }
    
    // Add quote with 30% chance
    if (Math.random() > 0.7) {
        const quotes = [
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
            { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" }
        ];
        
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        
        const quoteContainer = document.createElement('div');
        quoteContainer.className = 'quote-container';
        
        const quoteText = document.createElement('div');
        quoteText.className = 'quote-text';
        quoteText.textContent = `"${randomQuote.text}"`;
        
        const quoteAuthor = document.createElement('div');
        quoteAuthor.className = 'quote-author';
        quoteAuthor.textContent = `— ${randomQuote.author}`;
        
        quoteContainer.appendChild(quoteText);
        quoteContainer.appendChild(quoteAuthor);
        
        // Add after the first paragraph
        const firstParagraph = newSection.querySelector('p');
        if (firstParagraph) {
            newSection.insertBefore(quoteContainer, firstParagraph.nextSibling);
        } else {
            newSection.appendChild(quoteContainer);
        }
    }
    
    // Apply a random animation class
    const animationClasses = ['fade-in-left', 'fade-in-right', 'zoom-in', 'rotate-in'];
    const randomAnimationClass = animationClasses[Math.floor(Math.random() * animationClasses.length)];
    newSection.classList.add(randomAnimationClass);
    
    // Add parallax background with 25% chance
    if (Math.random() > 0.75) {
        newSection.classList.add('parallax-bg');
    }
    
    // Add to both designs
    document.getElementById('content-wrapper').appendChild(newSection.cloneNode(true));
    document.getElementById('content-wrapper-alt').appendChild(newSection.cloneNode(true));
    
    // Update scroll metrics after adding new content
    updateScrollMetrics();
    
    // Check visibility of new section
    setTimeout(checkSectionsVisibility, 100);
}

// Switch between designs
function switchDesign() {
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
    
    // Check sections visibility in the new design
    checkSectionsVisibility();
}
