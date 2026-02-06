

// GSAP Plugin Registration
gsap.registerPlugin(ScrollTrigger);

// ============================================
// GLOBAL INITIALIZATION
// ============================================

const initGlobalScripts = () => {
    console.log('Initializing Global scripts...');

    // Navbar Scroll Effect
    const handleNavScroll = () => {
        const nav = document.querySelector(".navbar");
        if (nav) {
            if (window.scrollY > 100) {
                nav.classList.add("scrolled");
            } else {
                nav.classList.remove("scrolled");
            }
        }
    };

    // Hero Pinning with Signature Essence Overlay
    if (document.querySelector('.hero') && document.querySelector('.duo-section')) {
        ScrollTrigger.create({
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            pin: true,
            pinSpacing: false,
            scrub: true
        });
    }

    window.removeEventListener("scroll", handleNavScroll);
    window.addEventListener("scroll", handleNavScroll);

    // Mobile Menu Toggle
    const menuBtn = document.querySelector(".menu-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");
    const closeBtn = document.querySelector(".close-menu");
    if (menuBtn && mobileMenu && closeBtn) {
        menuBtn.onclick = () => mobileMenu.classList.add("active");
        closeBtn.onclick = () => mobileMenu.classList.remove("active");
    }

    // Search Toggle Logic
    const searchBtn = document.querySelector(".search-btn");
    const searchOverlay = document.querySelector(".search-overlay");
    const searchClose = document.querySelector(".search-close");
    if (searchBtn && searchOverlay && searchClose) {
        searchBtn.onclick = () => searchOverlay.classList.add("active");
        searchClose.onclick = () => searchOverlay.classList.remove("active");
    }

    // Cart Drawer Logic
    const cartBtn = document.getElementById("cart-btn");
    const cartDrawer = document.querySelector(".cart-drawer");
    const cartClose = document.querySelector(".cart-close");

    if (cartBtn && cartDrawer && cartClose) {
        // Remove old listeners to prevent duplicates
        const newCartBtn = cartBtn.cloneNode(true);
        const newCartClose = cartClose.cloneNode(true);
        cartBtn.parentNode.replaceChild(newCartBtn, cartBtn);
        cartClose.parentNode.replaceChild(newCartClose, cartClose);

        // Add fresh listeners
        newCartBtn.onclick = () => {
            cartDrawer.classList.add("active");
        };
        newCartClose.onclick = () => {
            cartDrawer.classList.remove("active");
        };
    }

    // Carousel Slider Logic
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');
    const backBtn = document.getElementById('back');
    const seeMoreBtns = document.querySelectorAll('.seeMore');
    const carousel = document.querySelector('.carousel');
    const listHTML = document.querySelector('.carousel .list');

    if (carousel && listHTML) {
        if (nextBtn) nextBtn.onclick = () => showSlider('next', carousel, listHTML);
        if (prevBtn) prevBtn.onclick = () => showSlider('prev', carousel, listHTML);

        seeMoreBtns.forEach(btn => {
            btn.onclick = () => {
                carousel.classList.remove('next', 'prev');
                carousel.classList.add('showDetail');
            };
        });

        if (backBtn) {
            backBtn.onclick = () => {
                carousel.classList.remove('showDetail', 'next', 'prev');
            };
        }
    }

    // Reveal Animations (Home page only)
    const revealElements = [
        { selector: ".duo-cards .product-card", y: 100 },
        { selector: ".note-card", y: 100 },
        { selector: ".about-img", x: -100 },
        { selector: ".about-content", x: 100 },
        { selector: ".testi-card", y: 50 },
        { selector: ".newsletter-box", scale: 0.95 }
    ];

    revealElements.forEach(item => {
        const elements = document.querySelectorAll(item.selector);
        if (elements.length > 0) {
            gsap.from(elements, {
                scrollTrigger: {
                    trigger: item.selector,
                    start: "top 85%",
                },
                x: item.x || 0,
                y: item.y || 0,
                scale: item.scale || 1,
                opacity: 0,
                duration: 1,
                stagger: 0.2
            });
        }
    });

    // Cart Management
    let cart = JSON.parse(localStorage.getItem('ftScentsCart')) || [];

    // Checkout Button in Cart Drawer
    const checkoutBtn = document.querySelector(".checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            if (cart.length > 0) {
                window.location.href = "checkout.html";
            } else {
                alert("Your cart is empty!");
            }
        };
    }

    const updateCartUI = () => {
        const cartCount = document.querySelector('.cart-count');
        const cartList = document.getElementById('cart-list');
        const cartTotalCount = document.getElementById('cart-total-count');

        // Total items sum of quantities
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        if (cartCount) cartCount.textContent = totalItems;
        if (cartTotalCount) cartTotalCount.textContent = totalItems;

        if (cartList) {
            if (cart.length === 0) {
                cartList.innerHTML = '<p class="empty-msg">Your cart is currently empty.</p>';
            } else {
                cartList.innerHTML = cart.map((item, index) => `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.name}</div>
                            <div style="font-size: 12px; color: var(--text-muted);">$${item.price}</div>
                            <div class="cart-qty-control">
                                <button onclick="updateQuantity(${index}, -1)" class="qty-btn" title="Decrease Quantity"><i class="fa-solid fa-minus"></i></button>
                                <span class="qty-val">${item.quantity || 1}</span>
                                <button onclick="updateQuantity(${index}, 1)" class="qty-btn" title="Increase Quantity"><i class="fa-solid fa-plus"></i></button>
                            </div>
                        </div>
                        <button onclick="removeFromCart(${index})" style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: 18px; align-self: flex-start;">&times;</button>
                    </div>
                `).join('');
            }
        }
    };
    window.updateCartUI = updateCartUI;

    const addToCart = (productName, productPrice) => {
        const existingItemIndex = cart.findIndex(item => item.name === productName);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
        } else {
            cart.push({ name: productName, price: productPrice, quantity: 1 });
        }

        localStorage.setItem('ftScentsCart', JSON.stringify(cart));
        updateCartUI();

        // Show popup notification
        const popup = document.getElementById('cart-popup');
        const popupMessage = document.getElementById('popup-message');
        if (popup && popupMessage) {
            popupMessage.textContent = `${productName} added to cart!`;
            popup.classList.add('active');
            setTimeout(() => popup.classList.remove('active'), 4000); // Increased to 4s
        }
    };

    window.updateQuantity = (index, delta) => {
        if (cart[index]) {
            cart[index].quantity = (cart[index].quantity || 1) + delta;

            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }

            localStorage.setItem('ftScentsCart', JSON.stringify(cart));
            updateCartUI();
        }
    };

    window.removeFromCart = (index) => {
        cart.splice(index, 1);
        localStorage.setItem('ftScentsCart', JSON.stringify(cart));
        updateCartUI();
    };

    // Add to Cart Button Handlers
    document.querySelectorAll(".add-to-cart-btn").forEach(button => {
        button.onclick = (e) => {
            e.preventDefault();
            const productName = button.dataset.product || button.getAttribute('data-product');
            const productPrice = button.dataset.price || button.getAttribute('data-price');
            if (productName && productPrice) {
                addToCart(productName, productPrice);
            }
        };
    });

    // Home page add to cart (btn-sm and carousel buttons)
    document.querySelectorAll(".btn-sm, .checkout button:first-child").forEach(button => {
        button.onclick = (e) => {
            e.preventDefault();
            let productName = "Perfume";
            let productPrice = "200";
            const card = e.target.closest(".note-card") || e.target.closest(".product-card") || e.target.closest(".item");
            if (card) {
                const title = card.querySelector("h4") || card.querySelector("h3") || card.querySelector(".topic");
                if (title) productName = title.innerText.replace(/[\r\n]/g, " ").trim();

                const priceEl = card.querySelector(".note-price") || card.querySelector(".product-price");
                if (priceEl) {
                    productPrice = priceEl.innerText.replace(/[^0-9]/g, '');
                }
            }
            addToCart(productName, productPrice);
        };
    });

    // Initialize cart UI
    updateCartUI();

    // Re-init Horizontal Scroll
    if (typeof initHorizontalScroll === 'function') initHorizontalScroll();
};

