// Global variables
let lastScrollPosition = 0;
let ticking = false;
let contentSections = [];
let activeDesign = 'design1';
let dynamicContentCount = 0;
const maxDynamicSections = 10; // Maximum number of additional sections to load

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get all initial content sections
    contentSections = document.querySelectorAll('.content-section');
    
    // Clone content from design1 to design2
    const design1Content = document.getElementById('content-wrapper');
    const design2Content = document.getElementById('content-wrapper-alt');
    design2Content.innerHTML = design1Content.innerHTML;
    
    // Initialize scroll event listener
    initScrollListener();
    
    // Check initial visibility
    checkSectionsVisibility();
    
    // Initialize design switcher
    document.getElementById('switch-design').addEventListener('click', switchDesign);
});

// Initialize scroll event listener
function initScrollListener() {
    // Get the active design container
    const activeContainer = document.querySelector('.design.active');
    
    // Add scroll event listener
    activeContainer.addEventListener('scroll', function(e) {
        lastScrollPosition = activeContainer.scrollTop;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                checkSectionsVisibility();
                checkInfiniteScroll();
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

// Check if sections are visible and apply animation
function checkSectionsVisibility() {
    const activeContainer = document.querySelector('.design.active');
    const viewportHeight = activeContainer.clientHeight;
    const scrollPosition = activeContainer.scrollTop;
    
    // Get all content sections in the active design
    const sections = activeContainer.querySelectorAll('.content-section');
    
    sections.forEach(function(section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        // Check if section is in viewport
        if (scrollPosition + viewportHeight > sectionTop && 
            scrollPosition < sectionTop + sectionHeight) {
            section.classList.add('visible');
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
    
    // Add to both designs
    document.getElementById('content-wrapper').appendChild(newSection.cloneNode(true));
    document.getElementById('content-wrapper-alt').appendChild(newSection.cloneNode(true));
    
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
