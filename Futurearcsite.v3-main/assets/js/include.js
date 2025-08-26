let scriptsHaveBeenInitialized = false;

/**
 * Denna funktion körs EN GÅNG, efter att all HTML från komponenterna har laddats in.
 * Den aktiverar all interaktivitet på sidan.
 */
function initializePageScripts() {
    // Om skripten redan har körts, avbryt för att undvika dubbletter.
    if (scriptsHaveBeenInitialized) {
        return;
    }

    // --- LOGIK FÖR MOBILMENY (HAMBURGER) ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
    }

    // --- LOGIK FÖR "NYHETER LANSERAS SNART" POPUP ---
    const newsPopup = document.getElementById('news-popup');
    if (newsPopup) {
        let isPopupVisible = false;
        let popupTimer;
        const hidePopup = () => {
            if (!isPopupVisible) return;
            clearTimeout(popupTimer);
            newsPopup.classList.remove('active');
            setTimeout(() => { isPopupVisible = false; }, 300);
        };
        const showPopup = (event) => {
            event.preventDefault();
            if (isPopupVisible) return;
            isPopupVisible = true;
            newsPopup.classList.add('active');
            popupTimer = setTimeout(hidePopup, 1500);
        };
        document.getElementById('news-popup-trigger')?.addEventListener('click', showPopup);
        document.getElementById('news-popup-trigger-mobile')?.addEventListener('click', showPopup);
        newsPopup.addEventListener('click', (event) => {
            if (event.target === newsPopup) hidePopup();
        });
    }

    // --- KORRIGERAD LOGIK FÖR FAQ-SEKTIONEN ---
    const faqGrid = document.querySelector('.faq-grid');
    if (faqGrid) {
        faqGrid.addEventListener('click', (event) => {
            const questionHeader = event.target.closest('.faq-question');
            if (!questionHeader) return;
            const currentItem = questionHeader.parentElement;
            const isActive = currentItem.classList.contains('active');
            faqGrid.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            if (!isActive) {
                currentItem.classList.add('active');
            }
        });
    }

    // --- KORRIGERAD LOGIK FÖR TECH STACK SKRIVMASKINSANIMATION ---
    const techNameDisplay = document.getElementById('tech-name-display');
    const techItems = document.querySelectorAll('.tech-item');
    let typingInterval = null;
    let currentlyDisplayedTech = '';

    if (techNameDisplay && techItems.length > 0) {
        const typeText = (element, text) => {
            let i = 0;
            element.textContent = '';
            if (typingInterval) {
                clearInterval(typingInterval);
            }
            typingInterval = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typingInterval);
                }
            }, 75);
        };

        techItems.forEach(item => {
            item.addEventListener('mouseover', () => {
                const techName = item.dataset.techName;
                if (techName && techName !== currentlyDisplayedTech) {
                    currentlyDisplayedTech = techName;
                    typeText(techNameDisplay, techName);
                }
            });
        });

        const marqueeContainer = document.querySelector('.marquee-container');
        if (marqueeContainer) {
            marqueeContainer.addEventListener('mouseleave', () => {
                if (typingInterval) {
                    clearInterval(typingInterval);
                }
                techNameDisplay.textContent = '';
                currentlyDisplayedTech = '';
            });
        }
    }

    // --- UPPDATERAD LOGIK FÖR ATT HANTERA SKROLLPOSITION VID LADDNING ---
    const hash = window.location.hash;
    if (hash) {
        // Om det finns en hash i URL:en, skrolla till den sektionen.
        setTimeout(() => {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    } else {
        // Om det INTE finns en hash, se till att sidan är högst upp.
        // Detta förhindrar att webbläsaren "minns" och återställer en gammal skrollposition.
        window.scrollTo(0, 0);
    }

    // Sätt flaggan till true så att denna funktion aldrig körs igen.
    scriptsHaveBeenInitialized = true;
}

/**
 * Kärnfunktionen som laddar dina HTML-komponenter.
 */
function includeHTML() {
    const elements = Array.from(document.querySelectorAll("[include-html]"));
    if (elements.length === 0) {
        initializePageScripts();
        return;
    }
    const element = elements[0];
    const file = element.getAttribute("include-html");
    if (file) {
        fetch(file)
            .then(response => response.ok ? response.text() : Promise.reject('Kunde inte ladda fil.'))
            .then(data => {
                element.innerHTML = data;
                element.removeAttribute("include-html");
                includeHTML();
            })
            .catch(error => {
                element.innerHTML = "Kunde inte ladda komponenten.";
                console.error("Fel vid laddning av fil:", file, error);
                element.removeAttribute("include-html");
                includeHTML();
            });
    }
}

document.addEventListener('DOMContentLoaded', includeHTML);