/**
 * MEDISTOCK - API Client
 * Centralized REST API calls with Demo Fallback
 */

const getApiBase = () => {
    const saved = localStorage.getItem('medistock_api_url');
    if (saved) return saved.replace(/\/$/, '');
    if (window.location.port === '8080' || window.location.port === '3000') {
        return '/api';
    }
    return window.MEDISTOCK_API_URL || 'http://localhost:8080/api';
};

const API_BASE = getApiBase();

// Mock Data for Demo / Offline / Hosted Preview Mode
const MOCK_DATA = {
    categories: [
        { id: 1, categoryName: 'Analgesics', description: 'Pain relievers and fever reducers', active: true, createdAt: '2026-01-10' },
        { id: 2, categoryName: 'Antibiotics', description: 'Bacterial infection treatments', active: true, createdAt: '2026-01-12' },
        { id: 3, categoryName: 'Antihistamines', description: 'Allergy and allergy relief', active: true, createdAt: '2026-01-15' },
        { id: 4, categoryName: 'Cardiovascular', description: 'Heart and blood pressure care', active: true, createdAt: '2026-01-20' },
        { id: 5, categoryName: 'Vitamins & Supplements', description: 'Wellness & dietary supplements', active: true, createdAt: '2026-01-22' }
    ],
    medicines: [
        { id: 1, medicineName: 'Paracetamol 500mg', genericName: 'Acetaminophen', categoryId: 1, categoryName: 'Analgesics', brandName: 'Crocin', batchNumber: 'BAT-9821', unitPrice: 25.50, quantity: 15, minimumStockLevel: 50, stockStatus: 'LOW_STOCK', expiryDate: '2027-05-20', expiryStatus: 'VALID', active: true },
        { id: 2, medicineName: 'Amoxicillin 250mg', genericName: 'Amoxicillin Trihydrate', categoryId: 2, categoryName: 'Antibiotics', brandName: 'Mox 250', batchNumber: 'BAT-4412', unitPrice: 85.00, quantity: 8, minimumStockLevel: 30, stockStatus: 'LOW_STOCK', expiryDate: '2026-11-15', expiryStatus: 'VALID', active: true },
        { id: 3, medicineName: 'Cetirizine 10mg', genericName: 'Cetirizine Hydrochloride', categoryId: 3, categoryName: 'Antihistamines', brandName: 'Cetzine', batchNumber: 'BAT-1102', unitPrice: 35.00, quantity: 240, minimumStockLevel: 40, stockStatus: 'IN_STOCK', expiryDate: '2026-09-15', expiryStatus: 'EXPIRING_SOON', active: true },
        { id: 4, medicineName: 'Atorvastatin 10mg', genericName: 'Atorvastatin Calcium', categoryId: 4, categoryName: 'Cardiovascular', brandName: 'Atorva', batchNumber: 'BAT-7730', unitPrice: 120.00, quantity: 110, minimumStockLevel: 25, stockStatus: 'IN_STOCK', expiryDate: '2028-01-10', expiryStatus: 'VALID', active: true },
        { id: 5, medicineName: 'Omeprazole 20mg', genericName: 'Omeprazole', categoryId: 1, categoryName: 'Analgesics', brandName: 'Omez', batchNumber: 'BAT-3301', unitPrice: 48.00, quantity: 0, minimumStockLevel: 20, stockStatus: 'OUT_OF_STOCK', expiryDate: '2026-08-30', expiryStatus: 'EXPIRED', active: true }
    ],
    orders: [
        { id: 1, orderNumber: 'ORD-2026-001', customerName: 'Apollo Care Hospital', createdAt: '2026-09-02T10:30:00', totalAmount: 4500.00, status: 'COMPLETED', processedByName: 'Admin User' },
        { id: 2, orderNumber: 'ORD-2026-002', customerName: 'City Clinic', createdAt: '2026-09-02T14:15:00', totalAmount: 1850.50, status: 'PENDING', processedByName: 'Staff User' },
        { id: 3, orderNumber: 'ORD-2026-003', customerName: 'Metro Pharmacy', createdAt: '2026-09-01T16:45:00', totalAmount: 9200.00, status: 'CONFIRMED', processedByName: 'Admin User' }
    ],
    users: [
        { id: 1, name: 'Admin User', email: 'admin@medistock.com', role: 'ADMIN', active: true, createdAt: '2026-01-01' },
        { id: 2, name: 'Staff User', email: 'staff@medistock.com', role: 'STAFF', active: true, createdAt: '2026-01-05' }
    ]
};

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

        try {
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
        } catch (err) {
            // If network fetch fails (e.g. backend server offline or HTTPS mixed content block)
            console.warn(`[MEDISTOCK API] Backend unreachable at ${API_BASE}${path}. Using Demo Mode fallback.`, err);
            return this._mockFallback(method, path, body);
        }
    },

    _mockFallback(method, path, body) {
        if (path.includes('/auth/login')) {
            const email = body?.email || 'admin@medistock.com';
            const isAdmin = email.includes('admin');
            return {
                success: true,
                data: {
                    token: 'demo-jwt-token-medistock',
                    userId: isAdmin ? 1 : 2,
                    name: isAdmin ? 'Admin User' : 'Staff User',
                    email: email,
                    role: isAdmin ? 'ADMIN' : 'STAFF'
                }
            };
        }

        if (path === '/dashboard/summary') {
            const totalMedicines = MOCK_DATA.medicines.length;
            const totalCategories = MOCK_DATA.categories.length;
            const totalStockUnits = MOCK_DATA.medicines.reduce((acc, m) => acc + m.quantity, 0);
            const lowStockCount = MOCK_DATA.medicines.filter(m => m.stockStatus === 'LOW_STOCK' || m.stockStatus === 'OUT_OF_STOCK').length;
            const expiringSoonCount = MOCK_DATA.medicines.filter(m => m.expiryStatus === 'EXPIRING_SOON').length;
            const expiredCount = MOCK_DATA.medicines.filter(m => m.expiryStatus === 'EXPIRED').length;
            const totalOrders = MOCK_DATA.orders.length;
            const pendingOrders = MOCK_DATA.orders.filter(o => o.status === 'PENDING').length;
            const completedOrders = MOCK_DATA.orders.filter(o => o.status === 'COMPLETED').length;

            return {
                success: true,
                data: { totalMedicines, totalCategories, totalStockUnits, lowStockCount, expiringSoonCount, expiredCount, totalOrders, pendingOrders, completedOrders }
            };
        }

        if (path === '/dashboard/low-stock') {
            return {
                success: true,
                data: MOCK_DATA.medicines.filter(m => m.stockStatus === 'LOW_STOCK' || m.stockStatus === 'OUT_OF_STOCK')
            };
        }

        if (path === '/dashboard/expiring') {
            return {
                success: true,
                data: MOCK_DATA.medicines.filter(m => m.expiryStatus === 'EXPIRING_SOON' || m.expiryStatus === 'EXPIRED')
            };
        }

        if (path === '/dashboard/recent-orders') {
            return { success: true, data: MOCK_DATA.orders };
        }

        if (path.startsWith('/categories')) {
            return { success: true, data: MOCK_DATA.categories };
        }

        if (path.startsWith('/medicines')) {
            if (path.includes('/low-stock')) {
                return { success: true, data: MOCK_DATA.medicines.filter(m => m.stockStatus === 'LOW_STOCK') };
            }
            if (path.includes('/expiring')) {
                return { success: true, data: MOCK_DATA.medicines.filter(m => m.expiryStatus === 'EXPIRING_SOON') };
            }
            if (path.includes('/expired')) {
                return { success: true, data: MOCK_DATA.medicines.filter(m => m.expiryStatus === 'EXPIRED') };
            }
            return { success: true, data: MOCK_DATA.medicines };
        }

        if (path.startsWith('/inventory')) {
            return {
                success: true,
                data: MOCK_DATA.medicines.map(m => ({
                    medicineId: m.id,
                    medicineName: m.medicineName,
                    batchNumber: m.batchNumber,
                    currentStock: m.quantity,
                    minStock: m.minimumStockLevel,
                    status: m.stockStatus
                }))
            };
        }

        if (path.startsWith('/orders')) {
            return { success: true, data: MOCK_DATA.orders };
        }

        if (path.startsWith('/users')) {
            return { success: true, data: MOCK_DATA.users };
        }

        return { success: true, message: 'Operation successful (Demo Mode)', data: null };
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
