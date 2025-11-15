// Menu mobile et desktop avec gestion des données JSON
let appData = {};

document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const body = document.body;
    
    // Charger les données JSON
    loadAppData();
    
    // Créer le menu overlay
    const menuOverlay = createMenuOverlay();
    body.appendChild(menuOverlay);
    
    // Références aux éléments du menu
    const menuClose = menuOverlay.querySelector('.menu-close');
    const navLinks = menuOverlay.querySelectorAll('.nav-list a');
    
    // Fonction pour ouvrir le menu
    function openMenu() {
        menuOverlay.classList.add('active');
        body.style.overflow = 'hidden';
        if (mobileMenuBtn) mobileMenuBtn.classList.add('active');
    }
    
    // Fonction pour fermer le menu
    function closeMenu() {
        menuOverlay.classList.remove('active');
        body.style.overflow = '';
        if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
    }
    
    // Événements pour ouvrir/fermer le menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', openMenu);
    }
    
    if (menuClose) {
        menuClose.addEventListener('click', closeMenu);
    }
    
    // Fermer le menu en cliquant sur un lien
    navLinks.forEach(function(link) {
        link.addEventListener('click', closeMenu);
    });
    
    // Fermer le menu en cliquant en dehors du contenu
    menuOverlay.addEventListener('click', function(e) {
        if (e.target === menuOverlay) {
            closeMenu();
        }
    });
    
    // Fermer le menu avec la touche Échap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Initialiser les fonctionnalités
    initScrollAnimations();
    initHeaderScroll();
    initContactForm();
    initIconAnimations();
    initParallaxEffect();
    initSmoothScroll();
    initLazyLoading();
});

// Fonction pour charger les données JSON
async function loadAppData() {
    try {
        const response = await fetch('data.json');
        appData = await response.json();
        
        // Initialiser les composants avec les données
        initEvenements();
        initProgrammes();
        initLeadership();
        initDepartements();
        
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        appData = getDefaultData();
        initEvenements();
        initProgrammes();
        initLeadership();
        initDepartements();
    }
}

// Données par défaut en cas d'erreur de chargement
function getDefaultData() {
    return {
        evenements: [],
        programmes: [],
        leadership: [],
        departements: []
    };
}

// Initialiser les événements
function initEvenements() {
    const eventsContainer = document.querySelector('.events-timeline');
    if (!eventsContainer || !appData.evenements) return;
    
    eventsContainer.innerHTML = '';
    
    appData.evenements.forEach(function(event) {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        eventItem.innerHTML = `
            <div class="event-date"><i class="far fa-calendar"></i> ${event.date}</div>
            <h3>${event.titre}</h3>
            <p>${event.description}</p>
        `;
        
        eventItem.addEventListener('click', function() {
            showEventModal(event);
        });
        
        eventsContainer.appendChild(eventItem);
    });
}

// Initialiser les programmes
function initProgrammes() {
    const programsContainer = document.querySelector('.programs-grid');
    if (!programsContainer || !appData.programmes) return;
    
    programsContainer.innerHTML = '';
    
    appData.programmes.forEach(function(program) {
        const programCard = document.createElement('div');
        programCard.className = 'program-card';
        programCard.innerHTML = `
            <div class="program-image">
                <img src="${program.image}" alt="${program.titre}" loading="lazy">
            </div>
            <div class="program-content">
                <h3><i class="fas fa-lightbulb"></i> ${program.titre}</h3>
                <p>${program.description}</p>
            </div>
        `;
        
        programCard.addEventListener('click', function() {
            showProgramModal(program);
        });
        
        programsContainer.appendChild(programCard);
    });
}

// Initialiser le leadership
function initLeadership() {
    const leadershipContainer = document.querySelector('.leadership-grid');
    if (!leadershipContainer || !appData.leadership) return;
    
    leadershipContainer.innerHTML = '';
    
    appData.leadership.forEach(function(leader) {
        const leaderCard = document.createElement('div');
        leaderCard.className = 'leader-card';
        leaderCard.innerHTML = `
            <div class="leader-image">
                <img src="${leader.image}" alt="${leader.nom}" loading="lazy">
            </div>
            <h3>${leader.nom}</h3>
            <div class="leader-role"><i class="fas fa-cross"></i> ${leader.role}</div>
            <p>${leader.description}</p>
        `;
        
        leaderCard.addEventListener('click', function() {
            showLeaderModal(leader);
        });
        
        leadershipContainer.appendChild(leaderCard);
    });
}

