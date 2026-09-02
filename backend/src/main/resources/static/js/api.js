/**
 * MEDISTOCK - API Client
 * Centralized REST API calls with Demo Fallback & Rich Seed Data
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

// Expanded Mock Data for Demo / Offline / Hosted Preview Mode
const MOCK_DATA = {
    categories: [
        { id: 1, categoryName: 'Analgesics & Antipyretics', description: 'Pain relievers, anti-inflammatory, and fever reducers', active: true, createdAt: '2026-01-10' },
        { id: 2, categoryName: 'Antibiotics & Antimicrobials', description: 'Bacterial and fungal infection treatment medicines', active: true, createdAt: '2026-01-12' },
        { id: 3, categoryName: 'Cardiovascular & Hypertension', description: 'Heart health, blood pressure control, and cholesterol management', active: true, createdAt: '2026-01-15' },
        { id: 4, categoryName: 'Antidiabetics & Endocrine Care', description: 'Blood sugar regulation and insulin control medications', active: true, createdAt: '2026-01-18' },
        { id: 5, categoryName: 'Respiratory & Antihistamines', description: 'Asthma, allergy relief, cold, and anti-tussive formulas', active: true, createdAt: '2026-01-20' },
        { id: 6, categoryName: 'Gastrointestinal & Digestive', description: 'Antacids, proton pump inhibitors, and gut health care', active: true, createdAt: '2026-01-22' },
        { id: 7, categoryName: 'Vitamins & Dietary Supplements', description: 'Multivitamins, minerals, calcium, and immunity boosters', active: true, createdAt: '2026-01-25' },
        { id: 8, categoryName: 'Dermatological & Topicals', description: 'Skin creams, antiseptic gels, and wound care treatments', active: true, createdAt: '2026-01-28' }
    ],
    medicines: [
        { id: 1, medicineName: 'Paracetamol 650mg', genericName: 'Acetaminophen', categoryId: 1, categoryName: 'Analgesics & Antipyretics', brandName: 'Dolo 650', batchNumber: 'BAT-9821', unitPrice: 32.50, quantity: 450, minimumStockLevel: 100, stockStatus: 'IN_STOCK', expiryDate: '2027-08-20', expiryStatus: 'VALID', active: true },
        { id: 2, medicineName: 'Amoxicillin + Clavulanate 625mg', genericName: 'Amoxicillin Trihydrate / Potassium Clavulanate', categoryId: 2, categoryName: 'Antibiotics & Antimicrobials', brandName: 'Augmentin 625', batchNumber: 'BAT-4412', unitPrice: 185.00, quantity: 85, minimumStockLevel: 40, stockStatus: 'IN_STOCK', expiryDate: '2027-03-15', expiryStatus: 'VALID', active: true },
        { id: 3, medicineName: 'Cetirizine 10mg', genericName: 'Cetirizine Hydrochloride', categoryId: 5, categoryName: 'Respiratory & Antihistamines', brandName: 'Cetzine', batchNumber: 'BAT-1102', unitPrice: 42.00, quantity: 240, minimumStockLevel: 50, stockStatus: 'IN_STOCK', expiryDate: '2026-09-20', expiryStatus: 'EXPIRING_SOON', active: true },
        { id: 4, medicineName: 'Atorvastatin 10mg', genericName: 'Atorvastatin Calcium', categoryId: 3, categoryName: 'Cardiovascular & Hypertension', brandName: 'Atorva 10', batchNumber: 'BAT-7730', unitPrice: 135.00, quantity: 180, minimumStockLevel: 30, stockStatus: 'IN_STOCK', expiryDate: '2028-01-10', expiryStatus: 'VALID', active: true },
        { id: 5, medicineName: 'Omeprazole 20mg', genericName: 'Omeprazole', categoryId: 6, categoryName: 'Gastrointestinal & Digestive', brandName: 'Omez 20', batchNumber: 'BAT-3301', unitPrice: 54.00, quantity: 0, minimumStockLevel: 30, stockStatus: 'OUT_OF_STOCK', expiryDate: '2026-08-28', expiryStatus: 'EXPIRED', active: true },
        { id: 6, medicineName: 'Metformin 500mg', genericName: 'Metformin Hydrochloride', categoryId: 4, categoryName: 'Antidiabetics & Endocrine Care', brandName: 'Glycomet 500', batchNumber: 'BAT-6120', unitPrice: 28.00, quantity: 520, minimumStockLevel: 100, stockStatus: 'IN_STOCK', expiryDate: '2027-11-30', expiryStatus: 'VALID', active: true },
        { id: 7, medicineName: 'Azithromycin 500mg', genericName: 'Azithromycin Dihydrate', categoryId: 2, categoryName: 'Antibiotics & Antimicrobials', brandName: 'Azithral 500', batchNumber: 'BAT-8819', unitPrice: 118.50, quantity: 12, minimumStockLevel: 35, stockStatus: 'LOW_STOCK', expiryDate: '2027-02-18', expiryStatus: 'VALID', active: true },
        { id: 8, medicineName: 'Pantoprazole 40mg', genericName: 'Pantoprazole Sodium', categoryId: 6, categoryName: 'Gastrointestinal & Digestive', brandName: 'Pan 40', batchNumber: 'BAT-5022', unitPrice: 95.00, quantity: 310, minimumStockLevel: 50, stockStatus: 'IN_STOCK', expiryDate: '2027-06-25', expiryStatus: 'VALID', active: true },
        { id: 9, medicineName: 'Telmisartan 40mg', genericName: 'Telmisartan', categoryId: 3, categoryName: 'Cardiovascular & Hypertension', brandName: 'Telma 40', batchNumber: 'BAT-2041', unitPrice: 110.00, quantity: 145, minimumStockLevel: 40, stockStatus: 'IN_STOCK', expiryDate: '2027-10-12', expiryStatus: 'VALID', active: true },
        { id: 10, medicineName: 'Montelukast + Levocetirizine', genericName: 'Montelukast Sodium / Levocetirizine', categoryId: 5, categoryName: 'Respiratory & Antihistamines', brandName: 'Montair LC', batchNumber: 'BAT-7115', unitPrice: 165.00, quantity: 95, minimumStockLevel: 30, stockStatus: 'IN_STOCK', expiryDate: '2027-04-05', expiryStatus: 'VALID', active: true },
        { id: 11, medicineName: 'Ibuprofen 400mg', genericName: 'Ibuprofen', categoryId: 1, categoryName: 'Analgesics & Antipyretics', brandName: 'Brufen 400', batchNumber: 'BAT-1904', unitPrice: 22.00, quantity: 18, minimumStockLevel: 50, stockStatus: 'LOW_STOCK', expiryDate: '2027-09-14', expiryStatus: 'VALID', active: true },
        { id: 12, medicineName: 'Vitamin D3 60000 IU', genericName: 'Cholecalciferol', categoryId: 7, categoryName: 'Vitamins & Dietary Supplements', brandName: 'Calcirol Sachet', batchNumber: 'BAT-3982', unitPrice: 65.00, quantity: 280, minimumStockLevel: 40, stockStatus: 'IN_STOCK', expiryDate: '2028-02-28', expiryStatus: 'VALID', active: true },
        { id: 13, medicineName: 'Multivitamin + Zinc', genericName: 'Multivitamins and Minerals', categoryId: 7, categoryName: 'Vitamins & Dietary Supplements', brandName: 'Zincovit', batchNumber: 'BAT-8011', unitPrice: 125.00, quantity: 390, minimumStockLevel: 60, stockStatus: 'IN_STOCK', expiryDate: '2027-12-15', expiryStatus: 'VALID', active: true },
        { id: 14, medicineName: 'Amlodipine 5mg', genericName: 'Amlodipine Besylate', categoryId: 3, categoryName: 'Cardiovascular & Hypertension', brandName: 'Amlokind 5', batchNumber: 'BAT-6623', unitPrice: 38.00, quantity: 14, minimumStockLevel: 45, stockStatus: 'LOW_STOCK', expiryDate: '2027-05-10', expiryStatus: 'VALID', active: true },
        { id: 15, medicineName: 'Ciprofloxacin 500mg', genericName: 'Ciprofloxacin Hydrochloride', categoryId: 2, categoryName: 'Antibiotics & Antimicrobials', brandName: 'Cifran 500', batchNumber: 'BAT-9104', unitPrice: 78.00, quantity: 60, minimumStockLevel: 30, stockStatus: 'IN_STOCK', expiryDate: '2026-09-28', expiryStatus: 'EXPIRING_SOON', active: true },
        { id: 16, medicineName: 'Losartan Potassium 50mg', genericName: 'Losartan Potassium', categoryId: 3, categoryName: 'Cardiovascular & Hypertension', brandName: 'Repace 50', batchNumber: 'BAT-4712', unitPrice: 92.00, quantity: 160, minimumStockLevel: 35, stockStatus: 'IN_STOCK', expiryDate: '2027-07-22', expiryStatus: 'VALID', active: true },
        { id: 17, medicineName: 'Glimepiride 2mg', genericName: 'Glimepiride', categoryId: 4, categoryName: 'Antidiabetics & Endocrine Care', brandName: 'Amaryl 2mg', batchNumber: 'BAT-2289', unitPrice: 84.00, quantity: 210, minimumStockLevel: 40, stockStatus: 'IN_STOCK', expiryDate: '2027-08-04', expiryStatus: 'VALID', active: true },
        { id: 18, medicineName: 'Diclofenac Sodium Gel 30g', genericName: 'Diclofenac Diethylamine', categoryId: 8, categoryName: 'Dermatological & Topicals', brandName: 'Voveran Emulgel', batchNumber: 'BAT-3341', unitPrice: 115.00, quantity: 75, minimumStockLevel: 25, stockStatus: 'IN_STOCK', expiryDate: '2027-11-12', expiryStatus: 'VALID', active: true },
        { id: 19, medicineName: 'Ondansetron 4mg', genericName: 'Ondansetron Hydrochloride', categoryId: 6, categoryName: 'Gastrointestinal & Digestive', brandName: 'Emset 4', batchNumber: 'BAT-5890', unitPrice: 52.00, quantity: 40, minimumStockLevel: 20, stockStatus: 'IN_STOCK', expiryDate: '2026-09-18', expiryStatus: 'EXPIRING_SOON', active: true },
        { id: 20, medicineName: 'Ranitidine 150mg', genericName: 'Ranitidine Hydrochloride', categoryId: 6, categoryName: 'Gastrointestinal & Digestive', brandName: 'Rantac 150', batchNumber: 'BAT-1029', unitPrice: 30.00, quantity: 0, minimumStockLevel: 30, stockStatus: 'OUT_OF_STOCK', expiryDate: '2026-07-15', expiryStatus: 'EXPIRED', active: true }
    ],
    orders: [
        { id: 1, orderNumber: 'ORD-2026-001', customerName: 'Apollo Care Hospital', customerPhone: '+91 98765 43210', createdAt: '2026-09-02T10:30:00', totalAmount: 4850.00, status: 'COMPLETED', processedByName: 'Admin User' },
        { id: 2, orderNumber: 'ORD-2026-002', customerName: 'City Care Clinic', customerPhone: '+91 98123 45678', createdAt: '2026-09-02T14:15:00', totalAmount: 12400.00, status: 'CONFIRMED', processedByName: 'Staff User' },
        { id: 3, orderNumber: 'ORD-2026-003', customerName: 'Sunshine Health Center', customerPhone: '+91 97654 32109', createdAt: '2026-09-01T16:45:00', totalAmount: 2150.00, status: 'PENDING', processedByName: 'Admin User' },
        { id: 4, orderNumber: 'ORD-2026-004', customerName: 'St. Jude Medical Center', customerPhone: '+91 99887 76655', createdAt: '2026-09-01T11:20:00', totalAmount: 8900.00, status: 'PREPARING', processedByName: 'Staff User' },
        { id: 5, orderNumber: 'ORD-2026-005', customerName: 'Metro Diagnostics', customerPhone: '+91 95432 10987', createdAt: '2026-08-31T09:10:00', totalAmount: 1420.00, status: 'COMPLETED', processedByName: 'Admin User' },
        { id: 6, orderNumber: 'ORD-2026-006', customerName: 'Green Valley Pharmacy', customerPhone: '+91 94321 09876', createdAt: '2026-08-30T15:50:00', totalAmount: 5600.00, status: 'CANCELLED', processedByName: 'Staff User' }
    ],
    users: [
        { id: 1, name: 'Admin User', email: 'admin@medistock.com', role: 'ADMIN', active: true, createdAt: '2026-01-01' },
        { id: 2, name: 'Staff User', email: 'staff@medistock.com', role: 'STAFF', active: true, createdAt: '2026-01-05' },
        { id: 3, name: 'Senior Pharmacist', email: 'pharmacist@medistock.com', role: 'STAFF', active: true, createdAt: '2026-02-10' }
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
                return { success: true, data: MOCK_DATA.medicines.filter(m => m.stockStatus === 'LOW_STOCK' || m.stockStatus === 'OUT_OF_STOCK') };
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
