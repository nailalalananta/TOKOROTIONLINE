const products = [
    {id:1,name:'Croissant Butter',cat:'Pastry',price:18000,emoji:'🥐',rating:4.9,sold:320,tag:'Best Seller',desc:'Pastry renyah dan lembut.'},
    {id:2,name:'Roti Cokelat Lumer',cat:'Roti Manis',price:12000,emoji:'🍫',rating:4.8,sold:290,tag:'Favorit',desc:'Roti dengan isian cokelat.'},
    {id:3,name:'Donat Glaze',cat:'Donat',price:10000,emoji:'🍩',rating:4.8,sold:260,tag:'Populer',desc:'Donat lembut dengan glaze.'},
    {id:4,name:'Cinnamon Roll',cat:'Pastry',price:22000,emoji:'🥮',rating:4.9,sold:180,tag:'Fresh',desc:'Gulungan kayu manis.'},
    {id:5,name:'Roti Keju',cat:'Roti Manis',price:14000,emoji:'🧀',rating:4.7,sold:210,tag:'',desc:'Roti lembut dengan keju.'},
    {id:6,name:'Strawberry Danish',cat:'Pastry',price:24000,emoji:'🍓',rating:4.9,sold:150,tag:'New',desc:'Danish dengan strawberry.'},
    {id:7,name:'Brownies Fudgy',cat:'Kue',price:35000,emoji:'🍰',rating:4.9,sold:170,tag:'Best Seller',desc:'Brownies cokelat fudgy.'},
    {id:8,name:'Roti Tawar Milk',cat:'Roti Tawar',price:26000,emoji:'🍞',rating:4.7,sold:140,tag:'',desc:'Roti tawar susu lembut.'},
    {id:9,name:'Bomboloni Vanilla',cat:'Donat',price:15000,emoji:'🍩',rating:4.8,sold:120,tag:'',desc:'Donat isi krim vanilla.'},
    {id:10,name:'Banana Cake',cat:'Kue',price:28000,emoji:'🍌',rating:4.6,sold:95,tag:'',desc:'Cake pisang moist.'},
    {id:11,name:'Garlic Bread',cat:'Roti Gurih',price:16000,emoji:'🥖',rating:4.7,sold:110,tag:'',desc:'Roti dengan garlic butter.'},
    {id:12,name:'Sourdough Loaf',cat:'Roti Tawar',price:39000,emoji:'🥖',rating:4.8,sold:80,tag:'Premium',desc:'Roti fermentasi alami.'}
];

const categories = [
    ['Semua','🛍️'],
    ['Roti Manis','🍞'],
    ['Pastry','🥐'],
    ['Donat','🍩'],
    ['Kue','🍰'],
    ['Roti Gurih','🥖'],
    ['Roti Tawar','🍞']
];

const money = n => 'Rp' + Number(n).toLocaleString('id-ID');

function read(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem('sb_' + key)) ?? fallback;
    } catch {
        return fallback;
    }
}

let cart = read('cart', []);
let wish = read('wish', []);
let orders = read('orders', []);
let currentUser = read('user', null);
let activeCat = 'Semua';
let query = '';

function save() {
    localStorage.setItem('sb_cart', JSON.stringify(cart));
    localStorage.setItem('sb_wish', JSON.stringify(wish));
    localStorage.setItem('sb_orders', JSON.stringify(orders));
    localStorage.setItem('sb_user', JSON.stringify(currentUser));
    updateCount();
}

function updateCount() {
    document.getElementById('cartCount').textContent =
        cart.reduce((sum, item) => sum + item.qty, 0);
}

function toast(message) {
    const el = document.getElementById('toast');
    el.textContent = message;
    el.classList.add('show');

    setTimeout(() => {
        el.classList.remove('show');
    }, 2200);
}

function renderCats() {
    document.getElementById('categoryList').innerHTML =
        categories.map(([name, emoji]) => `
            <button class="cat ${activeCat === name ? 'active' : ''}"
                data-cat="${name}">
                <span class="emoji">${emoji}</span>
                <b>${name}</b>
                <br>
                <small>${name === 'Semua' ? 'Semua produk' :
                    products.filter(p => p.cat === name).length + ' produk'}</small>
            </button>
        `).join('');
}

