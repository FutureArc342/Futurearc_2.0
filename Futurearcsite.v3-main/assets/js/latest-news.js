// Latest News Management System
class LatestNewsManager {
    constructor() {
        this.newsData = [];
        this.lastUpdate = null;
        this.updateInterval = 30000; // Update every 30 seconds
        this.init();
    }

    async init() {
        await this.loadNews();
        this.startAutoUpdate();
        this.setupEventListeners();
    }

    async loadNews() {
        try {
            const response = await fetch('nyheter.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const news = await response.json();
            this.newsData = news;
            this.lastUpdate = new Date();
            
            this.displayLatestNews();
        } catch (error) {
            console.error('Error loading news:', error);
            this.showErrorMessage();
        }
    }

    displayLatestNews() {
        const newsLayout = document.getElementById('latest-news-layout');
        if (!newsLayout) return;

        // Get the latest news articles
        const latestNews = this.newsData.slice(0, 6); // Get 6 articles for the layout
        
        // Clear existing content
        newsLayout.innerHTML = '';
        
        if (latestNews.length === 0) {
            newsLayout.innerHTML = `
                <div class="news-loading">
                    <p style="color: #cccccc;">Inga nyheter tillgängliga just nu.</p>
                </div>
            `;
            return;
        }
        
        // Create the layout structure
        const layoutHTML = this.createTechCrunchLayout(latestNews);
        newsLayout.innerHTML = layoutHTML;
        
        // Add entrance animations
        this.addEntranceAnimations();
    }

    createTechCrunchLayout(articles) {
        const featuredArticle = articles[0];
        const smallCardsArticles = articles.slice(1, 3); // Next 2 articles for small cards
        const sidebarArticles = articles.slice(3, 6); // Next 3 articles for sidebar
        
        return `
            <div class="news-main-content">
                <div class="featured-article">
                    ${this.createFeaturedArticle(featuredArticle)}
                </div>
                <div class="small-cards-container">
                    ${smallCardsArticles.map(article => `
                        <div class="small-article-card">
                            ${this.createSmallCardArticle(article)}
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="news-sidebar">
                ${sidebarArticles.map(article => `
                    <div class="sidebar-article">
                        ${this.createSidebarArticle(article)}
                    </div>
                `).join('')}
            </div>
        `;
    }

    createFeaturedArticle(article) {
        if (!article) return '<p style="color: #cccccc;">Ingen artikel tillgänglig</p>';
        
        const date = new Date(article.timestamp);
        const formattedDate = date.toLocaleDateString('sv-SE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        return `
            <div class="featured-image-container">
                <img src="${article.image}" alt="${article.title}" class="featured-image" loading="lazy">
                <div class="featured-image-overlay"></div>
            </div>
            <div class="featured-content">
                <span class="featured-category">
                    <i class="fas fa-tag"></i>
                    ${this.capitalizeFirst(article.category)}
                </span>
                <h3 class="featured-title">${article.title}</h3>
                <p class="featured-excerpt">${article.excerpt}</p>
                <div class="featured-meta">
                    <span class="featured-date">
                        <i class="fas fa-calendar-alt"></i>
                        ${formattedDate}
                    </span>
                    <a href="news.html" class="featured-read-more">
                        Läs mer
                        <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
    }

    createSmallCardArticle(article) {
        if (!article) return '';
        
        const date = new Date(article.timestamp);
        const formattedDate = date.toLocaleDateString('sv-SE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        return `
            <div class="small-card-image-container">
                <img src="${article.image}" alt="${article.title}" class="small-card-image" loading="lazy">
            </div>
            <div class="small-card-content">
                <span class="small-card-category">
                    <i class="fas fa-tag"></i>
                    ${this.capitalizeFirst(article.category)}
                </span>
                <h4 class="small-card-title">${article.title}</h4>
                <div class="small-card-meta">
                    <span class="small-card-date">
                        <i class="fas fa-calendar-alt"></i>
                        ${formattedDate}
                    </span>
                    <a href="news.html" class="small-card-read-more">
                        Läs mer
                    </a>
                </div>
            </div>
        `;
    }

    createSidebarArticle(article) {
        if (!article) return '';
        
        const date = new Date(article.timestamp);
        const formattedDate = date.toLocaleDateString('sv-SE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        return `
            <div class="sidebar-image-container">
                <img src="${article.image}" alt="${article.title}" class="sidebar-image" loading="lazy">
            </div>
            <div class="sidebar-content">
                <span class="sidebar-category">
                    <i class="fas fa-tag"></i>
                    ${this.capitalizeFirst(article.category)}
                </span>
                <h4 class="sidebar-title">${article.title}</h4>
                <div class="sidebar-meta">
                    <span class="sidebar-date">
                        <i class="fas fa-calendar-alt"></i>
                        ${formattedDate}
                    </span>
                    <a href="news.html" class="sidebar-read-more">
                        Läs mer
                    </a>
                </div>
            </div>
        `;
    }

    addEntranceAnimations() {
        // Animate featured article
        const featuredArticle = document.querySelector('.featured-article');
        if (featuredArticle) {
            featuredArticle.style.opacity = '0';
            featuredArticle.style.transform = 'translateY(30px) scale(0.95)';
            featuredArticle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            
            setTimeout(() => {
                featuredArticle.style.opacity = '1';
                featuredArticle.style.transform = 'translateY(0) scale(1)';
            }, 200);
        }
        
        // Animate small cards
        const smallCards = document.querySelectorAll('.small-article-card');
        smallCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.95)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, 600 + (index * 200));
        });
        
        // Animate sidebar elements
        const sidebarElements = document.querySelectorAll('.sidebar-article');
        sidebarElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateX(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
            }, 1000 + (index * 150));
        });
    }



    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    showErrorMessage() {
        const newsGrid = document.getElementById('latest-news-grid');
        if (!newsGrid) return;

        newsGrid.innerHTML = `
            <div class="news-loading">
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle" style="color: #FF6B00; font-size: 2rem; margin-bottom: 15px;"></i>
                    <p style="color: #cccccc; margin: 0;">Kunde inte ladda nyheter just nu. Försök igen senare.</p>
                    <button onclick="latestNewsManager.loadNews()" style="
                        background: linear-gradient(135deg, #FF6B00, #FF8C42);
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 25px;
                        margin-top: 15px;
                        cursor: pointer;
                        font-weight: 600;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        Försök igen
                    </button>
                </div>
            </div>
        `;
    }

    startAutoUpdate() {
        setInterval(() => {
            this.checkForUpdates();
        }, this.updateInterval);
    }

    async checkForUpdates() {
        try {
            const response = await fetch('nyheter.json');
            const news = await response.json();
            
            // Check if there are new articles
            if (news.length > this.newsData.length || 
                (news.length > 0 && this.newsData.length > 0 && 
                 news[0].timestamp !== this.newsData[0].timestamp)) {
                
                console.log('New articles detected, updating...');
                this.newsData = news;
                this.lastUpdate = new Date();
                this.displayLatestNews();
                
                // Show update notification
                this.showUpdateNotification();
            }
        } catch (error) {
            console.error('Error checking for updates:', error);
        }
    }

    showUpdateNotification() {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'news-update-notification';
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-newspaper"></i>
            </div>
            <div class="notification-content">
                <span class="notification-title">Nya nyheter!</span>
                <span class="notification-text">Färska artiklar har lagts till</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 30px;
            right: 30px;
            background: linear-gradient(135deg, rgba(42, 42, 42, 0.95), rgba(30, 30, 30, 0.95));
            backdrop-filter: blur(20px);
            color: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(255, 107, 0, 0.3);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 15px;
            font-weight: 600;
            animation: slideInRight 0.6s ease;
            max-width: 350px;
            border: 1px solid rgba(255, 107, 0, 0.2);
        `;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .notification-icon {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #FF6B00, #FF8C42);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                box-shadow: 0 8px 25px rgba(255, 107, 0, 0.3);
            }
            
            .notification-content {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }
            
            .notification-title {
                font-weight: 700;
                font-size: 1rem;
            }
            
            .notification-text {
                font-weight: 400;
                font-size: 0.85rem;
                color: #cccccc;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: #888888;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.3s ease;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .notification-close:hover {
                background: rgba(255, 255, 255, 0.1);
                color: #ffffff;
            }
        `;
        document.head.appendChild(style);
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    setupEventListeners() {
        // Listen for visibility change to pause/resume updates
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page is hidden, could pause updates here if needed
            } else {
                // Page is visible, check for updates
                this.checkForUpdates();
            }
        });
    }

    // Public method to manually refresh
    refresh() {
        this.loadNews();
    }
}

// Initialize the news manager when the page loads
let latestNewsManager;

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a page with the latest news section
    const latestNewsSection = document.querySelector('.latest-news-section');
    if (latestNewsSection) {
        latestNewsManager = new LatestNewsManager();
    }
});

// Also initialize when includeHTML is called
if (typeof includeHTML === 'function') {
    const originalIncludeHTML = includeHTML;
    includeHTML = function() {
        originalIncludeHTML();
        setTimeout(() => {
            const latestNewsSection = document.querySelector('.latest-news-section');
            if (latestNewsSection && !latestNewsManager) {
                latestNewsManager = new LatestNewsManager();
            }
        }, 100);
    };
}

// Export for global access
window.latestNewsManager = latestNewsManager;
