// ==========================================
// DATOS DE GORRAS
// ==========================================

const gorras = [
    {
        id: 1,
        nombre: 'New Era Classic Black',
        marca: 'New Era',
        tipo: 'caballero',
        categoria: 'clasica',
        precio: 45,
        imagen: 'images/gorras/gorra1.jpg'
    },
    {
        id: 2,
        nombre: 'New Era Yankees Heritage',
        marca: 'New Era',
        tipo: 'caballero',
        categoria: 'deportiva',
        precio: 52,
        imagen: 'images/gorras/gorra2.jpg'
    },
    {
        id: 3,
        nombre: 'Carhartt Workwear Cap',
        marca: 'Carhartt',
        tipo: 'caballero',
        categoria: 'urbana',
        precio: 38,
        imagen: 'images/gorras/gorra3.jpg'
    },
    {
        id: 4,
        nombre: 'Supreme Drip Cap',
        marca: 'Supreme',
        tipo: 'caballero',
        categoria: 'urbana',
        precio: 55,
        imagen: 'images/gorras/gorra4.jpg'
    },
    {
        id: 5,
        nombre: 'Stüssy Essential Cap',
        marca: 'Supreme',
        tipo: 'caballero',
        categoria: 'urbana',
        precio: 42,
        imagen: 'images/gorras/gorra5.jpg'
    },
    {
        id: 6,
        nombre: 'New Era Women Rosa',
        marca: 'New Era',
        tipo: 'dama',
        categoria: 'clasica',
        precio: 45,
        imagen: 'images/gorras/gorra6.jpg'
    },
    {
        id: 7,
        nombre: 'Carhartt Women Beige',
        marca: 'Carhartt',
        tipo: 'dama',
        categoria: 'urbana',
        precio: 38,
        imagen: 'images/gorras/gorra7.jpg'
    },
    {
        id: 8,
        nombre: 'Supreme Pastel Cap',
        marca: 'Supreme',
        tipo: 'dama',
        categoria: 'urbana',
        precio: 55,
        imagen: 'images/gorras/gorra8.jpg'
    },
    {
        id: 9,
        nombre: 'New Era Dad Hat White',
        marca: 'New Era',
        tipo: 'caballero',
        categoria: 'clasica',
        precio: 40,
        imagen: 'images/gorras/gorra9.jpg'
    },
    {
        id: 10,
        nombre: 'Vintage Trucker Cap',
        marca: 'Carhartt',
        tipo: 'caballero',
        categoria: 'urbana',
        precio: 48,
        imagen: 'images/gorras/gorra10.jpg'
    },
    {
        id: 11,
        nombre: 'Minimalist Gray Cap',
        marca: 'Supreme',
        tipo: 'dama',
        categoria: 'clasica',
        precio: 40,
        imagen: 'images/gorras/gorra11.jpg'
    },
    {
        id: 12,
        nombre: 'Carhartt Premium Black',
        marca: 'Carhartt',
        tipo: 'dama',
        categoria: 'deportiva',
        precio: 50,
        imagen: 'images/gorras/gorra12.jpg'
    }
];

const carouselImages = [
    'images/carousel/carousel1.jpg',
    'images/carousel/carousel2.jpg',
    'images/carousel/carousel3.jpg'
];

const topGorras = [gorras[0], gorras[3], gorras[1]];

// ==========================================
// ESTADO GLOBAL
// ==========================================

let currentPage = 'inicio';
let currentCategoryFilter = 'caballero';
let currentBrandFilter = 'todos';
let carouselIndex = 0;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let menuOpen = true;

// ==========================================
// INICIALIZACIÓN
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    renderTopGorras();
    setupEventListeners();
    updateCartUI();
    createCarouselIndicators();
    
    // Auto-rotate carrusel cada 5 segundos
    setInterval(() => {
        carouselIndex = (carouselIndex + 1) % carouselImages.length;
        updateCarousel();
    }, 5000);
});

// ==========================================
// EVENT LISTENERS
// ==========================================

