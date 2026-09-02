/**
 * MEDISTOCK - Common Architecture & Security Engine
 * Unified Design Tokens, Role-Based Navigation, Route Guards, Number Formatting
 */

// ===== AUTH & ROLE SECURITY =====
const auth = {
    getUser() {
        try { return JSON.parse(localStorage.getItem('medistock_user')); } catch { return null; }
    },
    getToken() { return localStorage.getItem('medistock_token'); },
    isLoggedIn() { return !!this.getToken(); },
    isAdmin() { return this.getUser()?.role === 'ADMIN'; },
    logout() {
        localStorage.removeItem('medistock_token');
        localStorage.removeItem('medistock_user');
        const inPages = window.location.pathname.includes('/pages/');
        window.location.href = inPages ? 'login.html' : './pages/login.html';
    },
    requireLogin() {
        if (!this.isLoggedIn()) {
            const inPages = window.location.pathname.includes('/pages/');
            window.location.href = inPages ? 'login.html' : './pages/login.html';
            return false;
        }
        return true;
    },
    guardAdminRoute() {
        if (!this.isAdmin()) {
            const container = document.querySelector('.page-content') || document.querySelector('.main-content');
            if (container) {
                container.innerHTML = `
                    <div class="access-denied-box">
                        <div class="access-denied-icon"><i class="bi bi-shield-lock-fill"></i></div>
                        <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0f172a">ACCESS DENIED</h2>
                        <p style="color:#64748b;font-size:14px;margin:0 0 20px">You don't have permission to access this section.</p>
                        <a href="dashboard.html" class="btn-primary-custom" style="text-decoration:none">
                            <i class="bi bi-arrow-left"></i> Return to Dashboard
                        </a>
                    </div>
                `;
            }
            return false;
        }
        return true;
    }
};

// ===== TOAST NOTIFICATIONS =====
const toast = {
    _container: null,
    _getContainer() {
        if (!this._container) {
            this._container = document.createElement('div');
            this._container.className = 'toast-container';
            document.body.appendChild(this._container);
        }
        return this._container;
    },
    show(message, type = 'info', duration = 3500) {
        const icons = { success: 'bi-check-circle-fill', error: 'bi-x-circle-fill', warning: 'bi-exclamation-triangle-fill', info: 'bi-info-circle-fill' };
        const container = this._getContainer();
        const toastEl = document.createElement('div');
        toastEl.className = `toast ${type}`;
        toastEl.innerHTML = `<i class="bi ${icons[type] || icons.info} toast-icon"></i><span class="toast-message">${message}</span>`;
        container.appendChild(toastEl);
        setTimeout(() => toastEl.classList.add('show'), 10);
        setTimeout(() => {
            toastEl.classList.remove('show');
            setTimeout(() => toastEl.remove(), 350);
        }, duration);
    }
};