// Initialiser les départements avec effet slide
function initDepartements() {
    const departmentsContainer = document.querySelector('.departments-grid');
    if (!departmentsContainer || !appData.departements) return;
    
    departmentsContainer.innerHTML = '';
    
    appData.departements.forEach(function(dept) {
        const deptCard = document.createElement('div');
        deptCard.className = 'department-card';
        deptCard.setAttribute('data-department', dept.nom.toLowerCase());
        deptCard.innerHTML = `
            <div class="department-icon">
                <i class="${dept.icon}"></i>
            </div>
            <h3>${dept.nom}</h3>
            <p>${dept.description}</p>
            <div class="department-slide-content" style="display: none;">
                <div class="slide-details">
                    <p><strong>Détails:</strong> ${dept.details || 'Informations détaillées sur ce département'}</p>
                    ${dept.images ? `
                    <div class="slide-gallery">
                        ${dept.images.map(img => `<img src="${img}" alt="${dept.nom}" loading="lazy">`).join('')}
                    </div>
                    ` : ''}
                    <button class="btn btn-inscription-slide">
                        <i class="fas fa-user-plus"></i> S'inscrire à ce département
                    </button>
                </div>
            </div>
        `;
        
        // Ajouter l'événement pour le slide
        deptCard.addEventListener('click', function(e) {
            // Ne pas déclencher le slide si on clique sur le bouton d'inscription
            if (!e.target.closest('.btn-inscription-slide')) {
                toggleDepartmentSlide(this, dept);
            }
        });
        
        // Gérer le bouton d'inscription dans le slide
        const inscriptionBtn = deptCard.querySelector('.btn-inscription-slide');
        if (inscriptionBtn) {
            inscriptionBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const message = "Bonjour, je souhaite m'inscrire au département " + dept.nom;
                const whatsappUrl = "https://wa.me/243991629320?text=" + encodeURIComponent(message);
                window.open(whatsappUrl, '_blank');
            });
        }
        
        departmentsContainer.appendChild(deptCard);
    });
}

// Fonction pour gérer le slide des départements
function toggleDepartmentSlide(card, department) {
    const slideContent = card.querySelector('.department-slide-content');
    const allSlides = document.querySelectorAll('.department-slide-content');
    const allCards = document.querySelectorAll('.department-card');
    
    // Fermer tous les autres slides
    allSlides.forEach(slide => {
        if (slide !== slideContent && slide.style.display !== 'none') {
            slide.style.display = 'none';
            slide.parentElement.classList.remove('active');
        }
    });
    
    // Toggle le slide actuel
    if (slideContent.style.display === 'none' || !slideContent.style.display) {
        slideContent.style.display = 'block';
        card.classList.add('active');
        
        // Animation d'apparition
        setTimeout(() => {
            slideContent.style.opacity = '1';
            slideContent.style.transform = 'translateY(0)';
        }, 10);
    } else {
        slideContent.style.opacity = '0';
        slideContent.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            slideContent.style.display = 'none';
            card.classList.remove('active');
        }, 300);
    }
}

