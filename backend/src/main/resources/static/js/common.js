/**
 * MEDISTOCK - Common Utilities
 * Shared UI helpers, toast, modal, formatting
 */

// ===== AUTH HELPERS =====
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
        window.location.href = '/pages/login.html';
    },
    requireLogin() {
        if (!this.isLoggedIn()) {
            window.location.href = '/pages/login.html';
            return false;
        }
        return true;
    },
    requireAdmin() {
        if (!this.isAdmin()) {
            toast.show('Access denied. Admin role required.', 'error');
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
            setTimeout(() => toastEl.remove(), 400);
        }, duration);
    }
};

// ===== LOADING OVERLAY =====
const loading = {
    _overlay: null,
    show() {
        if (!this._overlay) {
            this._overlay = document.createElement('div');
            this._overlay.className = 'loading-overlay';
            this._overlay.innerHTML = '<div class="spinner"></div>';
            document.body.appendChild(this._overlay);
        }
        this._overlay.style.display = 'flex';
    },
    hide() {
        if (this._overlay) this._overlay.style.display = 'none';
    }
};

// ===== FORMATTING =====
const fmt = {
    currency(val) {
        return '₹' + parseFloat(val || 0).toFixed(2);
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
    },
    number(val) {
        return parseInt(val || 0).toLocaleString('en-IN');
    }
};

// ===== SIDEBAR SETUP =====
function setupSidebar() {
    const user = auth.getUser();
    if (!user) return;

    // Set user info in topnav
    const nameEl = document.getElementById('topnav-name');
    const roleEl = document.getElementById('topnav-role');
    const avatarEl = document.getElementById('topnav-avatar');
    if (nameEl) nameEl.textContent = user.name;
    if (roleEl) roleEl.textContent = user.role;
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
        if (lowBadge && summary.lowStockCount > 0) lowBadge.textContent = summary.lowStockCount;
        if (expBadge && (summary.expiringSoonCount + summary.expiredCount) > 0) expBadge.textContent = summary.expiringSoonCount + summary.expiredCount;
    } catch (e) { /* ignore */ }
}

// ===== MODAL HELPERS =====
function openModal(id) {
    document.getElementById(id)?.classList.add('active');
}

function closeModal(id) {
    document.getElementById(id)?.classList.remove('active');
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
    }
});

// ===== TABLE EMPTY STATE =====
function showEmptyState(tableBody, message = 'No records found', icon = 'bi-inbox') {
    tableBody.innerHTML = `<tr><td colspan="100"><div class="empty-state"><i class="bi ${icon}"></i><h5>${message}</h5><p>No data available to display.</p></div></td></tr>`;
}

// ===== DEBOUNCE =====
function debounce(fn, delay = 350) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

// ===== SIDEBAR HTML TEMPLATE =====
function getSidebarHtml() {
    const isAdmin = auth.isAdmin();
    return `
    <aside class="sidebar">
        <div class="sidebar-brand">
            <div class="sidebar-brand-icon"><i class="bi bi-capsule-pill"></i></div>
            <div class="sidebar-brand-text">
                <span class="sidebar-brand-name">MEDISTOCK</span>
                <span class="sidebar-brand-sub">Pharmacy Management</span>
            </div>
        </div>
        <nav class="sidebar-nav">
            <div class="sidebar-section-label">Main</div>
            <a href="/pages/dashboard.html" class="sidebar-item" data-page="dashboard">
                <i class="bi bi-grid-1x2-fill"></i> Dashboard
            </a>
            <a href="/pages/medicines.html" class="sidebar-item" data-page="medicines">
                <i class="bi bi-capsule"></i> Medicines
            </a>
            ${isAdmin ? `<a href="/pages/categories.html" class="sidebar-item" data-page="categories">
                <i class="bi bi-tags-fill"></i> Categories
            </a>` : ''}
            <div class="sidebar-section-label">Inventory</div>
            <a href="/pages/inventory.html" class="sidebar-item" data-page="inventory">
                <i class="bi bi-boxes"></i> Inventory
            </a>
            <a href="/pages/low-stock.html" class="sidebar-item" data-page="low-stock">
                <i class="bi bi-exclamation-triangle-fill"></i> Low Stock
                <span class="sidebar-badge" id="badge-lowstock" style="display:none"></span>
            </a>
            <a href="/pages/expiry.html" class="sidebar-item" data-page="expiry">
                <i class="bi bi-calendar-x-fill"></i> Expiry Alerts
                <span class="sidebar-badge" id="badge-expiry" style="display:none"></span>
            </a>
            <div class="sidebar-section-label">Operations</div>
            <a href="/pages/orders.html" class="sidebar-item" data-page="orders">
                <i class="bi bi-cart-fill"></i> Orders
            </a>
            ${isAdmin ? `<a href="/pages/users.html" class="sidebar-item" data-page="users">
                <i class="bi bi-people-fill"></i> Users
            </a>` : ''}
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
    return `
    <nav class="topnav">
        <button id="menu-toggle" class="btn-icon" style="border:none;display:none;" aria-label="Menu">
            <i class="bi bi-list"></i>
        </button>
        <div class="topnav-title">${title}</div>
        <div class="topnav-user">
            <div class="topnav-user-avatar" id="topnav-avatar">A</div>
            <div class="topnav-user-info">
                <div class="topnav-user-name" id="topnav-name">User</div>
                <div class="topnav-user-role" id="topnav-role">Role</div>
            </div>
        </div>
    </nav>
    `;
}

// Initialize common elements
function initLayout(title) {
    if (!auth.requireLogin()) return false;
    const sidebarContainer = document.getElementById('sidebar-container');
    const topnavContainer = document.getElementById('topnav-container');
    if (sidebarContainer) sidebarContainer.innerHTML = getSidebarHtml();
    if (topnavContainer) topnavContainer.innerHTML = getTopnavHtml(title);
    setupSidebar();
    return true;
}
