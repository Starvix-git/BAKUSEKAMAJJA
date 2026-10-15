// Poultry farm price calculator
// This script updates the total based on the selected breed and number of chicks.

const breedPrices = {
    Kuroiler: 3000,
    Broiler: 3300,
    Saso: 3300
};

const totalElement = document.getElementById('total');
const summaryElement = document.getElementById('order-summary');
const depositElement = document.getElementById('deposit-amount');
const balanceElement = document.getElementById('balance-amount');
const breedButtons = document.querySelectorAll('.breed-option');
const qtyButtons = document.querySelectorAll('.chip');
const qtyInput = document.getElementById('custom-qty');
const orderBreedSelect = document.getElementById('order-breed');
const orderQtyInput = document.getElementById('order-qty');
const orderForm = document.getElementById('order-form');
const copyButtons = document.querySelectorAll('[data-copy]');

let selectedBreed = 'Kuroiler';
let selectedQty = Number(qtyInput.value) || 100;

// Format numbers with commas for money display
function formatMoney(value) {
    return new Intl.NumberFormat('en-US').format(value);
}

function syncQtyButtons() {
    qtyButtons.forEach((btn) => {
        const isActive = Number(btn.dataset.qty) === selectedQty;
        btn.classList.toggle('active', isActive);
    });
}

function syncFormValues() {
    if (orderBreedSelect) {
        orderBreedSelect.value = selectedBreed;
    }

    if (orderQtyInput) {
        orderQtyInput.value = selectedQty;
    }
}

// Recalculate and update the estimate panel
function updateTotal() {
    const unitPrice = breedPrices[selectedBreed];
    const total = unitPrice * selectedQty;
    // Orders require half of the total upfront; the other half remains due.
    const deposit = total / 2;
    const balance = total - deposit;

    totalElement.innerHTML = '<small>UGX</small> ' + formatMoney(total);
    summaryElement.textContent = `${selectedQty} ${selectedBreed} chicks at UGX ${formatMoney(unitPrice)} each`;
    depositElement.textContent = `UGX ${formatMoney(deposit)}`;
    balanceElement.textContent = `UGX ${formatMoney(balance)}`;

    const waLink = document.querySelector('.btn');
    waLink.href = `https://wa.me/256785082059?text=${encodeURIComponent(`Hello, I want to order ${selectedQty} ${selectedBreed} chicks. Total estimate: UGX ${formatMoney(total)}. Required 50% deposit: UGX ${formatMoney(deposit)}. Balance remaining: UGX ${formatMoney(balance)}. I plan to send the deposit to 0756031835 or 0785082059. Please confirm the correct recipient.`)}`;
    syncFormValues();
}

// Select breed and keep the chosen button active
breedButtons.forEach((button) => {
    button.addEventListener('click', () => {
        selectedBreed = button.dataset.breed;
        breedButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
        updateTotal();
    });
});

// Select quantity from quick buttons
qtyButtons.forEach((button) => {
    button.addEventListener('click', () => {
        selectedQty = Number(button.dataset.qty);
        qtyInput.value = selectedQty;
        syncQtyButtons();
        updateTotal();
    });
});

// Allow custom number entry
qtyInput.addEventListener('input', (event) => {
    const value = Number(event.target.value);

    if (!Number.isFinite(value) || value < 1) {
        event.target.value = 1;
        selectedQty = 1;
    } else {
        selectedQty = value;
    }

    syncQtyButtons();
    updateTotal();
});

if (orderBreedSelect) {
    orderBreedSelect.addEventListener('change', (event) => {
        selectedBreed = event.target.value;
        breedButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.breed === selectedBreed));
        updateTotal();
    });
}

if (orderQtyInput) {
    orderQtyInput.addEventListener('input', (event) => {
        const value = Number(event.target.value);
        if (!Number.isFinite(value) || value < 1) {
            event.target.value = 1;
            selectedQty = 1;
        } else {
            selectedQty = value;
        }

        qtyInput.value = selectedQty;
        syncQtyButtons();
        updateTotal();
    });
}

if (orderForm) {
    orderForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('customer-name').value.trim() || 'Customer';
        const phone = document.getElementById('customer-phone').value.trim();
        const breed = orderBreedSelect.value || selectedBreed;
        const qty = Number(orderQtyInput.value) || selectedQty;
        const location = document.getElementById('order-location').value.trim();
        const total = breedPrices[breed] * qty;
        const deposit = total / 2;
        const balance = total - deposit;

        const message = `Hello, my name is ${name}. I want to order ${qty} ${breed} chicks. Phone: ${phone}. Location: ${location}. Total estimate: UGX ${formatMoney(total)}. Required 50% deposit: UGX ${formatMoney(deposit)}. Balance remaining: UGX ${formatMoney(balance)}. I plan to send the deposit to 0756031835 or 0785082059. Please confirm the correct recipient.`;
        const whatsappUrl = `https://wa.me/256785082059?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, '_blank');
    });
}

copyButtons.forEach((button) => {
    button.addEventListener('click', async () => {
        const number = button.dataset.copy;

        try {
            await navigator.clipboard.writeText(number);
            button.textContent = 'Copied';
            setTimeout(() => {
                button.textContent = 'Copy';
            }, 1400);
        } catch (error) {
            button.textContent = 'Copy failed';
            setTimeout(() => {
                button.textContent = 'Copy';
            }, 1400);
        }
    });
});

const revealTargets = document.querySelectorAll(
    '.section-intro, .breed-card, .point, .about-copy, .about-panel, #order .Det, #order .est, #order .result, #order .quick-form, #contact .sec, #contact .contact'
);

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                observer.unobserve(entry.target);
                window.setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, 1000);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach((target) => {
        target.classList.add('scroll-reveal');
        revealObserver.observe(target);
    });
}

// Run once on page load
syncQtyButtons();
updateTotal();