function setupEventListeners() {
    // Navegación páginas
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const page = e.target.closest('.nav-btn').dataset.page;
            goToPage(page);
            if (window.innerWidth < 768) {
                toggleMenu();
            }
        });
    });

    // Filtros catálogo
    document.querySelectorAll('.submenu-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentCategoryFilter = e.target.dataset.category;
            document.querySelectorAll('.submenu-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderCatalog();
        });
    });

    // Filtros por marca
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentBrandFilter = e.target.dataset.brand;
            renderCatalog();
        });
    });

    // Carrusel
    document.getElementById('carousel-prev').addEventListener('click', () => {
        carouselIndex = (carouselIndex - 1 + carouselImages.length) % carouselImages.length;
        updateCarousel();
    });

    document.getElementById('carousel-next').addEventListener('click', () => {
        carouselIndex = (carouselIndex + 1) % carouselImages.length;
        updateCarousel();
    });

    // Carrito
    document.getElementById('cart-btn').addEventListener('click', toggleCartPanel);
    document.getElementById('close-cart').addEventListener('click', toggleCartPanel);
    document.getElementById('menu-toggle').addEventListener('click', toggleMenu);

    // Indicadores carrusel
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('indicator')) {
            carouselIndex = parseInt(e.target.dataset.index);
            updateCarousel();
        }
    });
}

// ==========================================
// NAVEGACIÓN
// ==========================================

function goToPage(page) {
    currentPage = page;
    
    // Ocultar todas las páginas
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Mostrar página actual
    document.getElementById(`page-${page}`).classList.add('active');
    
    // Actualizar contenido según página
    if (page === 'catalogo') {
        document.getElementById('catalog-submenu').classList.remove('hidden');
        renderCatalog();
        updateCatalogTitle();
    } else if (page === 'carrito') {
        renderCartPage();
    }
    
    // Actualizar menu activo
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === page) {
            btn.classList.add('active');
        }
    });
    
    window.scrollTo(0, 0);
}

function updateCatalogTitle() {
    const titleEl = document.getElementById('catalog-title');
    titleEl.textContent = currentCategoryFilter === 'caballero' ? 'Gorras Caballero' : 'Gorras Dama';
}

// ==========================================
// CARRUSEL
// ==========================================

function initCarousel() {
    document.getElementById('carousel-img').src = carouselImages[0];
}

function updateCarousel() {
    document.getElementById('carousel-img').src = carouselImages[carouselIndex];
    updateIndicators();
}

function createCarouselIndicators() {
    const container = document.getElementById('carousel-indicators');
    carouselImages.forEach((_, idx) => {
        const indicator = document.createElement('button');
        indicator.classList.add('indicator');
        if (idx === 0) indicator.classList.add('active');
        indicator.dataset.index = idx;
        container.appendChild(indicator);
    });
}

function updateIndicators() {
    document.querySelectorAll('.indicator').forEach((ind, idx) => {
        ind.classList.toggle('active', idx === carouselIndex);
    });
}

// ==========================================
// RENDERIZADO GORRAS
// ==========================================

function renderTopGorras() {
    const container = document.getElementById('top-gorras');
    container.innerHTML = topGorras.map(gorra => createGorraCard(gorra)).join('');
}

function renderCatalog() {
    const filtered = gorras.filter(g => {
        const tipoMatch = g.tipo === currentCategoryFilter;
        const brandMatch = currentBrandFilter === 'todos' || g.marca === currentBrandFilter;
        return tipoMatch && brandMatch;
    });

    const container = document.getElementById('catalog-grid');
    container.innerHTML = filtered.length > 0 
        ? filtered.map(gorra => createGorraCard(gorra)).join('')
        : '<p class="no-products">No hay productos disponibles</p>';
}

function createGorraCard(gorra) {
    return `
        <div class="product-card">
            <div class="product-image">
                <img src="${gorra.imagen}" alt="${gorra.nombre}">
            </div>
            <div class="product-info">
                <p class="product-brand">${gorra.marca}</p>
                <h3 class="product-name">${gorra.nombre}</h3>
                <div class="product-price">$${gorra.precio}</div>
                
                <div class="product-controls">
                    <div class="quantity-control">
                        <button class="qty-btn qty-minus" onclick="decreaseQty(${gorra.id})">−</button>
                        <input type="number" id="qty-${gorra.id}" value="1" min="1" class="qty-input">
                        <button class="qty-btn qty-plus" onclick="increaseQty(${gorra.id})">+</button>
                    </div>
                    <button class="btn-add-cart" onclick="addToCart(${gorra.id})">Agregar</button>
                </div>
            </div>
        </div>
    `;
}