// Carousel Helpers
const showSlider = (type, carousel, listHTML) => {
    let nextBtn = document.getElementById('next');
    let prevBtn = document.getElementById('prev');
    if (nextBtn) nextBtn.style.pointerEvents = 'none';
    if (prevBtn) prevBtn.style.pointerEvents = 'none';

    carousel.classList.remove('next', 'prev');
    let items = document.querySelectorAll('.carousel .list .item');
    if (type === 'next') {
        listHTML.appendChild(items[0]);
        carousel.classList.add('next');
    } else {
        listHTML.prepend(items[items.length - 1]);
        carousel.classList.add('prev');
    }

    setTimeout(() => {
        if (nextBtn) nextBtn.style.pointerEvents = 'auto';
        if (prevBtn) prevBtn.style.pointerEvents = 'auto';
    }, 700);
};

// Horizontal Scroll Pinning (Aromatic Journey)
const initHorizontalScroll = () => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 1025px)", () => {
        const sectionsPin = gsap.utils.toArray(".pin-panel");
        const pinWrapper = document.querySelector(".pin-wrapper");
        const triggerElement = document.querySelector(".pinned-discovery");

        if (sectionsPin.length > 0 && pinWrapper && triggerElement) {
            // Kill existing trigger for this section if any (prevents duplicates)
            ScrollTrigger.getAll().forEach(st => {
                if (st.trigger === triggerElement) st.kill();
            });

            gsap.to(sectionsPin, {
                xPercent: -100 * (sectionsPin.length - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: triggerElement,
                    pin: true,
                    scrub: 1,
                    snap: 1 / (sectionsPin.length - 1),
                    end: () => "+=" + pinWrapper.scrollWidth,
                    invalidateOnRefresh: true
                }
            });
        }
    });
};

// Preloader Logic
const initPreloader = () => {
    if (!document.getElementById("loader")) {
        initGlobalScripts();
        return;
    }

    const loaderTl = gsap.timeline();
    const percentLabel = document.querySelector(".loader-percent");
    let count = { val: 0 };

    loaderTl.to(".loader-logo .char", {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.6,
        stagger: 0.05,
        ease: "expo.out"
    })
        .to(count, {
            val: 100,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => {
                if (percentLabel) percentLabel.innerText = Math.floor(count.val) + "%";
            }
        }, 0.2)
        .to(".progress", { width: "100%", duration: 1.5, ease: "power2.inOut" }, 0.2)
        .to(".loader-content", { opacity: 0, scale: 1.1, duration: 0.4, ease: "power2.in" })
        .to(".reveal-panel.top", { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, "-=0.2")
        .to(".reveal-panel.bottom", {
            yPercent: 100, duration: 0.8, ease: "expo.inOut",
            onComplete: () => {
                document.getElementById("loader").style.display = "none";
            }
        }, "-=0.8");

    loaderTl.add(() => initGlobalScripts(), "-=0.5");
};



// Initialize Lenis
window.lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 2,
});

function raf(time) {
    window.lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

window.lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    window.lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Initialize everything
initPreloader();

