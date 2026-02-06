// Checkout Page Logic
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Checkout Page Initializing...');

    const summaryItems = document.getElementById('summary-items');
    const subtotalEl = document.getElementById('summary-subtotal');
    const totalEl = document.getElementById('summary-total');
    const checkoutForm = document.getElementById('checkout-form');
    const successModal = document.getElementById('success-modal');

    // 1. Get Cart from Local Storage
    let cart = JSON.parse(localStorage.getItem('ftScentsCart')) || [];

    if (cart.length === 0) {
        summaryItems.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
        // Optional: Redirect back to shop if empty
        // setTimeout(() => window.location.href = 'shop.html', 3000);
    } else {
        // 2. Populate Summary
        let total = 0;
        summaryItems.innerHTML = cart.map(item => {
            const price = parseFloat(item.price) || 0;
            total += price;
            return `
                <div class="summary-item">
                    <span class="name">${item.name}</span>
                    <span class="price">$${price}</span>
                </div>
            `;
        }).join('');

        subtotalEl.innerText = `$${total.toFixed(2)}`;
        totalEl.innerText = `$${total.toFixed(2)}`;
    }

    // 3. Handle Form Submission
    if (checkoutForm) {
        checkoutForm.onsubmit = (e) => {
            e.preventDefault();

            // 1. Form Validation (Basic)
            const requiredFields = checkoutForm.querySelectorAll('[required]');
            let isValid = true;
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = 'red';
                    isValid = false;
                } else {
                    field.style.borderColor = '';
                }
            });

            if (!isValid) return;

            // 2. Animate button to "Processing" state
            const btn = checkoutForm.querySelector('.complete-order-btn');
            const originalText = btn.innerText;

            gsap.to(btn, {
                opacity: 0.7,
                scale: 0.98,
                duration: 0.3
            });
            btn.innerText = 'Verifying Payment...';
            btn.style.pointerEvents = 'none';

            // 3. Simulate API Call with "Premium" Feel
            setTimeout(() => {
                btn.innerText = 'Finalizing Order...';

                setTimeout(() => {
                    // Clear Cart from Local Storage
                    localStorage.removeItem('ftScentsCart');

                    // Trigger global cart update if script.js is loaded
                    if (typeof updateCartUI === 'function') {
                        updateCartUI();
                    } else {
                        // Manual fallback if updateCartUI isn't available
                        const cartCount = document.querySelector('.cart-count');
                        if (cartCount) cartCount.textContent = '0';
                    }

                    // 4. Show Success Modal with Animation
                    if (successModal) {
                        successModal.style.display = 'flex';
                        gsap.from(successModal.querySelector('.modal-content'), {
                            y: 100,
                            opacity: 0,
                            duration: 0.8,
                            ease: "elastic.out(1, 0.7)"
                        });

                        // Particle effect or confetti could go here (optional/simplified)
                        console.log('Order completed successfully!');
                    } else {
                        alert('Order Placed Successfully!');
                        window.location.href = 'index.html';
                    }
                }, 1500);
            }, 1000);

            return false;
        };
    }

    // 4. GSAP Animations
    gsap.from(".checkout-form-section", {
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    gsap.from(".order-summary-card", {
        x: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2
    });
});
