// Global Owl Animation for Scroll to Top
function scrollToTop() {
    // Skapa den flygande ugglan
    createFlyingOwl();
    
    // Scrolla upp efter en kort fördröjning för att synkronisera med animationen
    setTimeout(() => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }, 200);
}

function createFlyingOwl() {
    // Skapa uggla-elementet
    const owl = document.createElement('div');
    owl.className = 'flying-owl';
    document.body.appendChild(owl);

    // Ta bort ugglan efter animationen är klar
    setTimeout(() => {
        if (owl.parentNode) {
            owl.parentNode.removeChild(owl);
        }
    }, 1500);
}



// JavaScript för att hantera visning och dölja scroll-to-top knappen
function handleScrollToTopVisibility() {
    var scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
    var windowHeight = window.innerHeight;
    var fullHeight = document.body.scrollHeight;
    
    var button = document.querySelector('.scroll-to-top');
    
    if (button) {
        // Visa knappen tidigare när användaren scrollar ner
        if (scrollPosition > 300) { // Dyker upp efter 300px scroll
            button.style.bottom = '20px';
        } else {
            button.style.bottom = '-60px';
        }
    }
}

// Lägg till event listener när DOM är redo
document.addEventListener('DOMContentLoaded', function() {
    // Lägg till scroll event listener
    window.addEventListener('scroll', handleScrollToTopVisibility);
    
    // Kontrollera initial visibility
    handleScrollToTopVisibility();
});