// Fonction pour créer le menu overlay
function createMenuOverlay() {
    const menuOverlay = document.createElement('div');
    menuOverlay.className = 'menu-overlay';
    
    menuOverlay.innerHTML = `
        <div class="menu-container">
            <div class="menu-header">
                <div class="menu-logo">
                    <span>House of Light</span>
                </div>
                <div class="menu-close"><i class="fas fa-times"></i></div>
            </div>
            <div class="menu-content">
                <ul class="nav-list">
                    <li><a href="#accueil"><i class="fas fa-home nav-icon"></i>Accueil</a></li>
                    <li><a href="#apropos"><i class="fas fa-info-circle nav-icon"></i>À propos</a></li>
                    <li><a href="#berger"><i class="fas fa-user nav-icon"></i>Berger</a></li>
                    <li><a href="#vision-mission"><i class="fas fa-bullseye nav-icon"></i>Vision & Mission</a></li>
                    <li><a href="#valeurs-croyances"><i class="fas fa-heart nav-icon"></i>Valeurs & Croyances</a></li>
                    <li><a href="#colonnes"><i class="fas fa-columns nav-icon"></i>Colonnes</a></li>
                    <li><a href="#evenements"><i class="fas fa-calendar-alt nav-icon"></i>Événements</a></li>
                    <li><a href="#programmes"><i class="fas fa-book nav-icon"></i>Programmes</a></li>
                    <li><a href="#leadership"><i class="fas fa-users nav-icon"></i>Leadership</a></li>
                    <li><a href="#departements"><i class="fas fa-building nav-icon"></i>Départements</a></li>
                    <li><a href="#cantine"><i class="fas fa-utensils nav-icon"></i>Cantine</a></li>
                    <li><a href="#partenariat"><i class="fas fa-handshake nav-icon"></i>Partenariat</a></li>
                    <li><a href="#contact"><i class="fas fa-phone nav-icon"></i>Contact</a></li>
                </ul>
                
                <div class="menu-footer">
                    <div class="social-links-menu">
                        <a href="https://www.youtube.com/@MaisonDelumiere-kp5hp" target="_blank" class="social-link-menu">
                            <i class="fab fa-youtube"></i>
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=100085909086499" target="_blank" class="social-link-menu">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" class="social-link-menu">
                            <i class="fab fa-linkedin-in"></i>
                        </a>
                        <a href="https://www.instagram.com/maisondelumiere" target="_blank" class="social-link-menu">
                            <i class="fab fa-instagram"></i>
                        </a>
                    </div>
                    <div class="contact-info-menu">
                        <p><i class="fas fa-phone"></i> +243 999 173 245</p>
                        <p><i class="fas fa-envelope"></i> maisondelumieregoma@gmail.com</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return menuOverlay;
}

// Fonction pour afficher le modal des événements
function showEventModal(event) {
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    
    const imagesHTML = event.images ? event.images.map(function(img) {
        return `<img src="${img}" alt="${event.titre}" loading="lazy">`;
    }).join('') : '';
    
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-container">
            <div class="modal-header">
                <h2>${event.titre}</h2>
                <span class="close-modal"><i class="fas fa-times"></i></span>
            </div>
            <div class="modal-body">
                <div class="event-date-modal"><i class="far fa-calendar"></i> ${event.date}</div>
                <p>${event.description}</p>
                ${event.images ? `
                <div class="event-gallery">
                    ${imagesHTML}
                </div>
                ` : ''}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(function() {
        modal.classList.add('active');
    }, 10);
    
    // Fermer le modal
    const closeBtn = modal.querySelector('.close-modal');
    const backdrop = modal.querySelector('.modal-backdrop');
    
    function closeModal() {
        modal.classList.remove('active');
        setTimeout(function() {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        }, 300);
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
}

// Fonction pour afficher le modal des programmes
function showProgramModal(program) {
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-container program-modal">
            <div class="modal-header">
                <h2>${program.titre}</h2>
                <span class="close-modal"><i class="fas fa-times"></i></span>
            </div>
            <div class="modal-body">
                <div class="program-image-full">
                    <img src="${program.image}" alt="${program.titre}" loading="lazy">
                </div>
                <p>${program.description}</p>
                <div class="program-details">
                    <h3><i class="fas fa-info-circle"></i> Détails du Programme</h3>
                    <ul>
                        <li><i class="fas fa-clock"></i> <strong>Durée:</strong> ${program.details ? program.details.duree : 'Variable selon le programme'}</li>
                        <li><i class="fas fa-sync-alt"></i> <strong>Fréquence:</strong> ${program.details ? program.details.frequence : 'Selon le calendrier établi'}</li>
                        <li><i class="fas fa-user-friends"></i> <strong>Public cible:</strong> ${program.details ? program.details.public : 'Tous les membres de l\'église'}</li>
                        <li><i class="fas fa-bullseye"></i> <strong>Objectif:</strong> ${program.details ? program.details.objectif : 'Édification et formation spirituelle'}</li>
                    </ul>
                </div>
                <div class="modal-actions">
                    ${program.album_link ? `
                    <button class="btn btn-album">
                        <i class="fas fa-images"></i> Voir l'Album
                    </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(function() {
        modal.classList.add('active');
    }, 10);
    
    const closeBtn = modal.querySelector('.close-modal');
    const backdrop = modal.querySelector('.modal-backdrop');
    const albumBtn = modal.querySelector('.btn-album');
    
    function closeModal() {
        modal.classList.remove('active');
        setTimeout(function() {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        }, 300);
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
    
    // Gestion du bouton album
    if (albumBtn && program.album_link) {
        albumBtn.addEventListener('click', function() {
            window.open(program.album_link, '_blank');
        });
    }
}

// Fonction pour afficher le modal du leadership
function showLeaderModal(leader) {
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-container leader-modal">
            <div class="modal-header">
                <h2>${leader.nom}</h2>
                <span class="close-modal"><i class="fas fa-times"></i></span>
            </div>
            <div class="modal-body">
                <div class="leader-profile">
                    <div class="leader-image-modal">
                        <img src="${leader.image}" alt="${leader.nom}" loading="lazy">
                    </div>
                    <div class="leader-info">
                        <div class="leader-role-modal"><i class="fas fa-cross"></i> ${leader.role}</div>
                        <p>${leader.description}</p>
                    </div>
                </div>
                <div class="leader-bio">
                    <h3><i class="fas fa-book-open"></i> Biographie</h3>
                    <p>${leader.biographie || 'Servant dévoué avec une passion pour l\'œuvre de Dieu.'}</p>
                    <div class="leader-contact">
                        <h4><i class="fas fa-address-book"></i> Contact</h4>
                        <p><i class="fas fa-envelope"></i> Email: ${leader.contact ? leader.contact.email : 'maisondelumieregoma@gmail.com'}</p>
                        <p><i class="fas fa-phone"></i> Téléphone: ${leader.contact ? leader.contact.telephone : '+243 XXX XXX XXX'}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(function() {
        modal.classList.add('active');
    }, 10);
    
    const closeBtn = modal.querySelector('.close-modal');
    const backdrop = modal.querySelector('.modal-backdrop');
    
    function closeModal() {
        modal.classList.remove('active');
        setTimeout(function() {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        }, 300);
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
}

// Fonction pour afficher le modal des départements
function showDepartmentModal(department) {
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    
    const imagesHTML = department.images ? department.images.map(function(img) {
        return `<img src="${img}" alt="${department.nom}" loading="lazy">`;
    }).join('') : '';
    
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-container department-modal">
            <div class="modal-header">
                <h2>${department.nom}</h2>
                <span class="close-modal"><i class="fas fa-times"></i></span>
            </div>
            <div class="modal-body">
                <div class="department-info">
                    <div class="department-icon-modal">
                        <i class="${department.icon}"></i>
                    </div>
                    <div class="department-description">
                        <p>${department.description}</p>
                        ${department.details ? `<p><i class="fas fa-info-circle"></i> <strong>Détails:</strong> ${department.details}</p>` : ''}
                    </div>
                </div>
                ${department.images ? `
                <div class="department-gallery">
                    ${imagesHTML}
                </div>
                ` : '<p style="text-align: center; color: #666; margin: 30px 0;"><i class="fas fa-images"></i> Aucune image disponible pour le moment</p>'}
                <div class="modal-actions">
                    <button class="btn btn-primary btn-inscription">
                        <i class="fas fa-user-plus"></i> S'inscrire à ce département
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(function() {
        modal.classList.add('active');
    }, 10);
    
    const closeBtn = modal.querySelector('.close-modal');
    const backdrop = modal.querySelector('.modal-backdrop');
    const inscriptionBtn = modal.querySelector('.btn-inscription');
    
    function closeModal() {
        modal.classList.remove('active');
        setTimeout(function() {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        }, 300);
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
    
    // Gestion du bouton d'inscription
    if (inscriptionBtn) {
        inscriptionBtn.addEventListener('click', function() {
            const message = "Bonjour, je souhaite m'inscrire au département " + department.nom;
            const whatsappUrl = "https://wa.me/243991629320?text=" + encodeURIComponent(message);
            window.open(whatsappUrl, '_blank');
        });
    }
}

// Fonctions d'initialisation supplémentaires
function initScrollAnimations() {
    const elements = document.querySelectorAll('.about-content, .pastor-content, .vision, .mission, .values, .beliefs, .pillar-card, .event-item, .program-card, .leader-card, .department-card');
    
    elements.forEach(function(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    function animateOnScroll() {
        elements.forEach(function(element) {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
}

function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(44, 62, 80, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'var(--primary-color)';
            header.style.backdropFilter = 'none';
        }
        
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = window.scrollY;
    });
}

function initContactForm() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');
            
            if (!name || !email || !subject || !message) return;
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.disabled = true;
            
            const mailtoLink = 'mailto:maisondelumieregoma@gmail.com?subject=' + encodeURIComponent(subject.value) + '&body=' + encodeURIComponent('Nom: ' + name.value + '\nEmail: ' + email.value + '\n\nMessage:\n' + message.value);
            
            window.location.href = mailtoLink;
            
            setTimeout(function() {
                alert('Merci pour votre message! Votre client email a été ouvert. Nous vous répondrons dans les plus brefs délais.');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1000);
        });
    }
}

function initIconAnimations() {
    const departmentCards = document.querySelectorAll('.department-card');
    departmentCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.department-icon');
            if (icon) icon.style.transform = 'rotateY(180deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.department-icon');
            if (icon) icon.style.transform = 'rotateY(0)';
        });
    });
    
    const pillarCards = document.querySelectorAll('.pillar-card');
    pillarCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.pillar-icon');
            if (icon) icon.style.transform = 'rotateY(180deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.pillar-icon');
            if (icon) icon.style.transform = 'rotateY(0)';
        });
    });
}

