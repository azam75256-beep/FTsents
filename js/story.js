document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP SplitText if you had it, but we'll use standard staggering
    gsap.registerPlugin(ScrollTrigger);

    // Hero Animations
    const heroTl = gsap.timeline();
    heroTl.to('.reveal-text', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power4.out',
        delay: 0.5
    });

    // Parallax Background
    gsap.to('.hero-bg', {
        yPercent: 30, // Move 30% down
        ease: 'none',
        scrollTrigger: {
            trigger: '.story-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    // Reveal Sections on Scroll
    const storySections = document.querySelectorAll('.story-section');
    storySections.forEach((section) => {
        const img = section.querySelector('.reveal-img img');
        const text = section.querySelector('.story-text-box');

        // Image Reveal
        gsap.from(img, {
            scale: 1.3,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
            }
        });

        // Text Reveal
        gsap.from(text.children, {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 70%',
            }
        });
    });

    // Quote Animation
    gsap.from('.quote-content > *', {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.quote-section',
            start: 'top 70%',
        }
    });

    // Counter Animation for Stats
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = +stat.getAttribute('data-target');

        ScrollTrigger.create({
            trigger: stat,
            start: 'top 90%',
            onEnter: () => {
                let count = 0;
                const updateCount = () => {
                    const increment = target / 100;
                    if (count < target) {
                        count += increment;
                        stat.innerText = Math.ceil(count);
                        setTimeout(updateCount, 20);
                    } else {
                        stat.innerText = target;
                    }
                };
                updateCount();
            },
            once: true
        });
    });

    // Initial Hide for Scroll Reveal Elements
    gsap.set('.story-text-box > *', { opacity: 0, y: 50 });
    gsap.set('.quote-content > *', { opacity: 0, y: 30 });
});
