const products = [
    {
        slot: 'pack',
        name: 'Trick or Trade Booster Pack',
        price: '$4.99',
        badge: 'POPULAR',
        img: 'https://i.imgur.com/NuW4HpF.png',
        link: 'https://www.ebay.com/str/tinkswonderland'
    },
    {
        slot: 'haunter',
        name: 'Haunter · Halloween 065/196',
        price: '$3.50',
        badge: 'SINGLE',
        img: 'https://i.imgur.com/NuW4HpF.png',
        link: 'https://www.ebay.com/str/tinkswonderland'
    },
    {
        slot: 'box',
        name: 'Mini Booster Box (Sealed)',
        price: '$29.99',
        badge: 'SEALED',
        img: 'https://i.imgur.com/NuW4HpF.png',
        link: 'https://www.ebay.com/str/tinkswonderland'
    },
    {
        slot: 'lot',
        name: 'Spooky Singles Mystery Lot',
        price: '$12.99',
        badge: 'BUNDLE',
        img: 'https://i.imgur.com/NuW4HpF.png',
        link: 'https://www.ebay.com/str/tinkswonderland'
    },
    {
        slot: 'promo',
        name: 'Pumpkin Promo Bundle',
        price: '$19.99',
        badge: 'NEW',
        img: 'https://i.imgur.com/NuW4HpF.png',
        link: 'https://www.ebay.com/str/tinkswonderland'
    }
];

let currentIndex = 0;
let autoTimer = null;

const track = document.querySelector('.carousel-track');
const dotsContainer = document.querySelector('.carousel-dots');
const prevBtn = document.querySelector('.carousel-btn--prev');
const nextBtn = document.querySelector('.carousel-btn--next');

function buildCarousel() {
    track.innerHTML = '';
    dotsContainer.innerHTML = '';

    products.forEach((product, index) => {
        // build card
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
            <div class="product-card__badge">${product.badge}</div>
            <div class="product-card__img-wrap">
                ${product.img 
                    ? `<img src="${product.img}" alt="${product.name}" class="product-card__img"/>` 
                    : `<div class="product-card__img-placeholder"></div>`
                }
            </div>
            <h3 class="product-card__name">${product.name}</h3>
            <div class="product-card__price">${product.price}</div>
            <a href="${product.link}" 
               target="_blank" 
               rel="noopener" 
               class="product-card__btn">View on eBay</a>
        `;
        track.appendChild(card);

        // build dot
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => goTo(index));
        dotsContainer.appendChild(dot);
    });
}

function updateCarousel() {
    // move the track
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // update dots
    document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('carousel-dot--active', i === currentIndex);
    });
}

function goTo(index) {
    currentIndex = index;
    updateCarousel();
    restartTimer();
}

function goNext() {
    currentIndex = (currentIndex + 1) % products.length;
    updateCarousel();
    restartTimer();
}

function goPrev() {
    currentIndex = (currentIndex - 1 + products.length) % products.length;
    updateCarousel();
    restartTimer();
}

function restartTimer() {
    clearInterval(autoTimer);
    autoTimer = setInterval(goNext, 4500);
}

// wire up buttons
prevBtn.addEventListener('click', goPrev);
nextBtn.addEventListener('click', goNext);

// initialize
buildCarousel();
updateCarousel();
restartTimer();

// ============================================
// REVEAL ANIMATIONS (IntersectionObserver)
// ============================================

const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15
});

revealElements.forEach(el => revealObserver.observe(el));

// ============================================
// STAR FIZZLE (reviews section)
// ============================================

const reviewsGrid = document.getElementById('reviews-grid');
const starsContainer = document.getElementById('stars-container');
let fizzled = false;

const fizzleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !fizzled) {
            fizzled = true;
            fizzle();
            fizzleObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15
});

fizzleObserver.observe(reviewsGrid);

function fizzle() {
    const glyphs = ['✦', '✧', '⋆', '✯', '✩', '❅'];
    const colors = ['#ffd700', '#ff6b00', '#c77dff', '#ff8fab', '#fff5e0', '#9bf6ff'];

    for (let i = 0; i < 50; i++) {
        const star = document.createElement('span');
        star.textContent = glyphs[i % glyphs.length];

        const size = 14 + Math.random() * 30;
        const delay = (Math.random() * 0.6).toFixed(2);
        const duration = (1 + Math.random() * 0.8).toFixed(2);

        star.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            font-size: ${size}px;
            color: ${colors[i % colors.length]};
            text-shadow: 0 0 10px currentColor;
            opacity: 0;
            pointer-events: none;
            animation: starFizzle ${duration}s ease forwards;
            animation-delay: ${delay}s;
        `;

        starsContainer.appendChild(star);
    }

    // clean up after animation completes
    setTimeout(() => {
        starsContainer.innerHTML = '';
    }, 2400);
}