function initParallaxEffect() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero) {
            hero.style.transform = 'translateY(' + (scrolled * 0.5) + 'px)';
        }
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(function(img) {
            imageObserver.observe(img);
        });
    }
}

// Ajouter les styles CSS
const menuAndModalStyles = `
/* Styles pour le menu overlay */
.menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(15px);
    z-index: 9999;
    opacity: 0;
    visibility: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-overlay.active {
    opacity: 1;
    visibility: visible;
}

.menu-container {
    position: absolute;
    top: 0;
    right: -100%;
    width: 380px;
    height: 100%;
    background: linear-gradient(135deg, var(--primary-color), #1a252f);
    box-shadow: -5px 0 30px rgba(0, 0, 0, 0.5);
    transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}

.menu-overlay.active .menu-container {
    right: 0;
}

.menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: rgba(0, 0, 0, 0.3);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.menu-logo {
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
}

.menu-close {
    color: white;
    font-size: 1.8rem;
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.menu-close:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: rotate(90deg);
}

.menu-content {
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

.nav-list li {
    margin-bottom: 5px;
}

.nav-list a {
    display: flex;
    align-items: center;
    color: white;
    text-decoration: none;
    padding: 15px 20px;
    border-radius: 10px;
    transition: all 0.3s ease;
    font-size: 1.1rem;
}

.nav-list a:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(10px);
}

.nav-icon {
    margin-right: 15px;
    width: 20px;
    text-align: center;
    font-size: 1.2rem;
}

.menu-footer {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.social-links-menu {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-bottom: 20px;
}

.social-link-menu {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    color: white;
    text-decoration: none;
    transition: all 0.3s ease;
}

.social-link-menu:hover {
    background: var(--accent-color);
    transform: translateY(-3px);
}

.contact-info-menu p {
    color: white;
    margin: 8px 0;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;
}

.contact-info-menu i {
    width: 16px;
    text-align: center;
}

/* Styles pour les modals */
.custom-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.custom-modal.active {
    opacity: 1;
    visibility: visible;
}

.modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
}

.modal-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.8);
    background: white;
    border-radius: 15px;
    max-width: 90%;
    max-height: 90%;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
}

.custom-modal.active .modal-container {
    transform: translate(-50%, -50%) scale(1);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px 30px 0;
    margin-bottom: 20px;
}

.modal-header h2 {
    margin: 0;
    color: var(--primary-color);
    font-size: 1.8rem;
}

.close-modal {
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.close-modal:hover {
    background: #f0f0f0;
    color: #333;
}

.modal-body {
    padding: 0 30px 30px;
}

.event-date-modal, .leader-role-modal {
    background: var(--accent-color);
    color: white;
    padding: 8px 15px;
    border-radius: 20px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
    font-weight: 500;
}

.modal-actions {
    display: flex;
    gap: 15px;
    margin-top: 25px;
    flex-wrap: wrap;
}

.btn {
    padding: 12px 25px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.btn-primary {
    background: var(--accent-color);
    color: white;
}

.btn-primary:hover {
    background: #e74c3c;
    transform: translateY(-2px);
}

.btn-album {
    background: var(--secondary-color);
    color: white;
}

.btn-album:hover {
    background: #2980b9;
    transform: translateY(-2px);
}

.btn-secondary {
    background: #ecf0f1;
    color: #2c3e50;
}

.btn-secondary:hover {
    background: #bdc3c7;
    transform: translateY(-2px);
}

/* Styles pour les slides des départements */
.department-slide-content {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease;
}

.department-card.active {
    background: linear-gradient(135deg, #ffffff, #e8f4f8);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.slide-details {
    font-size: 0.95rem;
    line-height: 1.6;
}

.slide-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 10px;
    margin: 15px 0;
}

.slide-gallery img {
    width: 100%;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    transition: transform 0.3s ease;
}

.slide-gallery img:hover {
    transform: scale(1.05);
}

.btn-inscription-slide {
    background: var(--secondary-color);
    color: white;
    padding: 8px 16px;
    font-size: 0.9rem;
    margin-top: 15px;
}

.btn-inscription-slide:hover {
    background: #2980b9;
    transform: translateY(-2px);
}

/* Styles spécifiques pour les différents types de modals */
.leader-profile {
    display: flex;
    gap: 25px;
    margin-bottom: 25px;
    align-items: flex-start;
}

.leader-image-modal {
    flex-shrink: 0;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    border: 5px solid var(--accent-color);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.leader-image-modal img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.leader-info {
    flex: 1;
}

.department-info {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 25px;
}

.department-icon-modal {
    font-size: 3rem;
    color: var(--accent-color);
    flex-shrink: 0;
}

.program-image-full {
    width: 100%;
    height: max-content;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 25px;
}

.program-image-full img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.program-details ul {
    list-style: none;
    padding: 0;
}

.program-details li {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.program-details i {
    width: 16px;
    color: var(--accent-color);
}

.event-gallery, .department-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin: 30px 0;
}

.event-gallery img, .department-gallery img {
    width: 100%;
    height: max-content;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease;
}

.event-gallery img:hover, .department-gallery img:hover {
    transform: scale(1.03);
}

/* Responsive */
@media (max-width: 768px) {
    .menu-container {
        width: 100%;
    }
    
    .modal-container {
        max-width: 95%;
        max-height: 95%;
        width: max-content;
    }
    
    .modal-actions {
        flex-direction: column;
    }
    
    .leader-profile {
        flex-direction: column;
        text-align: center;
    }
    
    .leader-image-modal {
        align-self: center;
    }
    
    .department-info {
        flex-direction: column;
        text-align: center;
    }
    
    .event-gallery, .department-gallery {
        grid-template-columns: 1fr;
    }
    
    .event-gallery img, .department-gallery img {
        height: max-content; 
    }
    
    .program-image-full {
        height: max-content;
    }
    
    .slide-gallery {
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    }
    
    .slide-gallery img {
        height: 70px;
    }
}
`;

// Ajouter les styles au document
const styleSheet = document.createElement('style');
styleSheet.textContent = menuAndModalStyles;
document.head.appendChild(styleSheet);