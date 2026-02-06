document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Reveal
    const heroTl = gsap.timeline();
    heroTl.from('.reveal-text', {
        opacity: 0,
        y: 40,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power4.out',
        delay: 0.5
    });

    // Content Grid Reveal
    gsap.from('.reveal-col', {
        opacity: 0,
        y: 60,
        duration: 1,
        stagger: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.contact-content',
            start: 'top 70%'
        }
    });

    // Form Groups Staggered Reveal
    gsap.from('.form-group', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.contact-card',
            start: 'top 60%'
        }
    });

    // Info Items Reveal
    gsap.from('.info-item', {
        opacity: 0,
        x: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.contact-info-col',
            start: 'top 60%'
        }
    });

    // Map Section Reveal
    gsap.from('.map-content', {
        opacity: 0,
        scale: 0.9,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.map-section',
            start: 'top 60%'
        }
    });

    // Form Submission Handling
    const contactForm = document.getElementById('contact-form');
    const formPopup = document.getElementById('form-popup');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Show Success Popup
            formPopup.classList.add('active');
            contactForm.reset();

            setTimeout(() => {
                formPopup.classList.remove('active');
            }, 3000);
        });
    }

    // Parallax branding element
    gsap.to('.parallax-img', {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
            trigger: '.brand-element',
            scrub: true
        }
    });
});