// ==========================================
// CARRITO
// ==========================================

function addToCart(gorraId) {
    const gorra = gorras.find(g => g.id === gorraId);
    const qtyInput = document.getElementById(`qty-${gorraId}`);
    const cantidad = parseInt(qtyInput.value) || 1;

    const existingItem = cart.find(item => item.id === gorraId);
    
    if (existingItem) {
        existingItem.cantidad += cantidad;
    } else {
        cart.push({ ...gorra, cantidad });
    }

    qtyInput.value = '1';
    saveCart();
    updateCartUI();
    
    // Mostrar confirmación
    showNotification(`${gorra.nombre} agregado al carrito`);
}

function removeFromCart(gorraId) {
    cart = cart.filter(item => item.id !== gorraId);
    saveCart();
    updateCartUI();
    renderCartPage();
}

function updateCartQuantity(gorraId, newQty) {
    if (newQty <= 0) {
        removeFromCart(gorraId);
    } else {
        const item = cart.find(i => i.id === gorraId);
        if (item) {
            item.cantidad = newQty;
            saveCart();
            updateCartUI();
            renderCartPage();
        }
    }
}

function increaseQty(gorraId) {
    const input = document.getElementById(`qty-${gorraId}`);
    input.value = parseInt(input.value) + 1;
}

function decreaseQty(gorraId) {
    const input = document.getElementById(`qty-${gorraId}`);
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

function updateCartUI() {
    const cartCount = cart.reduce((sum, item) => sum + item.cantidad, 0);
    document.getElementById('cart-count').textContent = cartCount;

    const cartItemsEl = document.getElementById('cart-items');
    const cartEmptyEl = document.getElementById('cart-empty');
    const cartFooterEl = document.getElementById('cart-footer');

    if (cart.length === 0) {
        cartItemsEl.innerHTML = '';
        cartEmptyEl.classList.remove('hidden');
        cartFooterEl.classList.add('hidden');
    } else {
        cartEmptyEl.classList.add('hidden');
        cartFooterEl.classList.remove('hidden');
        
        cartItemsEl.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="cart-item-info">
                    <p class="cart-item-name">${item.nombre}</p>
                    <p class="cart-item-price">$${item.precio}</p>
                </div>
                <div class="cart-item-qty">
                    Cantidad: <strong>${item.cantidad}</strong>
                </div>
                <div class="cart-item-total">$${(item.precio * item.cantidad).toFixed(2)}</div>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        document.getElementById('cart-total-price').textContent = '$' + total.toFixed(2);
    }
}

function renderCartPage() {
    const container = document.getElementById('cart-page-content');
    
    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart"><p>Tu carrito está vacío</p></div>';
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    let html = '<div class="cart-full">';
    
    cart.forEach(item => {
        html += `
            <div class="cart-full-item">
                <img src="${item.imagen}" alt="${item.nombre}" class="cart-full-image">
                <div class="cart-full-details">
                    <h3>${item.nombre}</h3>
                    <p>${item.marca}</p>
                    <p class="price">$${item.precio}</p>
                </div>
                <div class="cart-full-controls">
                    <div class="quantity-full">
                        <button onclick="updateCartQuantity(${item.id}, ${item.cantidad - 1})">−</button>
                        <span>${item.cantidad}</span>
                        <button onclick="updateCartQuantity(${item.id}, ${item.cantidad + 1})">+</button>
                    </div>
                    <button class="btn-remove" onclick="removeFromCart(${item.id})">Eliminar</button>
                    <div class="subtotal">$${(item.precio * item.cantidad).toFixed(2)}</div>
                </div>
            </div>
        `;
    });

    html += `
        <div class="cart-summary">
            <div class="summary-line">
                <span>Total:</span>
                <span class="total-amount">$${total.toFixed(2)}</span>
            </div>
            <button class="btn-primary btn-checkout">Proceder al Pago</button>
        </div>
    </div>`;

    container.innerHTML = html;
}

// ==========================================
// UTILIDADES
// ==========================================

function toggleCartPanel() {
    const panel = document.getElementById('cart-panel');
    panel.classList.toggle('active');
}

function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    menuOpen = !menuOpen;
    sidebar.classList.toggle('open');
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}