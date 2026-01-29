/* ========================================
   🍽️ Chef Restaurant - Admin Dashboard
   ======================================== */

// Auth Check
if (localStorage.getItem('adminAuth') !== 'true') location.href = 'index.html';

// Default Menu
const defaultMenu = [
    { id: 1, name: 'برجر كلاسيك', price: 35, cat: 'burger', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', desc: 'برجر لحم مع جبنة' },
    { id: 2, name: 'برجر دجاج', price: 30, cat: 'burger', img: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400', desc: 'برجر دجاج مقرمش' },
    { id: 3, name: 'برجر مزدوج', price: 50, cat: 'burger', img: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400', desc: 'طبقتان لحم' },
    { id: 4, name: 'بيتزا مارجريتا', price: 45, cat: 'pizza', img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', desc: 'طماطم وموزاريلا' },
    { id: 5, name: 'بيتزا بيبروني', price: 55, cat: 'pizza', img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', desc: 'بيبروني حار' },
    { id: 6, name: 'بيتزا خضار', price: 40, cat: 'pizza', img: 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=400', desc: 'خضروات طازجة' },
    { id: 7, name: 'دجاج مقلي', price: 40, cat: 'chicken', img: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400', desc: '8 قطع مقرمش' },
    { id: 8, name: 'أجنحة حارة', price: 35, cat: 'chicken', img: 'https://images.unsplash.com/photo-1608039829572-9b0189c96a58?w=400', desc: 'صلصة حارة' },
    { id: 9, name: 'شاورما دجاج', price: 25, cat: 'chicken', img: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', desc: 'مع الثومية' },
    { id: 10, name: 'عصير برتقال', price: 12, cat: 'drinks', img: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', desc: 'طازج' },
    { id: 11, name: 'كولا', price: 8, cat: 'drinks', img: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400', desc: 'بارد' },
    { id: 12, name: 'موهيتو', price: 15, cat: 'drinks', img: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400', desc: 'نعناع وليمون' },
];

// State
let menu = JSON.parse(localStorage.getItem('menu')) || defaultMenu;
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// Helpers
const $ = id => document.getElementById(id);
const catNames = { burger: 'برجر', pizza: 'بيتزا', chicken: 'دجاج', drinks: 'مشروبات' };

// Navigation
function showSection(name) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    $(name + 'Section').classList.add('active');
    event.currentTarget.classList.add('active');
    
    const titles = { dashboard: 'لوحة التحكم', orders: 'الطلبات', menu: 'القائمة', settings: 'الإعدادات' };
    $('pageTitle').textContent = titles[name];
    
    if (name === 'dashboard') loadDashboard();
    if (name === 'orders') loadOrders();
    if (name === 'menu') loadMenu();
}

// Dashboard
function loadDashboard() {
    orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    const total = orders.length;
    const revenue = orders.filter(o => o.status !== 'ملغي').reduce((s, o) => s + o.total, 0);
    const pending = orders.filter(o => o.status === 'جديد' || o.status === 'قيد_التحضير').length;
    const completed = orders.filter(o => o.status === 'تم_التوصيل').length;
    
    $('totalOrders').textContent = total;
    $('revenue').textContent = revenue.toLocaleString() + ' ر.س';
    $('pending').textContent = pending;
    $('completed').textContent = completed;
    
    // Recent Orders
    $('recentOrders').innerHTML = orders.slice(0, 5).map(o => `
        <div class="order-card" onclick="viewOrder(${o.id})">
            <div class="info">
                <h4>${o.customer.name}</h4>
                <p>${o.date}</p>
            </div>
            <div>
                <div class="price">${o.total} ر.س</div>
                <span class="status status-${o.status}">${o.status.replace('_', ' ')}</span>
            </div>
        </div>
    `).join('') || '<p style="text-align:center;color:#9ca3af;padding:2rem">لا توجد طلبات</p>';
    
    // Update badge
    const newCount = orders.filter(o => o.status === 'جديد').length;
    const badge = $('notifBadge');
    badge.textContent = newCount;
    badge.classList.toggle('show', newCount > 0);
}

// Orders
function loadOrders() {
    orders = JSON.parse(localStorage.getItem('orders')) || [];
    filterOrders();
}

function filterOrders() {
    const status = $('statusFilter').value;
    const search = $('searchOrder').value.toLowerCase();
    
    let filtered = orders;
    if (status !== 'all') filtered = filtered.filter(o => o.status === status);
    if (search) filtered = filtered.filter(o => o.customer.name.includes(search) || o.customer.phone.includes(search));
    
    $('ordersTable').innerHTML = filtered.length ? `
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>العميل</th>
                    <th>الهاتف</th>
                    <th>المبلغ</th>
                    <th>الحالة</th>
                    <th>التاريخ</th>
                    <th>إجراءات</th>
                </tr>
            </thead>
            <tbody>
                ${filtered.map(o => `
                    <tr>
                        <td><strong>${o.id.toString().slice(-4)}</strong></td>
                        <td>${o.customer.name}</td>
                        <td>${o.customer.phone}</td>
                        <td><strong style="color:#f97316">${o.total} ر.س</strong></td>
                        <td>
                            <select onchange="updateStatus(${o.id}, this.value)" class="status status-${o.status}" style="border:0;cursor:pointer">
                                <option value="جديد" ${o.status === 'جديد' ? 'selected' : ''}>جديد</option>
                                <option value="قيد_التحضير" ${o.status === 'قيد_التحضير' ? 'selected' : ''}>قيد التحضير</option>
                                <option value="جاهز" ${o.status === 'جاهز' ? 'selected' : ''}>جاهز</option>
                                <option value="تم_التوصيل" ${o.status === 'تم_التوصيل' ? 'selected' : ''}>تم التوصيل</option>
                                <option value="ملغي" ${o.status === 'ملغي' ? 'selected' : ''}>ملغي</option>
                            </select>
                        </td>
                        <td style="font-size:0.8rem;color:#6b7280">${o.date}</td>
                        <td class="actions">
                            <button onclick="viewOrder(${o.id})" class="view" title="عرض"><i class="fas fa-eye"></i></button>
                            <button onclick="deleteOrder(${o.id})" class="delete" title="حذف"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    ` : '<p style="text-align:center;color:#9ca3af;padding:3rem">لا توجد طلبات</p>';
}

function updateStatus(id, status) {
    const order = orders.find(o => o.id === id);
    if (order) {
        order.status = status;
        localStorage.setItem('orders', JSON.stringify(orders));
        toast('تم تحديث الحالة');
        filterOrders();
    }
}

function viewOrder(id) {
    const o = orders.find(x => x.id === id);
    if (!o) return;
    
    $('orderDetails').innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
            <div style="background:#f3f4f6;padding:1rem;border-radius:10px">
                <h4 style="margin-bottom:0.5rem"><i class="fas fa-user" style="color:#f97316"></i> العميل</h4>
                <p><strong>الاسم:</strong> ${o.customer.name}</p>
                <p><strong>الهاتف:</strong> ${o.customer.phone}</p>
                <p><strong>العنوان:</strong> ${o.customer.address}</p>
            </div>
            <div style="background:#f3f4f6;padding:1rem;border-radius:10px">
                <h4 style="margin-bottom:0.5rem"><i class="fas fa-info-circle" style="color:#f97316"></i> الطلب</h4>
                <p><strong>رقم:</strong> #${o.id.toString().slice(-4)}</p>
                <p><strong>التاريخ:</strong> ${o.date}</p>
                <p><strong>الحالة:</strong> <span class="status status-${o.status}">${o.status.replace('_', ' ')}</span></p>
            </div>
        </div>
        ${o.notes ? `<div style="background:#fef3c7;padding:1rem;border-radius:10px;margin-bottom:1rem"><strong>ملاحظات:</strong> ${o.notes}</div>` : ''}
        <table style="margin-bottom:1rem">
            <thead><tr><th>الصنف</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr></thead>
            <tbody>
                ${o.items.map(i => `<tr><td>${i.name}</td><td>${i.qty}</td><td>${i.price}</td><td><strong>${i.price * i.qty} ر.س</strong></td></tr>`).join('')}
            </tbody>
            <tfoot><tr style="background:#fff7ed"><td colspan="3"><strong>الإجمالي</strong></td><td><strong style="color:#f97316;font-size:1.1rem">${o.total} ر.س</strong></td></tr></tfoot>
        </table>
        <div style="display:flex;gap:0.5rem">
            <button onclick="printOrder(${o.id})" class="btn btn-primary" style="flex:1"><i class="fas fa-print"></i> طباعة</button>
            <button onclick="deleteOrder(${o.id});closeModal('orderModal')" class="btn btn-danger"><i class="fas fa-trash"></i></button>
        </div>
    `;
    $('orderModal').classList.add('show');
}

function deleteOrder(id) {
    if (confirm('حذف هذا الطلب؟')) {
        orders = orders.filter(o => o.id !== id);
        localStorage.setItem('orders', JSON.stringify(orders));
        loadDashboard();
        filterOrders();
        toast('تم الحذف');
    }
}

function printOrder(id) {
    const o = orders.find(x => x.id === id);
    if (!o) return;
    const w = window.open('', '_blank');
    w.document.write(`
        <!DOCTYPE html><html dir="rtl"><head><title>طلب #${o.id.toString().slice(-4)}</title>
        <style>body{font-family:Arial;padding:20px}table{width:100%;border-collapse:collapse;margin:15px 0}th,td{border:1px solid #ddd;padding:8px;text-align:right}th{background:#f5f5f5}h1{color:#f97316}</style></head>
        <body><h1>🍽️ مطعم الشيف</h1><hr>
        <p><strong>رقم الطلب:</strong> #${o.id.toString().slice(-4)}</p>
        <p><strong>التاريخ:</strong> ${o.date}</p>
        <p><strong>العميل:</strong> ${o.customer.name} - ${o.customer.phone}</p>
        <p><strong>العنوان:</strong> ${o.customer.address}</p>
        <table><tr><th>الصنف</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr>
        ${o.items.map(i => `<tr><td>${i.name}</td><td>${i.qty}</td><td>${i.price}</td><td>${i.price * i.qty} ر.س</td></tr>`).join('')}
        </table><h2>الإجمالي: ${o.total} ر.س</h2><hr><p style="text-align:center">شكراً لاختياركم مطعم الشيف!</p></body></html>
    `);
    w.document.close();
    w.print();
}

// Menu
function loadMenu() {
    menu = JSON.parse(localStorage.getItem('menu')) || defaultMenu;
    $('menuList').innerHTML = menu.map(i => `
        <div class="menu-item">
            <img src="${i.img}" alt="${i.name}">
            <div class="content">
                <div class="top">
                    <h4>${i.name}</h4>
                    <span class="price">${i.price} ر.س</span>
                </div>
                <p class="cat"><i class="fas fa-tag"></i> ${catNames[i.cat]}</p>
                <button onclick="deleteItem(${i.id})" class="del-btn"><i class="fas fa-trash"></i> حذف</button>
            </div>
        </div>
    `).join('');
}

function showAddItem() { $('addItemModal').classList.add('show'); }

function addItem(e) {
    e.preventDefault();
    menu.push({
        id: Date.now(),
        name: $('itemName').value,
        price: parseInt($('itemPrice').value),
        cat: $('itemCat').value,
        img: $('itemImg').value,
        desc: $('itemDesc').value
    });
    localStorage.setItem('menu', JSON.stringify(menu));
    closeModal('addItemModal');
    e.target.reset();
    loadMenu();
    toast('تمت الإضافة');
}

function deleteItem(id) {
    if (confirm('حذف هذا الصنف؟')) {
        menu = menu.filter(i => i.id !== id);
        localStorage.setItem('menu', JSON.stringify(menu));
        loadMenu();
        toast('تم الحذف');
    }
}

// Settings
function changeCode(e) {
    e.preventDefault();
    const current = $('currentCode').value;
    const newCode = $('newCode').value;
    const confirm = $('confirmCode').value;
    const saved = localStorage.getItem('adminCode') || '1234';
    
    if (current !== saved) return toast('الرمز الحالي خاطئ', 'error');
    if (newCode !== confirm) return toast('الرمز غير متطابق', 'error');
    if (newCode.length < 4) return toast('الرمز قصير جداً', 'error');
    
    localStorage.setItem('adminCode', newCode);
    toast('تم تغيير الرمز');
    e.target.reset();
}

function saveInfo(e) {
    e.preventDefault();
    localStorage.setItem('restaurantInfo', JSON.stringify({
        name: $('resName').value,
        phone: $('resPhone').value,
        address: $('resAddress').value
    }));
    toast('تم الحفظ');
}

function clearOrders() {
    if (confirm('⚠️ حذف جميع الطلبات؟')) {
        localStorage.removeItem('orders');
        orders = [];
        loadDashboard();
        toast('تم الحذف');
    }
}

function resetAll() {
    if (confirm('⚠️ إعادة ضبط كل شيء؟\n\nسيتم حذف جميع البيانات!')) {
        localStorage.clear();
        localStorage.setItem('adminAuth', 'true');
        toast('تم إعادة الضبط');
        setTimeout(() => location.reload(), 1000);
    }
}

// Helpers
function closeModal(id) { $(id).classList.remove('show'); }
function logout() { localStorage.removeItem('adminAuth'); location.href = 'index.html'; }

function toast(msg, type = 'success') {
    const t = $('toast');
    t.className = 'toast show ' + (type === 'error' ? 'error' : '');
    $('toastMsg').textContent = msg;
    setTimeout(() => t.classList.remove('show'), 3000);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    
    // Load saved info
    const info = JSON.parse(localStorage.getItem('restaurantInfo'));
    if (info) {
        $('resName').value = info.name || '';
        $('resPhone').value = info.phone || '';
        $('resAddress').value = info.address || '';
    }
});

// Close modals on escape
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeModal('orderModal');
        closeModal('addItemModal');
    }
});

// Close dropdowns on outside click
document.addEventListener('click', e => {
    if (!e.target.closest('.notif-btn')) {
        // Close notifications if open
    }
});