function renderProducts() {
    let list = products.filter(p =>
        (activeCat === 'Semua' || p.cat === activeCat) &&
        (p.name.toLowerCase().includes(query) ||
         p.cat.toLowerCase().includes(query))
    );

    const sort = document.getElementById('sortSelect').value;

    if (sort === 'low') list.sort((a,b) => a.price-b.price);
    if (sort === 'high') list.sort((a,b) => b.price-a.price);
    if (sort === 'name') list.sort((a,b) => a.name.localeCompare(b.name));
    if (sort === 'popular') list.sort((a,b) => b.sold-a.sold);

    document.getElementById('productGrid').innerHTML =
        list.length ? list.map(p => `
            <article class="product">
                <div class="product-art">
                    <span>${p.emoji}</span>
                    ${p.tag ? `<span class="tag">${p.tag}</span>` : ''}
                    <button class="heart" data-wish="${p.id}">
                        ${wish.includes(p.id) ? '♥' : '♡'}
                    </button>
                </div>

                <div class="product-info">
                    <h3>${p.name}</h3>
                    <div class="desc">${p.desc}</div>
                    <div class="rating">★ ${p.rating} · ${p.sold} terjual</div>

                    <div class="price-row">
                        <span class="price">${money(p.price)}</span>
                        <button class="add" data-add="${p.id}">
                            + Keranjang
                        </button>
                    </div>

                    <button class="text-btn" data-detail="${p.id}">
                        Lihat detail →
                    </button>
                </div>
            </article>
        `).join('') :
        '<div class="empty">Produk tidak ditemukan.</div>';
}

function openDrawer(title, html) {
    document.getElementById('drawerTitle').textContent = title;
    document.getElementById('drawerContent').innerHTML = html;
    document.getElementById('drawerOverlay').classList.add('show');
}

function closeDrawer() {
    document.getElementById('drawerOverlay').classList.remove('show');
}

function modal(html) {
    document.getElementById('modalContent').innerHTML = html;
    document.getElementById('modalBack').classList.add('show');
}

function closeModal() {
    document.getElementById('modalBack').classList.remove('show');
}

function addCart(id) {
    let item = cart.find(c => c.id === id);

    if (item) {
        item.qty++;
    } else {
        cart.push({id, qty:1});
    }

    save();
    toast('Produk ditambahkan ke keranjang!');
}

function cartView() {
    if (!cart.length) {
        openDrawer('Keranjang Belanja',
            '<div class="empty"><h3>Keranjang masih kosong</h3>Yuk pilih roti favoritmu!</div>');
        return;
    }

    const subtotal = cart.reduce((sum,c) =>
        sum + products.find(p => p.id === c.id).price * c.qty, 0);

    openDrawer('Keranjang Belanja', `
        ${cart.map(c => {
            const p = products.find(x => x.id === c.id);

            return `
                <div class="cart-line">
                    <div class="mini-art">${p.emoji}</div>
                    <div>
                        <b>${p.name}</b>
                        <div class="muted">${money(p.price)}</div>
                        <div class="qty">
                            <button data-qty="${p.id}" data-delta="-1">−</button>
                            ${c.qty}
                            <button data-qty="${p.id}" data-delta="1">+</button>
                        </div>
                    </div>
                    <button class="close" data-remove="${p.id}">✕</button>
                </div>
            `;
        }).join('')}

        <div class="total">
            <span>Subtotal</span>
            <span>${money(subtotal)}</span>
        </div>

        <button class="wide" id="checkoutBtn">
            Lanjut ke Checkout →
        </button>
    `);
}

