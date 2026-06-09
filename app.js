/* ==========================================================================
   ANIDENT Dynamic Application Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Navigation Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // 2. Header Scroll Effect
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Active nav-link update based on scroll position
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // offset header height

        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // 3. Service Card Category Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to current button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            serviceCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Animate transition
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 200);
            });
        });
    });

    // 4. Booking/Appointment Form handler with WhatsApp integration
    const appointmentForm = document.getElementById('appointmentForm');
    
    if (appointmentForm) {
        // Set minimum date to today
        const dateInput = document.getElementById('formDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }

        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Extract input values
            const name = document.getElementById('formName').value;
            const phone = document.getElementById('formPhone').value;
            const service = document.getElementById('formService').value;
            const date = document.getElementById('formDate').value || 'Por coordinar';
            const notes = document.getElementById('formNotes').value || 'Ninguna adicional';

            // WhatsApp base phone (uses first number)
            const waNumber = '593984899598'; 

            // Construct text message
            const message = `Hola ANIDENT, deseo agendar una cita.
*Datos de la Cita:*
- *Paciente:* ${name}
- *Teléfono:* ${phone}
- *Servicio:* ${service}
- *Fecha propuesta:* ${date}
- *Notas:* ${notes}`;

            // Create URL-encoded message
            const encodedMessage = encodeURIComponent(message);
            const waURL = `https://wa.me/${waNumber}?text=${encodedMessage}`;

            // Redirect to WhatsApp
            window.open(waURL, '_blank');
        });
    }

    // 5. Stat Counter Animation on Scroll Into View
    const stats = document.querySelectorAll('.stat-number');
    let animated = false;

    const animateCounters = () => {
        stats.forEach(stat => {
            const target = stat.getAttribute('data-target');
            if (!target) return; // skip static text like '100%'

            const targetNum = parseInt(target, 10);
            let count = 0;
            const increment = Math.ceil(targetNum / 50); // animate in 50 steps
            
            const updateCount = () => {
                count += increment;
                if (count >= targetNum) {
                    stat.textContent = `+${targetNum}`;
                } else {
                    stat.textContent = `+${count}`;
                    requestAnimationFrame(updateCount);
                }
            };
            
            updateCount();
        });
    };

    const handleScrollForStats = () => {
        if (stats.length === 0 || animated) return;

        const rect = stats[0].getBoundingClientRect();
        const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
        
        // If the stats element is visible
        if (!(rect.bottom < 0 || rect.top - viewHeight >= 0)) {
            animateCounters();
            animated = true;
            window.removeEventListener('scroll', handleScrollForStats);
        }
    };

    window.addEventListener('scroll', handleScrollForStats);
    // Initial check
    handleScrollForStats();

    // 6. Scroll Reveal Animation using Intersection Observer
    const reveals = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.1, // trigger when 10% of element is visible
            rootMargin: '0px 0px -30px 0px'
        });

        reveals.forEach(reveal => revealObserver.observe(reveal));
    } else {
        // Fallback for older browsers
        reveals.forEach(reveal => reveal.classList.add('active'));
    }
});
