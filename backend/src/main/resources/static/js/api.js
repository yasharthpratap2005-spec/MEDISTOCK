/**
 * MEDISTOCK - API Client
 * Centralized REST API calls
 */

const getApiBase = () => {
    const saved = localStorage.getItem('medistock_api_url');
    if (saved) return saved.replace(/\/$/, '');
    if (window.location.port === '8080' || window.location.port === '3000') {
        return '/api';
    }
    // Default fallback for hosted static frontend pointing to local/remote backend
    return window.MEDISTOCK_API_URL || 'http://localhost:8080/api';
};

const API_BASE = getApiBase();

const api = {
    _getHeaders() {
        const token = localStorage.getItem('medistock_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        return headers;
    },

    async _request(method, path, body = null) {
        const options = {
            method,
            headers: this._getHeaders()
        };
        if (body) options.body = JSON.stringify(body);

        const response = await fetch(API_BASE + path, options);

        // Handle 401 - redirect to login
        if (response.status === 401) {
            localStorage.clear();
            const inPages = window.location.pathname.includes('/pages/');
            window.location.href = inPages ? 'login.html' : './pages/login.html';
            return;
        }

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            const message = data?.message || 'An error occurred';
            throw new Error(message);
        }

        return data;
    },

    get(path) { return this._request('GET', path); },
    post(path, body) { return this._request('POST', path, body); },
    put(path, body) { return this._request('PUT', path, body); },
    patch(path, body) { return this._request('PATCH', path, body); },
    delete(path) { return this._request('DELETE', path); },

    // Auth
    login(email, password) {
        return this._request('POST', '/auth/login', { email, password });
    },

    // Dashboard
    getDashboardSummary() { return this.get('/dashboard/summary'); },
    getDashboardLowStock() { return this.get('/dashboard/low-stock'); },
    getDashboardExpiring() { return this.get('/dashboard/expiring'); },
    getDashboardRecentOrders() { return this.get('/dashboard/recent-orders'); },

    // Categories
    getCategories(activeOnly = false) {
        return this.get(activeOnly ? '/categories/active' : '/categories');
    },
    createCategory(data) { return this.post('/categories', data); },
    updateCategory(id, data) { return this.put(`/categories/${id}`, data); },
    toggleCategoryStatus(id) { return this.patch(`/categories/${id}/status`); },

    // Medicines
    getMedicines(keyword = '', categoryId = '', active = '') {
        const params = new URLSearchParams();
        if (keyword) params.set('keyword', keyword);
        if (categoryId) params.set('categoryId', categoryId);
        if (active !== '') params.set('active', active);
        const qs = params.toString();
        return this.get('/medicines' + (qs ? '?' + qs : ''));
    },
    getMedicineById(id) { return this.get(`/medicines/${id}`); },
    getLowStockMedicines() { return this.get('/medicines/low-stock'); },
    getExpiringSoonMedicines() { return this.get('/medicines/expiring'); },
    getExpiredMedicines() { return this.get('/medicines/expired'); },
    createMedicine(data) { return this.post('/medicines', data); },
    updateMedicine(id, data) { return this.put(`/medicines/${id}`, data); },
    toggleMedicineStatus(id) { return this.patch(`/medicines/${id}/status`); },

    // Inventory
    getInventory() { return this.get('/inventory'); },
    stockIn(medicineId, data) { return this.post(`/inventory/${medicineId}/stock-in`, data); },
    stockOut(medicineId, data) { return this.post(`/inventory/${medicineId}/stock-out`, data); },
    getStockHistory(medicineId) { return this.get(`/inventory/${medicineId}/history`); },

    // Orders
    getOrders() { return this.get('/orders'); },
    getOrderById(id) { return this.get(`/orders/${id}`); },
    createOrder(data) { return this.post('/orders', data); },
    updateOrderStatus(id, status) { return this.patch(`/orders/${id}/status`, { status }); },
    cancelOrder(id) { return this.post(`/orders/${id}/cancel`); },

    // Users
    getUsers() { return this.get('/users'); },
    createUser(data) { return this.post('/users', data); },
    toggleUserStatus(id) { return this.patch(`/users/${id}/status`); },
};