// ===== SMART NUMBER & CURRENCY FORMATTING =====
const fmt = {
    currency(val) {
        return '₹' + parseFloat(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    compactCurrency(val) {
        const num = parseFloat(val || 0);
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
        if (num >= 1000) return `₹${(num / 1000).toFixed(1)} K`;
        return `₹${num.toFixed(2)}`;
    },
    number(val) {
        return parseInt(val || 0).toLocaleString('en-IN');
    },
    compactNumber(val) {
        const num = parseInt(val || 0);
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return `${num}`;
    },
    date(dateStr) {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    },
    datetime(dateStr) {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    },
    stockBadge(status) {
        const map = {
            'IN_STOCK':     '<span class="badge-status badge-in-stock"><i class="bi bi-circle-fill" style="font-size:6px"></i> In Stock</span>',
            'LOW_STOCK':    '<span class="badge-status badge-low-stock"><i class="bi bi-exclamation-triangle-fill" style="font-size:8px"></i> Low Stock</span>',
            'OUT_OF_STOCK': '<span class="badge-status badge-out-of-stock"><i class="bi bi-x-circle-fill" style="font-size:8px"></i> Out of Stock</span>',
        };
        return map[status] || status;
    },
    expiryBadge(status) {
        const map = {
            'VALID':         '<span class="badge-status badge-valid">Valid</span>',
            'EXPIRING_SOON': '<span class="badge-status badge-expiring-soon"><i class="bi bi-clock-fill" style="font-size:8px"></i> Expiring Soon</span>',
            'EXPIRED':       '<span class="badge-status badge-expired"><i class="bi bi-x-circle-fill" style="font-size:8px"></i> Expired</span>',
        };
        return map[status] || status;
    },
    orderStatusBadge(status) {
        const map = {
            'PENDING':   '<span class="badge-status badge-pending">Pending</span>',
            'CONFIRMED': '<span class="badge-status badge-confirmed">Confirmed</span>',
            'PREPARING': '<span class="badge-status badge-preparing">Preparing</span>',
            'COMPLETED': '<span class="badge-status badge-completed">Completed</span>',
            'CANCELLED': '<span class="badge-status badge-cancelled">Cancelled</span>',
        };
        return map[status] || status;
    }
};

// ===== SIDEBAR & TOPBAR INITIALIZATION =====
function setupSidebar() {
    const user = auth.getUser();
    if (!user) return;

    // Set user info in topnav
    const nameEl = document.getElementById('topnav-name');
    const roleEl = document.getElementById('topnav-role');
    const avatarEl = document.getElementById('topnav-avatar');
    if (nameEl) nameEl.textContent = user.name;
    if (roleEl) roleEl.textContent = user.role === 'ADMIN' ? 'Administrator' : 'Staff User';
    if (avatarEl) avatarEl.textContent = user.name?.charAt(0)?.toUpperCase() || 'U';

    // Badge counts
    updateSidebarBadges();

    // Highlight active nav item
    const path = window.location.pathname;
    document.querySelectorAll('.sidebar-item[data-page]').forEach(item => {
        const page = item.getAttribute('data-page');
        if (path.includes(page)) {
            item.classList.add('active');
        }
    });

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => auth.logout());

    // Mobile sidebar toggle
    const menuBtn = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
    }
}

async function updateSidebarBadges() {
    try {
        const res = await api.getDashboardSummary();
        if (!res?.data) return;
        const summary = res.data;
        const lowBadge = document.getElementById('badge-lowstock');
        const expBadge = document.getElementById('badge-expiry');
        if (lowBadge) {
            const count = (summary.lowStockCount || 0) + (summary.outOfStockCount || 0);
            lowBadge.textContent = count;
            lowBadge.style.display = count > 0 ? 'inline-flex' : 'none';
        }
        if (expBadge) {
            const count = (summary.expiringSoonCount || 0) + (summary.expiredCount || 0);
            expBadge.textContent = count;
            expBadge.style.display = count > 0 ? 'inline-flex' : 'none';
        }
    } catch (e) { /* ignore */ }
}

// ===== ROLE-BASED SIDEBAR HTML GENERATOR =====
function getSidebarHtml() {
    const isAdmin = auth.isAdmin();
    const prefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';

    let navHtml = `
        <div class="sidebar-section-label">Operations</div>
        <a href="${prefix}dashboard.html" class="sidebar-item" data-page="dashboard">
            <i class="bi bi-grid-1x2-fill"></i> Dashboard
        </a>
        <a href="${prefix}medicines.html" class="sidebar-item" data-page="medicines">
            <i class="bi bi-capsule"></i> Medicines
        </a>
        <a href="${prefix}inventory.html" class="sidebar-item" data-page="inventory">
            <i class="bi bi-boxes"></i> Inventory
        </a>
        <a href="${prefix}low-stock.html" class="sidebar-item" data-page="low-stock">
            <i class="bi bi-exclamation-triangle-fill"></i> Low Stock
            <span class="sidebar-badge" id="badge-lowstock" style="display:none"></span>
        </a>
        <a href="${prefix}expiry.html" class="sidebar-item" data-page="expiry">
            <i class="bi bi-calendar-x-fill"></i> Expiry Alerts
            <span class="sidebar-badge" id="badge-expiry" style="display:none"></span>
        </a>
        <a href="${prefix}orders.html" class="sidebar-item" data-page="orders">
            <i class="bi bi-cart-fill"></i> Orders
        </a>
    `;

    if (isAdmin) {
        navHtml += `
            <div class="sidebar-section-label">Administration</div>
            <a href="${prefix}suppliers.html" class="sidebar-item" data-page="suppliers">
                <i class="bi bi-truck"></i> Suppliers
            </a>
            <a href="${prefix}reports.html" class="sidebar-item" data-page="reports">
                <i class="bi bi-graph-up-arrow"></i> Reports
            </a>
            <a href="${prefix}users.html" class="sidebar-item" data-page="users">
                <i class="bi bi-people-fill"></i> Staff Management
            </a>
            <a href="${prefix}activity.html" class="sidebar-item" data-page="activity">
                <i class="bi bi-clock-history"></i> Activity
            </a>
            <a href="${prefix}settings.html" class="sidebar-item" data-page="settings">
                <i class="bi bi-gear-fill"></i> Settings
            </a>
        `;
    }

    return `
    <aside class="sidebar">
        <div class="sidebar-brand">
            <div class="sidebar-brand-icon"><i class="bi bi-capsule-pill"></i></div>
            <div class="sidebar-brand-text">
                <span class="sidebar-brand-name">MEDISTOCK</span>
                <span class="sidebar-brand-sub">${isAdmin ? 'Administrative Portal' : 'Staff Operations'}</span>
            </div>
        </div>
        <nav class="sidebar-nav">
            ${navHtml}
        </nav>
        <div class="sidebar-footer">
            <button class="sidebar-item" id="logout-btn" style="color:#f87171">
                <i class="bi bi-box-arrow-left"></i> Logout
            </button>
        </div>
    </aside>
    `;
}

