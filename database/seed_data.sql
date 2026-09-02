-- ============================================================
-- MEDISTOCK Seed Data
-- Sample Records for Categories, Medicines, Orders, and Users
-- ============================================================

USE medistock_db;

-- 1. SEED USERS
INSERT INTO users (id, name, email, password, role, active) VALUES
(1, 'Admin User', 'admin@medistock.com', '$2a$10$e8R45N9H3Vw/8F1A.z7a9.pXWzX5Gk2L.uQ1M5f3R8b0P8K9N0S2W', 'ADMIN', TRUE),
(2, 'Staff User', 'staff@medistock.com', '$2a$10$e8R45N9H3Vw/8F1A.z7a9.pXWzX5Gk2L.uQ1M5f3R8b0P8K9N0S2W', 'STAFF', TRUE),
(3, 'Senior Pharmacist', 'pharmacist@medistock.com', '$2a$10$e8R45N9H3Vw/8F1A.z7a9.pXWzX5Gk2L.uQ1M5f3R8b0P8K9N0S2W', 'STAFF', TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. SEED CATEGORIES
INSERT INTO categories (id, name, description, active) VALUES
(1, 'Analgesics & Antipyretics', 'Pain relievers, anti-inflammatory, and fever reducers', TRUE),
(2, 'Antibiotics & Antimicrobials', 'Bacterial and fungal infection treatment medicines', TRUE),
(3, 'Cardiovascular & Hypertension', 'Heart health, blood pressure control, and cholesterol management', TRUE),
(4, 'Antidiabetics & Endocrine Care', 'Blood sugar regulation and insulin control medications', TRUE),
(5, 'Respiratory & Antihistamines', 'Asthma, allergy relief, cold, and anti-tussive formulas', TRUE),
(6, 'Gastrointestinal & Digestive', 'Antacids, proton pump inhibitors, and gut health care', TRUE),
(7, 'Vitamins & Dietary Supplements', 'Multivitamins, minerals, calcium, and immunity boosters', TRUE),
(8, 'Dermatological & Topicals', 'Skin creams, antiseptic gels, and wound care treatments', TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. SEED MEDICINES
INSERT INTO medicines (id, medicine_name, generic_name, category_id, manufacturer, batch_number, price, quantity, minimum_stock_level, expiry_date, prescription_required, active) VALUES
(1, 'Paracetamol 650mg', 'Acetaminophen', 1, 'Micro Labs', 'BAT-9821', 32.50, 450, 100, '2027-08-20', FALSE, TRUE),
(2, 'Amoxicillin + Clavulanate 625mg', 'Amoxicillin Trihydrate', 2, 'GSK Healthcare', 'BAT-4412', 185.00, 85, 40, '2027-03-15', TRUE, TRUE),
(3, 'Cetirizine 10mg', 'Cetirizine Hydrochloride', 5, 'Dr. Reddys Labs', 'BAT-1102', 42.00, 240, 50, '2026-09-20', FALSE, TRUE),
(4, 'Atorvastatin 10mg', 'Atorvastatin Calcium', 3, 'Cipla Pharma', 'BAT-7730', 135.00, 180, 30, '2028-01-10', TRUE, TRUE),
(5, 'Omeprazole 20mg', 'Omeprazole', 6, 'Alkem Labs', 'BAT-3301', 54.00, 0, 30, '2026-08-28', FALSE, TRUE),
(6, 'Metformin 500mg', 'Metformin Hydrochloride', 4, 'Sun Pharma', 'BAT-6120', 28.00, 520, 100, '2027-11-30', TRUE, TRUE),
(7, 'Azithromycin 500mg', 'Azithromycin Dihydrate', 2, 'Alembic Pharma', 'BAT-8819', 118.50, 12, 35, '2027-02-18', TRUE, TRUE),
(8, 'Pantoprazole 40mg', 'Pantoprazole Sodium', 6, 'Aristo Pharma', 'BAT-5022', 95.00, 310, 50, '2027-06-25', FALSE, TRUE),
(9, 'Telmisartan 40mg', 'Telmisartan', 3, 'Glenmark Pharma', 'BAT-2041', 110.00, 145, 40, '2027-10-12', TRUE, TRUE),
(10, 'Montelukast + Levocetirizine', 'Montelukast Sodium', 5, 'Mankind Pharma', 'BAT-7115', 165.00, 95, 30, '2027-04-05', TRUE, TRUE),
(11, 'Ibuprofen 400mg', 'Ibuprofen', 1, 'Abbott India', 'BAT-1904', 22.00, 18, 50, '2027-09-14', FALSE, TRUE),
(12, 'Vitamin D3 60000 IU', 'Cholecalciferol', 7, 'Cadila Healthcare', 'BAT-3982', 65.00, 280, 40, '2028-02-28', FALSE, TRUE),
(13, 'Multivitamin + Zinc', 'Multivitamins and Minerals', 7, 'Apex Laboratories', 'BAT-8011', 125.00, 390, 60, '2027-12-15', FALSE, TRUE),
(14, 'Amlodipine 5mg', 'Amlodipine Besylate', 3, 'Mankind Pharma', 'BAT-6623', 38.00, 14, 45, '2027-05-10', TRUE, TRUE),
(15, 'Ciprofloxacin 500mg', 'Ciprofloxacin Hydrochloride', 2, 'Ranbaxy Labs', 'BAT-9104', 78.00, 60, 30, '2026-09-28', TRUE, TRUE),
(16, 'Losartan Potassium 50mg', 'Losartan Potassium', 3, 'Torrent Pharma', 'BAT-4712', 92.00, 160, 35, '2027-07-22', TRUE, TRUE),
(17, 'Glimepiride 2mg', 'Glimepiride', 4, 'Sanofi India', 'BAT-2289', 84.00, 210, 40, '2027-08-04', TRUE, TRUE),
(18, 'Diclofenac Sodium Gel 30g', 'Diclofenac Diethylamine', 8, 'Novartis India', 'BAT-3341', 115.00, 75, 25, '2027-11-12', FALSE, TRUE),
(19, 'Ondansetron 4mg', 'Ondansetron Hydrochloride', 6, 'Cipla Pharma', 'BAT-5890', 52.00, 40, 20, '2026-09-18', FALSE, TRUE),
(20, 'Ranitidine 150mg', 'Ranitidine Hydrochloride', 6, 'JB Chemicals', 'BAT-1029', 30.00, 0, 30, '2026-07-15', FALSE, TRUE)
ON DUPLICATE KEY UPDATE medicine_name=VALUES(medicine_name);

-- 4. SEED ORDERS
INSERT INTO orders (id, order_number, customer_name, customer_phone, total_amount, status, processed_by) VALUES
(1, 'ORD-2026-001', 'Apollo Care Hospital', '+91 98765 43210', 4850.00, 'COMPLETED', 1),
(2, 'ORD-2026-002', 'City Care Clinic', '+91 98123 45678', 12400.00, 'CONFIRMED', 2),
(3, 'ORD-2026-003', 'Sunshine Health Center', '+91 97654 32109', 2150.00, 'PENDING', 1),
(4, 'ORD-2026-004', 'St. Jude Medical Center', '+91 99887 76655', 8900.00, 'PREPARING', 2),
(5, 'ORD-2026-005', 'Metro Diagnostics', '+91 95432 10987', 1420.00, 'COMPLETED', 1),
(6, 'ORD-2026-006', 'Green Valley Pharmacy', '+91 94321 09876', 5600.00, 'CANCELLED', 2)
ON DUPLICATE KEY UPDATE order_number=VALUES(order_number);
