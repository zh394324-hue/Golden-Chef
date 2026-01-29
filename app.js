/* ========================================
   🍽️ Chef Restaurant - Main App
   ======================================== */

// Data
const defaultMenu = [
    { id: 1, name: 'برجر كلاسيك', price: 35, cat: 'burger', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', desc: 'برجر لحم مع جبنة وخضروات' },
    { id: 2, name: 'برجر دجاج', price: 30, cat: 'burger', img: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400', desc: 'برجر دجاج مقرمش' },
    { id: 3, name: 'برجر مزدوج', price: 50, cat: 'burger', img: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400', desc: 'طبقتان لحم مع جبنة' },
    { id: 4, name: 'بيتزا مارجريتا', price: 45, cat: 'pizza', img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', desc: 'طماطم وموزاريلا وريحان' },
    { id: 5, name: 'بيتزا بيبروني', price: 55, cat: 'pizza', img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', desc: 'بيبروني حار مع جبنة' },
    { id: 6, name: 'بيتزا خضار', price: 40, cat: 'pizza', img: 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=400', desc: 'تشكيلة خضروات طازجة' },
    { id: 7, name: 'دجاج مقلي', price: 40, cat: 'chicken', img: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400', desc: '8 قطع دجاج مقرمش' },
    { id: 8, name: 'أجنحة حارة', price: 35, cat: 'chicken', img: 'https://images.unsplash.com/photo-1608039829572-9b0189c96a58?w=400', desc: 'أجنحة بالصلصة الحارة' },
    { id: 9, name: 'شاورما دجاج', price: 25, cat: 'chicken', img: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', desc: 'شاورما مع الثومية' },
    { id: 10, name: 'عصير برتقال', price: 12, cat: 'drinks', img: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', desc: 'طبيعي طازج' },
    { id: 11, name: 'كولا', price: 8, cat: 'drinks', img: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400', desc: 'مشروب غازي بارد' },
    { id: 12, name: 'موهيتو', price: 15, cat: 'drinks', img: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400', desc: 'نعناع وليمون منعش' },
];

// State
let menu = JSON.parse(localStorage.getItem('menu')) || defaultMenu;
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const $ = id => document.getElementById(id);

// Render Menu
function renderMenu(cat = 'all') {
    const items = cat === 'all' ? menu : menu.filter(i => i.cat === cat);
    $('menuGrid').innerHTML = items.map(i => `
        <div class="menu-card">
            <img src="${i.img}" alt="${i.name}" loading="lazy">
            <div class="content">
                <div class="top">
                    <h3>${i.name}</h3>
                    <span class="price">${i.price} ر.س</span>
                </div>
                <p class="desc">${i.desc}</p>
                <button class="add-btn" onclick="addToCart(${i.id})">
                    <i class="fas fa-plus"></i> أضف للسلة
                </button>
            </div>
        </div>
    `).join('');
}

// Filter Menu
function filterMenu(cat) {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderMenu(cat);
}

// Cart Functions
function addToCart(id) {
    const item = menu.find(i => i.id === id);
    const exists = cart.find(i => i.id === id);
    exists ? exists.qty++ : cart.push({...item, qty: 1});
    saveCart();
    toast('تمت الإضافة ✓');
}

function updateQty(id, d) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += d;
        if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
        saveCart();
    }
}

function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function renderCart() {
    const count = cart.reduce((s, i) => s + i.qty, 0);
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    
    $('cartCount').textContent = count;
    $('cartTotal').textContent = total + ' ر.س';
    
    $('cartItems').innerHTML = cart.length ? cart.map(i => `
        <div class="cart-item">
            <img src="${i.img}" alt="${i.name}">
            <div class="info">
                <h4>${i.name}</h4>
                <span class="price">${i.price} ر.س</span>
                <div class="qty-controls">
                    <button class="qty-btn minus" onclick="updateQty(${i.id},-1)">−</button>
                    <span>${i.qty}</span>
                    <button class="qty-btn plus" onclick="updateQty(${i.id},1)">+</button>
                </div>
            </div>
            <button class="delete-btn" onclick="removeItem(${i.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('') : `
        <div class="cart-empty">
            <i class="fas fa-shopping-cart"></i>
            <p>السلة فارغة</p>
        </div>
    `;
}

function toggleCart() {
    $('cartSidebar').classList.toggle('open');
    $('cartOverlay').classList.toggle('show');
}

// Checkout
function checkout() {
    if (!cart.length) return toast('السلة فارغة!', 'error');
    toggleCart();
    $('checkoutModal').classList.add('show');
}

function closeCheckout() {
    $('checkoutModal').classList.remove('show');
}

function submitOrder(e) {
    e.preventDefault();
    
    const order = {
        id: Date.now(),
        customer: {
            name: $('cName').value,
            phone: $('cPhone').value,
            address: $('cAddress').value
        },
        notes: $('cNotes').value,
        items: [...cart],
        total: cart.reduce((s, i) => s + i.price * i.qty, 0),
        status: 'جديد',
        date: new Date().toLocaleString('ar-EG')
    };

    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.unshift(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    cart = [];
    saveCart();
    e.target.reset();
    closeCheckout();
    toast('تم إرسال طلبك بنجاح! 🎉');
}

// Admin
function showAdmin() {
    $('adminModal').classList.add('show');
}

function closeAdmin() {
    $('adminModal').classList.remove('show');
    $('adminCode').value = '';
}

function adminLogin(e) {
    e.preventDefault();
    const code = localStorage.getItem('adminCode') || '1234';
    if ($('adminCode').value === code) {
        localStorage.setItem('adminAuth', 'true');
        location.href = 'admin.html';
    } else {
        toast('رمز خاطئ!', 'error');
        $('adminCode').value = '';
    }
}

// Toast
function toast(msg, type = 'success') {
    const t = $('toast');
    t.className = 'toast show ' + (type === 'error' ? 'error' : '');
    $('toastMsg').textContent = msg;
    setTimeout(() => t.classList.remove('show'), 3000);
}

// Smooth Scroll
function scrollTo(id) {
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    menu = JSON.parse(localStorage.getItem('menu')) || defaultMenu;
    renderMenu();
    renderCart();
    
    // Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeCheckout();
            closeAdmin();
            if ($('cartSidebar').classList.contains('open')) toggleCart();
        }
    });
});

// Navbar scroll
window.addEventListener('scroll', () => {
    document.querySelector('.navbar').style.boxShadow = 
        window.scrollY > 50 ? '0 4px 20px rgba(0,0,0,0.15)' : '0 4px 20px rgba(0,0,0,0.1)';
});