function checkoutView() {
    if (!cart.length) return;

    const subtotal = cart.reduce((sum,c) =>
        sum + products.find(p => p.id === c.id).price * c.qty, 0);

    closeDrawer();

    modal(`
        <h2>Checkout Pesanan</h2>

        <form id="checkoutForm">
            <div class="field">
                <label>Nama penerima</label>
                <input name="name" required value="${currentUser?.name || ''}">
            </div>

            <div class="field">
                <label>Nomor WhatsApp</label>
                <input name="phone" required type="tel">
            </div>

            <div class="field">
                <label>Alamat lengkap</label>
                <textarea name="address" required></textarea>
            </div>

            <div class="field">
                <label>Catatan pesanan</label>
                <input name="note">
            </div>

            <div class="field">
                <label>Metode pengiriman</label>
                <select name="shipping">
                    <option value="10000">Reguler - Rp10.000</option>
                    <option value="18000">Express - Rp18.000</option>
                    <option value="0">Ambil di toko - Gratis</option>
                </select>
            </div>

            <div class="field">
                <label>Metode pembayaran (demo)</label>
                <select name="payment">
                    <option>COD</option>
                    <option>Transfer bank (simulasi)</option>
                    <option>QRIS (simulasi)</option>
                </select>
            </div>

            <div class="total">
                <span>Subtotal</span>
                <b>${money(subtotal)}</b>
            </div>

            <button class="wide">Buat Pesanan</button>
        </form>
    `);

    document.getElementById('checkoutForm').addEventListener('submit', e => {
        e.preventDefault();

        const data = new FormData(e.target);
        const shipping = Number(data.get('shipping'));

        const order = {
            id: 'SB' + Date.now().toString().slice(-8),
            date: new Date().toLocaleString('id-ID'),
            items: [...cart],
            subtotal,
            shipping,
            total: subtotal + shipping,
            name: data.get('name'),
            phone: data.get('phone'),
            address: data.get('address'),
            note: data.get('note'),
            payment: data.get('payment'),
            status: 'Menunggu konfirmasi'
        };

        orders.unshift(order);
        cart = [];

        currentUser = {
            name: order.name,
            phone: order.phone
        };

        save();
        closeModal();
        toast('Pesanan demo berhasil dibuat!');
        showOrder(order.id);
    });
}

function showOrder(id) {
    const order = orders.find(o => o.id === id);

    if (!order) return;

    openDrawer('Detail Pesanan', `
        <div class="order-card">
            <b>Pesanan #${order.id}</b>
            <p class="muted">${order.date}</p>
            <span class="status">${order.status}</span>

            <hr>

            <b>Produk</b>

            ${order.items.map(c => {
                const p = products.find(x => x.id === c.id);

                return `<p>${p.name} × ${c.qty}</p>`;
            }).join('')}

            <p class="muted">
                Penerima: ${order.name}<br>
                Telepon: ${order.phone}<br>
                Alamat: ${order.address}
            </p>

            <div class="total">
                <span>Total</span>
                <b>${money(order.total)}</b>
            </div>
        </div>

        <p class="muted">Ini adalah simulasi pesanan.</p>
    `);
}

function ordersView() {
    openDrawer('Pesanan Saya',
        orders.length ? orders.map(o => `
            <div class="order-card">
                <b>#${o.id}</b>
                <p class="muted">${o.date}</p>
                <span class="status">${o.status}</span>
                <div class="total">
                    <span>Total</span>
                    <b>${money(o.total)}</b>
                </div>
                <button class="secondary-btn" data-order="${o.id}">
                    Lihat detail
                </button>
            </div>
        `).join('') : '<div class="empty">Belum ada pesanan.</div>'
    );
}

function accountView() {
    modal(currentUser ? `
        <h2>Akun Saya</h2>
        <p>Halo, ${currentUser.name}!</p>
        <p class="muted">${currentUser.phone || ''}</p>
        <button class="wide" id="myOrders">Lihat Pesanan</button>
        <button class="secondary-btn" id="logoutBtn">Keluar</button>
    ` : `
        <h2>Masuk / Daftar</h2>
        <form id="loginForm">
            <div class="field">
                <label>Nama</label>
                <input name="name" required>
            </div>
            <div class="field">
                <label>Nomor HP</label>
                <input name="phone" required>
            </div>
            <button class="wide">Simpan Profil</button>
        </form>
    `);
}

function adminView() {
    const revenue = orders.reduce((sum,o) => sum + o.total, 0);

    openDrawer('Dashboard Admin', `
        <div class="admin-grid">
            <div class="admin-stat">
                Total pesanan
                <h2>${orders.length}</h2>
            </div>
            <div class="admin-stat">
                Total penjualan
                <h2>${money(revenue)}</h2>
            </div>
        </div>

        <h3>Pesanan masuk</h3>

        ${orders.map(o => `
            <div class="order-card">
                <b>#${o.id} · ${o.name}</b>
                <p>${money(o.total)}</p>

                <select data-status="${o.id}">
                    ${['Menunggu konfirmasi','Diproses','Dikemas','Dalam pengiriman','Selesai','Dibatalkan']
                    .map(s => `<option ${s === o.status ? 'selected' : ''}>${s}</option>`).join('')}
                </select>
            </div>
        `).join('')}

        <h3>Tambah Produk</h3>

        <form id="newProduct">
            <div class="field">
                <label>Nama produk</label>
                <input name="name" required>
            </div>

            <div class="field">
                <label>Harga</label>
                <input name="price" type="number" required>
            </div>

            <div class="field">
                <label>Kategori</label>
                <select name="cat">
                    <option>Roti Manis</option>
                    <option>Pastry</option>
                    <option>Donat</option>
                    <option>Kue</option>
                    <option>Roti Gurih</option>
                    <option>Roti Tawar</option>
                </select>
            </div>

            <button class="wide">Tambah Produk</button>
        </form>
    `);
}