function getTopnavHtml(title) {
    const user = auth.getUser();
    const roleBadge = user?.role === 'ADMIN' 
        ? '<span style="background:#dbeafe;color:#1d4ed8;font-size:11px;font-weight:700;padding:2px 8px;border-radius:6px;letter-spacing:0.5px">ADMIN</span>' 
        : '<span style="background:#dcfce7;color:#15803d;font-size:11px;font-weight:700;padding:2px 8px;border-radius:6px;letter-spacing:0.5px">STAFF</span>';

    return `
    <nav class="topnav">
        <button id="menu-toggle" class="btn-icon" style="border:none;display:none;" aria-label="Menu">
            <i class="bi bi-list" style="font-size:18px"></i>
        </button>
        <div class="topnav-title">
            <span>${title}</span>
            ${roleBadge}
        </div>
        <div class="topnav-user">
            <div class="topnav-user-avatar" id="topnav-avatar">U</div>
            <div class="topnav-user-info">
                <div class="topnav-user-name" id="topnav-name">User</div>
                <div class="topnav-user-role" id="topnav-role">Role</div>
            </div>
        </div>
    </nav>
    `;
}

function initLayout(title) {
    if (!auth.requireLogin()) return false;
    const sidebarContainer = document.getElementById('sidebar-container');
    const topnavContainer = document.getElementById('topnav-container');
    if (sidebarContainer) sidebarContainer.innerHTML = getSidebarHtml();
    if (topnavContainer) topnavContainer.innerHTML = getTopnavHtml(title);
    setupSidebar();
    return true;
}

// ===== PAGINATION HELPER =====
function renderPagination(containerId, totalPages, currentPage, onPageClickName = 'changePage') {
    const el = document.getElementById(containerId);
    if (!el) return;
    if (totalPages <= 1) {
        el.innerHTML = '';
        return;
    }

    let html = `<div class="pagination-controls">`;
    html += `<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="${onPageClickName}(${currentPage - 1})"><i class="bi bi-chevron-left"></i> Prev</button>`;

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);

    if (startPage > 1) {
        html += `<button class="page-btn" onclick="${onPageClickName}(1)">1</button>`;
        if (startPage > 2) html += `<span class="page-dots">...</span>`;
    }

    for (let p = startPage; p <= endPage; p++) {
        html += `<button class="page-btn ${p === currentPage ? 'active' : ''}" onclick="${onPageClickName}(${p})">${p}</button>`;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) html += `<span class="page-dots">...</span>`;
        html += `<button class="page-btn" onclick="${onPageClickName}(${totalPages})">${totalPages}</button>`;
    }

    html += `<button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="${onPageClickName}(${currentPage + 1})">Next <i class="bi bi-chevron-right"></i></button>`;
    html += `</div>`;

    el.innerHTML = html;
}

// ===== MODAL HELPERS =====
function openModal(id) {
    document.getElementById(id)?.classList.add('active');
}

function closeModal(id) {
    document.getElementById(id)?.classList.remove('active');
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
    }
});

// ===== EMPTY STATE HELPER =====
function showEmptyState(tableBody, message = 'No records found', icon = 'bi-inbox') {
    tableBody.innerHTML = `<tr><td colspan="100"><div class="empty-state"><i class="bi ${icon}"></i><h5>${message}</h5><p>No records match your active criteria.</p></div></td></tr>`;
}

// ===== DEBOUNCE =====
function debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}