document.addEventListener('click', e => {
    const t = e.target.closest('button,a');

    if (!t) return;

    if (t.dataset.scroll) {
        document.getElementById(t.dataset.scroll)
            .scrollIntoView({behavior:'smooth'});
    }

    if (t.dataset.cat) {
        activeCat = t.dataset.cat;
        renderCats();
        renderProducts();
    }

    if (t.dataset.add) addCart(Number(t.dataset.add));

    if (t.dataset.wish) {
        const id = Number(t.dataset.wish);

        wish = wish.includes(id)
            ? wish.filter(x => x !== id)
            : [...wish, id];

        save();
        renderProducts();
    }

    if (t.dataset.detail) {
        const p = products.find(x => x.id === Number(t.dataset.detail));

        modal(`
            <div class="detail-art">${p.emoji}</div>
            <h2>${p.name}</h2>
            <p>${p.desc}</p>
            <h3 class="price">${money(p.price)}</h3>
            <button class="wide" id="detailAdd" data-id="${p.id}">
                Tambahkan ke Keranjang
            </button>
        `);
    }

    if (t.id === 'detailAdd') {
        addCart(Number(t.dataset.id));
        closeModal();
    }

    if (t.id === 'cartBtn') cartView();
    if (t.id === 'closeDrawer') closeDrawer();
    if (t.id === 'checkoutBtn') checkoutView();
    if (t.id === 'accountBtn') accountView();
    if (t.id === 'ordersBtn' || t.id === 'trackNav') ordersView();
    if (t.id === 'adminNav') adminView();

    if (t.dataset.qty) {
        const item = cart.find(x => x.id === Number(t.dataset.qty));

        item.qty += Number(t.dataset.delta);

        if (item.qty <= 0) {
            cart = cart.filter(x => x !== item);
        }

        save();
        cartView();
    }

    if (t.dataset.remove) {
        cart = cart.filter(x => x.id !== Number(t.dataset.remove));
        save();
        cartView();
    }

    if (t.dataset.order) showOrder(t.dataset.order);

    if (t.id === 'myOrders') {
        closeModal();
        ordersView();
    }

    if (t.id === 'logoutBtn') {
        currentUser = null;
        save();
        closeModal();
    }
});

document.getElementById('searchForm').addEventListener('submit', e => {
    e.preventDefault();

    query = document.getElementById('searchInput')
        .value.toLowerCase().trim();

    renderProducts();
});

document.getElementById('sortSelect')
    .addEventListener('change', renderProducts);

document.getElementById('modalBack').addEventListener('click', e => {
    if (e.target.id === 'modalBack') closeModal();
});

document.getElementById('drawerOverlay').addEventListener('click', e => {
    if (e.target.id === 'drawerOverlay') closeDrawer();
});

document.addEventListener('submit', e => {
    if (e.target.id === 'loginForm') {
        e.preventDefault();

        const data = new FormData(e.target);

        currentUser = {
            name: data.get('name'),
            phone: data.get('phone')
        };

        save();
        closeModal();
        toast('Profil tersimpan!');
    }

    if (e.target.id === 'newProduct') {
        e.preventDefault();

        const data = new FormData(e.target);

        products.push({
            id: Math.max(...products.map(p => p.id)) + 1,
            name: data.get('name'),
            price: Number(data.get('price')),
            cat: data.get('cat'),
            emoji: '🥯',
            rating: 5,
            sold: 0,
            tag: 'New',
            desc: 'Produk baru SweetBite Bakery.'
        });

        closeDrawer();
        renderProducts();
        toast('Produk berhasil ditambahkan!');
    }
});

document.addEventListener('change', e => {
    if (e.target.dataset.status) {
        const order = orders.find(o => o.id === e.target.dataset.status);

        order.status = e.target.value;

        save();
        toast('Status pesanan diperbarui!');
    }
});

renderCats();
renderProducts();
updateCount();