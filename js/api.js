/**
 * MEDISTOCK - Centralized API Client & Data Management Engine
 * Single Source of Truth with LocalStorage Persistence & Dynamic Metrics
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

// Master Seed Dataset (124 Items Across Medicines, Wellness, Supplies)
const INITIAL_MASTER_PRODUCTS = [
  {
    "id": 1,
    "sku": "SKU-MED-001",
    "medicineName": "Paracetamol 500 mg",
    "genericName": "Acetaminophen",
    "brandName": "Crocin 500",
    "category": "Medicines",
    "subcategory": "Pain Relief",
    "strength": "500 mg",
    "packSize": "15 Tablets / Strip",
    "batchNumber": "BAT-2026-117",
    "quantity": 168,
    "minimumStockLevel": 40,
    "expiryDate": "2027-04-14",
    "supplier": "Cipla Lifesciences",
    "purchasePrice": 18,
    "sellingPrice": 25.5,
    "active": true
  },
  {
    "id": 2,
    "sku": "SKU-MED-002",
    "medicineName": "Paracetamol 650 mg",
    "genericName": "Acetaminophen",
    "brandName": "Dolo 650",
    "category": "Medicines",
    "subcategory": "Pain Relief",
    "strength": "650 mg",
    "packSize": "15 Tablets / Strip",
    "batchNumber": "BAT-2026-134",
    "quantity": 341,
    "minimumStockLevel": 40,
    "expiryDate": "2027-10-02",
    "supplier": "Apollo Medical Wholesalers",
    "purchasePrice": 24,
    "sellingPrice": 32.5,
    "active": true
  },
  {
    "id": 3,
    "sku": "SKU-MED-003",
    "medicineName": "Ibuprofen 400 mg",
    "genericName": "Ibuprofen",
    "brandName": "Brufen 400",
    "category": "Medicines",
    "subcategory": "Pain Relief",
    "strength": "400 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-151",
    "quantity": 142,
    "minimumStockLevel": 40,
    "expiryDate": "2027-04-01",
    "supplier": "Dr. Reddy's Logistics",
    "purchasePrice": 15,
    "sellingPrice": 22,
    "active": true
  },
  {
    "id": 4,
    "sku": "SKU-MED-004",
    "medicineName": "Diclofenac Sodium 50 mg",
    "genericName": "Diclofenac Sodium",
    "brandName": "Voveran 50",
    "category": "Medicines",
    "subcategory": "Pain Relief",
    "strength": "50 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-168",
    "quantity": 380,
    "minimumStockLevel": 40,
    "expiryDate": "2027-06-24",
    "supplier": "GSK Healthcare India",
    "purchasePrice": 28,
    "sellingPrice": 38,
    "active": true
  },
  {
    "id": 5,
    "sku": "SKU-MED-005",
    "medicineName": "Aceclofenac 100 mg",
    "genericName": "Aceclofenac",
    "brandName": "Zerodol",
    "category": "Medicines",
    "subcategory": "Pain Relief",
    "strength": "100 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-185",
    "quantity": 3,
    "minimumStockLevel": 25,
    "expiryDate": "2027-08-29",
    "supplier": "Abbott Healthcare",
    "purchasePrice": 35,
    "sellingPrice": 48,
    "active": true
  },
  {
    "id": 6,
    "sku": "SKU-MED-006",
    "medicineName": "Naproxen 500 mg",
    "genericName": "Naproxen",
    "brandName": "Naprosyn 500",
    "category": "Medicines",
    "subcategory": "Pain Relief",
    "strength": "500 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-202",
    "quantity": 392,
    "minimumStockLevel": 40,
    "expiryDate": "2027-12-19",
    "supplier": "Mankind Pharma Supply",
    "purchasePrice": 52,
    "sellingPrice": 70,
    "active": true
  },
  {
    "id": 7,
    "sku": "SKU-MED-007",
    "medicineName": "Tramadol 50 mg",
    "genericName": "Tramadol Hydrochloride",
    "brandName": "Ultram",
    "category": "Medicines",
    "subcategory": "Pain Relief",
    "strength": "50 mg",
    "packSize": "10 Capsules / Strip",
    "batchNumber": "BAT-2026-219",
    "quantity": 382,
    "minimumStockLevel": 40,
    "expiryDate": "2026-10-13",
    "supplier": "Alkem Laboratories",
    "purchasePrice": 65,
    "sellingPrice": 90,
    "active": true
  },
  {
    "id": 8,
    "sku": "SKU-MED-008",
    "medicineName": "Mefenamic Acid 500 mg",
    "genericName": "Mefenamic Acid",
    "brandName": "Meftal 500",
    "category": "Medicines",
    "subcategory": "Pain Relief",
    "strength": "500 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-236",
    "quantity": 402,
    "minimumStockLevel": 40,
    "expiryDate": "2028-01-05",
    "supplier": "Sun Pharma Direct",
    "purchasePrice": 30,
    "sellingPrice": 42,
    "active": true
  },
  {
    "id": 9,
    "sku": "SKU-MED-009",
    "medicineName": "Ketorolac 10 mg",
    "genericName": "Ketorolac Tromethamine",
    "brandName": "Ketanov",
    "category": "Medicines",
    "subcategory": "Pain Relief",
    "strength": "10 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-253",
    "quantity": 0,
    "minimumStockLevel": 30,
    "expiryDate": "2027-11-10",
    "supplier": "Cipla Lifesciences",
    "purchasePrice": 40,
    "sellingPrice": 58,
    "active": true
  },
  {
    "id": 10,
    "sku": "SKU-MED-010",
    "medicineName": "Etoricoxib 90 mg",
    "genericName": "Etoricoxib NSAID",
    "brandName": "Nucoxia 90",
    "category": "Medicines",
    "subcategory": "Pain Relief",
    "strength": "90 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-270",
    "quantity": 15,
    "minimumStockLevel": 25,
    "expiryDate": "2027-07-02",
    "supplier": "Apollo Medical Wholesalers",
    "purchasePrice": 95,
    "sellingPrice": 135,
    "active": true
  },
  {
    "id": 11,
    "sku": "SKU-MED-011",
    "medicineName": "Indomethacin 25 mg",
    "genericName": "Indomethacin",
    "brandName": "Indocap 25",
    "category": "Medicines",
    "subcategory": "Pain Relief",
    "strength": "25 mg",
    "packSize": "10 Capsules / Strip",
    "batchNumber": "BAT-2026-287",
    "quantity": 155,
    "minimumStockLevel": 40,
    "expiryDate": "2026-08-09",
    "supplier": "Dr. Reddy's Logistics",
    "purchasePrice": 22,
    "sellingPrice": 32,
    "active": true
  },
  {
    "id": 12,
    "sku": "SKU-MED-012",
    "medicineName": "Paracetamol Suspension 120mg/5ml",
    "genericName": "Acetaminophen Syrup",
    "brandName": "Calpol Syrup",
    "category": "Medicines",
    "subcategory": "Fever",
    "strength": "120 mg/5 ml",
    "packSize": "60 ml Bottle",
    "batchNumber": "BAT-2026-304",
    "quantity": 223,
    "minimumStockLevel": 40,
    "expiryDate": "2027-03-26",
    "supplier": "GSK Healthcare India",
    "purchasePrice": 38,
    "sellingPrice": 50,
    "active": true
  },
  {
    "id": 13,
    "sku": "SKU-MED-013",
    "medicineName": "Mefenamic Acid + Paracetamol Syrup",
    "genericName": "Mefenamic Acid / Paracetamol",
    "brandName": "Meftal-P Syrup",
    "category": "Medicines",
    "subcategory": "Fever",
    "strength": "100 mg + 125 mg",
    "packSize": "60 ml Bottle",
    "batchNumber": "BAT-2026-321",
    "quantity": 259,
    "minimumStockLevel": 40,
    "expiryDate": "2027-06-10",
    "supplier": "Abbott Healthcare",
    "purchasePrice": 45,
    "sellingPrice": 62,
    "active": true
  },
  {
    "id": 14,
    "sku": "SKU-MED-014",
    "medicineName": "Ibuprofen + Paracetamol",
    "genericName": "Ibuprofen / Acetaminophen",
    "brandName": "Combiflam",
    "category": "Medicines",
    "subcategory": "Fever",
    "strength": "400 mg + 325 mg",
    "packSize": "20 Tablets / Strip",
    "batchNumber": "BAT-2026-338",
    "quantity": 349,
    "minimumStockLevel": 40,
    "expiryDate": "2026-10-24",
    "supplier": "Mankind Pharma Supply",
    "purchasePrice": 28,
    "sellingPrice": 40,
    "active": true
  },
  {
    "id": 15,
    "sku": "SKU-MED-015",
    "medicineName": "Nimesulide 100 mg",
    "genericName": "Nimesulide",
    "brandName": "Nise 100",
    "category": "Medicines",
    "subcategory": "Fever",
    "strength": "100 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-355",
    "quantity": 10,
    "minimumStockLevel": 25,
    "expiryDate": "2027-01-31",
    "supplier": "Alkem Laboratories",
    "purchasePrice": 40,
    "sellingPrice": 55,
    "active": true
  },
  {
    "id": 16,
    "sku": "SKU-MED-016",
    "medicineName": "Dextromethorphan Cough Syrup",
    "genericName": "Dextromethorphan Hydrobromide",
    "brandName": "Benadryl DR",
    "category": "Medicines",
    "subcategory": "Cold & Cough",
    "strength": "15 mg/5 ml",
    "packSize": "100 ml Bottle",
    "batchNumber": "BAT-2026-372",
    "quantity": 150,
    "minimumStockLevel": 40,
    "expiryDate": "2026-12-31",
    "supplier": "Sun Pharma Direct",
    "purchasePrice": 85,
    "sellingPrice": 115,
    "active": true
  },
  {
    "id": 17,
    "sku": "SKU-MED-017",
    "medicineName": "Ambroxol + Levocetirizine Syrup",
    "genericName": "Ambroxol / Levocetirizine",
    "brandName": "Alex Syrup",
    "category": "Medicines",
    "subcategory": "Cold & Cough",
    "strength": "30 mg + 2.5 mg",
    "packSize": "100 ml Bottle",
    "batchNumber": "BAT-2026-389",
    "quantity": 197,
    "minimumStockLevel": 40,
    "expiryDate": "2027-07-06",
    "supplier": "Cipla Lifesciences",
    "purchasePrice": 90,
    "sellingPrice": 125,
    "active": true
  },
  {
    "id": 18,
    "sku": "SKU-MED-018",
    "medicineName": "Phenylephrine + Paracetamol + CPM",
    "genericName": "Cold Care Combo",
    "brandName": "Sinarest",
    "category": "Medicines",
    "subcategory": "Cold & Cough",
    "strength": "500 mg Combo",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-406",
    "quantity": 0,
    "minimumStockLevel": 30,
    "expiryDate": "2027-05-23",
    "supplier": "Apollo Medical Wholesalers",
    "purchasePrice": 38,
    "sellingPrice": 52,
    "active": true
  },
  {
    "id": 19,
    "sku": "SKU-MED-019",
    "medicineName": "Cheston Cold Tablet",
    "genericName": "Paracetamol / Cetirizine / Phenylephrine",
    "brandName": "Cheston Cold",
    "category": "Medicines",
    "subcategory": "Cold & Cough",
    "strength": "Standard",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-423",
    "quantity": 208,
    "minimumStockLevel": 40,
    "expiryDate": "2027-12-11",
    "supplier": "Dr. Reddy's Logistics",
    "purchasePrice": 32,
    "sellingPrice": 45,
    "active": true
  },
  {
    "id": 20,
    "sku": "SKU-MED-020",
    "medicineName": "Chlorpheniramine Maleate 4 mg",
    "genericName": "CPM",
    "brandName": "Cadistin",
    "category": "Medicines",
    "subcategory": "Cold & Cough",
    "strength": "4 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-440",
    "quantity": 16,
    "minimumStockLevel": 25,
    "expiryDate": "2027-04-24",
    "supplier": "GSK Healthcare India",
    "purchasePrice": 12,
    "sellingPrice": 18,
    "active": true
  },
  {
    "id": 21,
    "sku": "SKU-MED-021",
    "medicineName": "Guaifenesin Expectorant",
    "genericName": "Guaifenesin",
    "brandName": "Mucinex Expectorant",
    "category": "Medicines",
    "subcategory": "Cold & Cough",
    "strength": "100 mg/5 ml",
    "packSize": "100 ml Bottle",
    "batchNumber": "BAT-2026-457",
    "quantity": 255,
    "minimumStockLevel": 40,
    "expiryDate": "2026-10-24",
    "supplier": "Abbott Healthcare",
    "purchasePrice": 75,
    "sellingPrice": 105,
    "active": true
  },
  {
    "id": 22,
    "sku": "SKU-MED-022",
    "medicineName": "Amoxicillin 500 mg",
    "genericName": "Amoxicillin Trihydrate",
    "brandName": "Mox 500",
    "category": "Medicines",
    "subcategory": "Antibiotics",
    "strength": "500 mg",
    "packSize": "10 Capsules / Strip",
    "batchNumber": "BAT-2026-474",
    "quantity": 87,
    "minimumStockLevel": 40,
    "expiryDate": "2026-08-15",
    "supplier": "Mankind Pharma Supply",
    "purchasePrice": 60,
    "sellingPrice": 82,
    "active": true
  },
  {
    "id": 23,
    "sku": "SKU-MED-023",
    "medicineName": "Amoxicillin + Clavulanate 625 mg",
    "genericName": "Amoxicillin / Clavulanic Acid",
    "brandName": "Augmentin 625 Duo",
    "category": "Medicines",
    "subcategory": "Antibiotics",
    "strength": "625 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-491",
    "quantity": 201,
    "minimumStockLevel": 40,
    "expiryDate": "2027-01-29",
    "supplier": "Alkem Laboratories",
    "purchasePrice": 140,
    "sellingPrice": 185,
    "active": true
  },
  {
    "id": 24,
    "sku": "SKU-MED-024",
    "medicineName": "Azithromycin 500 mg",
    "genericName": "Azithromycin Dihydrate",
    "brandName": "Azithral 500",
    "category": "Medicines",
    "subcategory": "Antibiotics",
    "strength": "500 mg",
    "packSize": "5 Tablets / Strip",
    "batchNumber": "BAT-2026-508",
    "quantity": 72,
    "minimumStockLevel": 40,
    "expiryDate": "2028-03-17",
    "supplier": "Sun Pharma Direct",
    "purchasePrice": 85,
    "sellingPrice": 118.5,
    "active": true
  },
  {
    "id": 25,
    "sku": "SKU-MED-025",
    "medicineName": "Ciprofloxacin 500 mg",
    "genericName": "Ciprofloxacin",
    "brandName": "Cifran 500",
    "category": "Medicines",
    "subcategory": "Antibiotics",
    "strength": "500 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-525",
    "quantity": 11,
    "minimumStockLevel": 25,
    "expiryDate": "2027-09-28",
    "supplier": "Cipla Lifesciences",
    "purchasePrice": 55,
    "sellingPrice": 78,
    "active": true
  },
  {
    "id": 26,
    "sku": "SKU-MED-026",
    "medicineName": "Ofloxacin 200 mg",
    "genericName": "Ofloxacin",
    "brandName": "Oflox 200",
    "category": "Medicines",
    "subcategory": "Antibiotics",
    "strength": "200 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-542",
    "quantity": 142,
    "minimumStockLevel": 40,
    "expiryDate": "2028-04-09",
    "supplier": "Apollo Medical Wholesalers",
    "purchasePrice": 48,
    "sellingPrice": 68,
    "active": true
  },
  {
    "id": 27,
    "sku": "SKU-MED-027",
    "medicineName": "Cefradine 500 mg",
    "genericName": "Cefradine",
    "brandName": "Velocef",
    "category": "Medicines",
    "subcategory": "Antibiotics",
    "strength": "500 mg",
    "packSize": "10 Capsules / Strip",
    "batchNumber": "BAT-2026-559",
    "quantity": 0,
    "minimumStockLevel": 30,
    "expiryDate": "2027-11-21",
    "supplier": "Dr. Reddy's Logistics",
    "purchasePrice": 95,
    "sellingPrice": 130,
    "active": true
  },
  {
    "id": 28,
    "sku": "SKU-MED-028",
    "medicineName": "Cefixime 200 mg",
    "genericName": "Cefixime Trihydrate",
    "brandName": "Taxim-O 200",
    "category": "Medicines",
    "subcategory": "Antibiotics",
    "strength": "200 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-576",
    "quantity": 325,
    "minimumStockLevel": 40,
    "expiryDate": "2026-10-21",
    "supplier": "GSK Healthcare India",
    "purchasePrice": 80,
    "sellingPrice": 112,
    "active": true
  },
  {
    "id": 29,
    "sku": "SKU-MED-029",
    "medicineName": "Doxycycline 100 mg",
    "genericName": "Doxycycline Hyclate",
    "brandName": "Doxypal 100",
    "category": "Medicines",
    "subcategory": "Antibiotics",
    "strength": "100 mg",
    "packSize": "10 Capsules / Strip",
    "batchNumber": "BAT-2026-593",
    "quantity": 210,
    "minimumStockLevel": 40,
    "expiryDate": "2027-05-21",
    "supplier": "Abbott Healthcare",
    "purchasePrice": 42,
    "sellingPrice": 60,
    "active": true
  },
  {
    "id": 30,
    "sku": "SKU-MED-030",
    "medicineName": "Metronidazole 400 mg",
    "genericName": "Metronidazole",
    "brandName": "Flagyl 400",
    "category": "Medicines",
    "subcategory": "Antibiotics",
    "strength": "400 mg",
    "packSize": "15 Tablets / Strip",
    "batchNumber": "BAT-2026-610",
    "quantity": 10,
    "minimumStockLevel": 25,
    "expiryDate": "2027-12-07",
    "supplier": "Mankind Pharma Supply",
    "purchasePrice": 18,
    "sellingPrice": 26,
    "active": true
  },
  {
    "id": 31,
    "sku": "SKU-MED-031",
    "medicineName": "Clarithromycin 500 mg",
    "genericName": "Clarithromycin",
    "brandName": "Claribid 500",
    "category": "Medicines",
    "subcategory": "Antibiotics",
    "strength": "500 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-627",
    "quantity": 348,
    "minimumStockLevel": 40,
    "expiryDate": "2027-11-06",
    "supplier": "Alkem Laboratories",
    "purchasePrice": 180,
    "sellingPrice": 240,
    "active": true
  },
  {
    "id": 32,
    "sku": "SKU-MED-032",
    "medicineName": "Pantoprazole 40 mg",
    "genericName": "Pantoprazole Sodium",
    "brandName": "Pan 40",
    "category": "Medicines",
    "subcategory": "Gastrointestinal",
    "strength": "40 mg",
    "packSize": "15 Tablets / Strip",
    "batchNumber": "BAT-2026-644",
    "quantity": 80,
    "minimumStockLevel": 40,
    "expiryDate": "2027-12-02",
    "supplier": "Sun Pharma Direct",
    "purchasePrice": 70,
    "sellingPrice": 95,
    "active": true
  },
  {
    "id": 33,
    "sku": "SKU-MED-033",
    "medicineName": "Omeprazole 20 mg",
    "genericName": "Omeprazole",
    "brandName": "Omez 20",
    "category": "Medicines",
    "subcategory": "Gastrointestinal",
    "strength": "20 mg",
    "packSize": "20 Capsules / Strip",
    "batchNumber": "BAT-2026-661",
    "quantity": 391,
    "minimumStockLevel": 40,
    "expiryDate": "2026-07-19",
    "supplier": "Cipla Lifesciences",
    "purchasePrice": 38,
    "sellingPrice": 54,
    "active": true
  },
  {
    "id": 34,
    "sku": "SKU-MED-034",
    "medicineName": "Rabeprazole 20 mg",
    "genericName": "Rabeprazole Sodium",
    "brandName": "Rabeloc 20",
    "category": "Medicines",
    "subcategory": "Gastrointestinal",
    "strength": "20 mg",
    "packSize": "15 Tablets / Strip",
    "batchNumber": "BAT-2026-678",
    "quantity": 310,
    "minimumStockLevel": 40,
    "expiryDate": "2028-02-01",
    "supplier": "Apollo Medical Wholesalers",
    "purchasePrice": 65,
    "sellingPrice": 90,
    "active": true
  },
  {
    "id": 35,
    "sku": "SKU-MED-035",
    "medicineName": "Domperidone 10 mg",
    "genericName": "Domperidone",
    "brandName": "Vomitops 10",
    "category": "Medicines",
    "subcategory": "Gastrointestinal",
    "strength": "10 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-695",
    "quantity": 16,
    "minimumStockLevel": 25,
    "expiryDate": "2026-10-14",
    "supplier": "Dr. Reddy's Logistics",
    "purchasePrice": 22,
    "sellingPrice": 32,
    "active": true
  },
  {
    "id": 36,
    "sku": "SKU-MED-036",
    "medicineName": "Ranitidine 150 mg",
    "genericName": "Ranitidine Hydrochloride",
    "brandName": "Rantac 150",
    "category": "Medicines",
    "subcategory": "Gastrointestinal",
    "strength": "150 mg",
    "packSize": "30 Tablets / Strip",
    "batchNumber": "BAT-2026-712",
    "quantity": 0,
    "minimumStockLevel": 30,
    "expiryDate": "2027-06-16",
    "supplier": "GSK Healthcare India",
    "purchasePrice": 20,
    "sellingPrice": 30,
    "active": true
  },
  {
    "id": 37,
    "sku": "SKU-MED-037",
    "medicineName": "Ondansetron 4 mg",
    "genericName": "Ondansetron Hydrochloride",
    "brandName": "Emset 4",
    "category": "Medicines",
    "subcategory": "Gastrointestinal",
    "strength": "4 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-729",
    "quantity": 214,
    "minimumStockLevel": 40,
    "expiryDate": "2027-12-08",
    "supplier": "Abbott Healthcare",
    "purchasePrice": 38,
    "sellingPrice": 52,
    "active": true
  },
  {
    "id": 38,
    "sku": "SKU-MED-038",
    "medicineName": "Loperamide 2 mg",
    "genericName": "Loperamide Hydrochloride",
    "brandName": "Imodium 2",
    "category": "Medicines",
    "subcategory": "Gastrointestinal",
    "strength": "2 mg",
    "packSize": "10 Capsules / Strip",
    "batchNumber": "BAT-2026-746",
    "quantity": 396,
    "minimumStockLevel": 40,
    "expiryDate": "2027-09-25",
    "supplier": "Mankind Pharma Supply",
    "purchasePrice": 18,
    "sellingPrice": 25,
    "active": true
  },
  {
    "id": 39,
    "sku": "SKU-MED-039",
    "medicineName": "Sucralfate Suspension 1000mg/5ml",
    "genericName": "Sucralfate",
    "brandName": "Sucrafil Gel",
    "category": "Medicines",
    "subcategory": "Gastrointestinal",
    "strength": "1000 mg/5 ml",
    "packSize": "200 ml Bottle",
    "batchNumber": "BAT-2026-763",
    "quantity": 302,
    "minimumStockLevel": 40,
    "expiryDate": "2027-08-31",
    "supplier": "Alkem Laboratories",
    "purchasePrice": 140,
    "sellingPrice": 190,
    "active": true
  },
  {
    "id": 40,
    "sku": "SKU-MED-040",
    "medicineName": "Digene Gel Antacid",
    "genericName": "Magnesium / Aluminum Hydroxide",
    "brandName": "Digene Mint Gel",
    "category": "Medicines",
    "subcategory": "Gastrointestinal",
    "strength": "Standard",
    "packSize": "200 ml Bottle",
    "batchNumber": "BAT-2026-780",
    "quantity": 11,
    "minimumStockLevel": 25,
    "expiryDate": "2028-01-06",
    "supplier": "Sun Pharma Direct",
    "purchasePrice": 95,
    "sellingPrice": 130,
    "active": true
  },
  {
    "id": 41,
    "sku": "SKU-MED-041",
    "medicineName": "Dicyclomine 20 mg",
    "genericName": "Dicyclomine Hydrochloride",
    "brandName": "Cyclopam",
    "category": "Medicines",
    "subcategory": "Gastrointestinal",
    "strength": "20 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-797",
    "quantity": 341,
    "minimumStockLevel": 40,
    "expiryDate": "2027-07-24",
    "supplier": "Cipla Lifesciences",
    "purchasePrice": 25,
    "sellingPrice": 36,
    "active": true
  },
  {
    "id": 42,
    "sku": "SKU-MED-042",
    "medicineName": "Cetirizine 10 mg",
    "genericName": "Cetirizine Hydrochloride",
    "brandName": "Cetzine 10",
    "category": "Medicines",
    "subcategory": "Allergy",
    "strength": "10 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-814",
    "quantity": 161,
    "minimumStockLevel": 40,
    "expiryDate": "2026-10-21",
    "supplier": "Apollo Medical Wholesalers",
    "purchasePrice": 28,
    "sellingPrice": 42,
    "active": true
  },
  {
    "id": 43,
    "sku": "SKU-MED-043",
    "medicineName": "Levocetirizine 5 mg",
    "genericName": "Levocetirizine Dihydrochloride",
    "brandName": "Lalhist 5",
    "category": "Medicines",
    "subcategory": "Allergy",
    "strength": "5 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-831",
    "quantity": 180,
    "minimumStockLevel": 40,
    "expiryDate": "2027-06-05",
    "supplier": "Dr. Reddy's Logistics",
    "purchasePrice": 35,
    "sellingPrice": 50,
    "active": true
  },
  {
    "id": 44,
    "sku": "SKU-MED-044",
    "medicineName": "Fexofenadine 120 mg",
    "genericName": "Fexofenadine Hydrochloride",
    "brandName": "Allegra 120",
    "category": "Medicines",
    "subcategory": "Allergy",
    "strength": "120 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-848",
    "quantity": 85,
    "minimumStockLevel": 40,
    "expiryDate": "2026-08-14",
    "supplier": "GSK Healthcare India",
    "purchasePrice": 110,
    "sellingPrice": 155,
    "active": true
  },
  {
    "id": 45,
    "sku": "SKU-MED-045",
    "medicineName": "Loratadine 10 mg",
    "genericName": "Loratadine",
    "brandName": "Claritin 10",
    "category": "Medicines",
    "subcategory": "Allergy",
    "strength": "10 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-865",
    "quantity": 8,
    "minimumStockLevel": 25,
    "expiryDate": "2027-11-22",
    "supplier": "Abbott Healthcare",
    "purchasePrice": 45,
    "sellingPrice": 65,
    "active": true
  },
  {
    "id": 46,
    "sku": "SKU-MED-046",
    "medicineName": "Hydroxyzine 25 mg",
    "genericName": "Hydroxyzine Hydrochloride",
    "brandName": "Atarax 25",
    "category": "Medicines",
    "subcategory": "Allergy",
    "strength": "25 mg",
    "packSize": "15 Tablets / Strip",
    "batchNumber": "BAT-2026-882",
    "quantity": 359,
    "minimumStockLevel": 40,
    "expiryDate": "2027-08-27",
    "supplier": "Mankind Pharma Supply",
    "purchasePrice": 50,
    "sellingPrice": 72,
    "active": true
  },
  {
    "id": 47,
    "sku": "SKU-MED-047",
    "medicineName": "Bilastine 20 mg",
    "genericName": "Bilastine",
    "brandName": "Bila-M",
    "category": "Medicines",
    "subcategory": "Allergy",
    "strength": "20 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-899",
    "quantity": 371,
    "minimumStockLevel": 40,
    "expiryDate": "2028-01-01",
    "supplier": "Alkem Laboratories",
    "purchasePrice": 95,
    "sellingPrice": 135,
    "active": true
  },
  {
    "id": 48,
    "sku": "SKU-MED-048",
    "medicineName": "Montelukast 10 mg",
    "genericName": "Montelukast Sodium",
    "brandName": "Singulair 10",
    "category": "Medicines",
    "subcategory": "Respiratory",
    "strength": "10 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-916",
    "quantity": 287,
    "minimumStockLevel": 40,
    "expiryDate": "2027-06-03",
    "supplier": "Sun Pharma Direct",
    "purchasePrice": 85,
    "sellingPrice": 120,
    "active": true
  },
  {
    "id": 49,
    "sku": "SKU-MED-049",
    "medicineName": "Salbutamol Inhaler 100mcg",
    "genericName": "Albuterol / Salbutamol",
    "brandName": "Asthalin Inhaler",
    "category": "Medicines",
    "subcategory": "Respiratory",
    "strength": "100 mcg/dose",
    "packSize": "200 MDI Doses",
    "batchNumber": "BAT-2026-933",
    "quantity": 327,
    "minimumStockLevel": 40,
    "expiryDate": "2026-09-20",
    "supplier": "Cipla Lifesciences",
    "purchasePrice": 120,
    "sellingPrice": 165,
    "active": true
  },
  {
    "id": 50,
    "sku": "SKU-MED-050",
    "medicineName": "Budesonide Inhaler 200mcg",
    "genericName": "Budesonide",
    "brandName": "Budecort 200",
    "category": "Medicines",
    "subcategory": "Respiratory",
    "strength": "200 mcg/dose",
    "packSize": "200 MDI Doses",
    "batchNumber": "BAT-2026-950",
    "quantity": 17,
    "minimumStockLevel": 25,
    "expiryDate": "2027-12-16",
    "supplier": "Apollo Medical Wholesalers",
    "purchasePrice": 240,
    "sellingPrice": 320,
    "active": true
  },
  {
    "id": 51,
    "sku": "SKU-MED-051",
    "medicineName": "Levosalbutamol Rotacaps",
    "genericName": "Levosalbutamol",
    "brandName": "Levolin Rotacaps",
    "category": "Medicines",
    "subcategory": "Respiratory",
    "strength": "100 mcg",
    "packSize": "30 Rotacaps Box",
    "batchNumber": "BAT-2026-967",
    "quantity": 63,
    "minimumStockLevel": 40,
    "expiryDate": "2027-05-29",
    "supplier": "Dr. Reddy's Logistics",
    "purchasePrice": 70,
    "sellingPrice": 98,
    "active": true
  },
  {
    "id": 52,
    "sku": "SKU-MED-052",
    "medicineName": "Acebrophylline 100 mg",
    "genericName": "Acebrophylline",
    "brandName": "AB Phylline",
    "category": "Medicines",
    "subcategory": "Respiratory",
    "strength": "100 mg",
    "packSize": "10 Capsules / Strip",
    "batchNumber": "BAT-2026-984",
    "quantity": 90,
    "minimumStockLevel": 40,
    "expiryDate": "2028-05-13",
    "supplier": "GSK Healthcare India",
    "purchasePrice": 115,
    "sellingPrice": 160,
    "active": true
  },
  {
    "id": 53,
    "sku": "SKU-MED-053",
    "medicineName": "Ipratropium Respirator Solution",
    "genericName": "Ipratropium Bromide",
    "brandName": "Ipravent Respules",
    "category": "Medicines",
    "subcategory": "Respiratory",
    "strength": "500 mcg/2ml",
    "packSize": "5 Respules Box",
    "batchNumber": "BAT-2026-101",
    "quantity": 210,
    "minimumStockLevel": 40,
    "expiryDate": "2027-07-11",
    "supplier": "Abbott Healthcare",
    "purchasePrice": 60,
    "sellingPrice": 85,
    "active": true
  },
  {
    "id": 54,
    "sku": "SKU-MED-054",
    "medicineName": "Atorvastatin 10 mg",
    "genericName": "Atorvastatin Calcium",
    "brandName": "Atorva 10",
    "category": "Medicines",
    "subcategory": "Cardiovascular",
    "strength": "10 mg",
    "packSize": "15 Tablets / Strip",
    "batchNumber": "BAT-2026-118",
    "quantity": 0,
    "minimumStockLevel": 30,
    "expiryDate": "2027-07-25",
    "supplier": "Mankind Pharma Supply",
    "purchasePrice": 95,
    "sellingPrice": 135,
    "active": true
  },
  {
    "id": 55,
    "sku": "SKU-MED-055",
    "medicineName": "Atorvastatin 20 mg",
    "genericName": "Atorvastatin Calcium",
    "brandName": "Lipitor 20",
    "category": "Medicines",
    "subcategory": "Cardiovascular",
    "strength": "20 mg",
    "packSize": "15 Tablets / Strip",
    "batchNumber": "BAT-2026-135",
    "quantity": 17,
    "minimumStockLevel": 25,
    "expiryDate": "2026-08-15",
    "supplier": "Alkem Laboratories",
    "purchasePrice": 150,
    "sellingPrice": 210,
    "active": true
  },
  {
    "id": 56,
    "sku": "SKU-MED-056",
    "medicineName": "Amlodipine 5 mg",
    "genericName": "Amlodipine Besylate",
    "brandName": "Amlokind 5",
    "category": "Medicines",
    "subcategory": "Cardiovascular",
    "strength": "5 mg",
    "packSize": "15 Tablets / Strip",
    "batchNumber": "BAT-2026-152",
    "quantity": 262,
    "minimumStockLevel": 40,
    "expiryDate": "2026-10-26",
    "supplier": "Sun Pharma Direct",
    "purchasePrice": 26,
    "sellingPrice": 38,
    "active": true
  },
  {
    "id": 57,
    "sku": "SKU-MED-057",
    "medicineName": "Telmisartan 40 mg",
    "genericName": "Telmisartan",
    "brandName": "Telma 40",
    "category": "Medicines",
    "subcategory": "Cardiovascular",
    "strength": "40 mg",
    "packSize": "15 Tablets / Strip",
    "batchNumber": "BAT-2026-169",
    "quantity": 131,
    "minimumStockLevel": 40,
    "expiryDate": "2027-06-17",
    "supplier": "Cipla Lifesciences",
    "purchasePrice": 80,
    "sellingPrice": 110,
    "active": true
  },
  {
    "id": 58,
    "sku": "SKU-MED-058",
    "medicineName": "Losartan 50 mg",
    "genericName": "Losartan Potassium",
    "brandName": "Repace 50",
    "category": "Medicines",
    "subcategory": "Cardiovascular",
    "strength": "50 mg",
    "packSize": "15 Tablets / Strip",
    "batchNumber": "BAT-2026-186",
    "quantity": 270,
    "minimumStockLevel": 40,
    "expiryDate": "2027-12-24",
    "supplier": "Apollo Medical Wholesalers",
    "purchasePrice": 65,
    "sellingPrice": 92,
    "active": true
  },
  {
    "id": 59,
    "sku": "SKU-MED-059",
    "medicineName": "Metoprolol 50 mg",
    "genericName": "Metoprolol Succinate",
    "brandName": "Betaloc 50",
    "category": "Medicines",
    "subcategory": "Cardiovascular",
    "strength": "50 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-203",
    "quantity": 191,
    "minimumStockLevel": 40,
    "expiryDate": "2027-04-28",
    "supplier": "Dr. Reddy's Logistics",
    "purchasePrice": 58,
    "sellingPrice": 82,
    "active": true
  },
  {
    "id": 60,
    "sku": "SKU-MED-060",
    "medicineName": "Ramipril 5 mg",
    "genericName": "Ramipril",
    "brandName": "Cardace 5",
    "category": "Medicines",
    "subcategory": "Cardiovascular",
    "strength": "5 mg",
    "packSize": "15 Tablets / Strip",
    "batchNumber": "BAT-2026-220",
    "quantity": 7,
    "minimumStockLevel": 25,
    "expiryDate": "2027-10-07",
    "supplier": "GSK Healthcare India",
    "purchasePrice": 75,
    "sellingPrice": 105,
    "active": true
  },
  {
    "id": 61,
    "sku": "SKU-MED-061",
    "medicineName": "Rosuvastatin 10 mg",
    "genericName": "Rosuvastatin Calcium",
    "brandName": "Rosuvas 10",
    "category": "Medicines",
    "subcategory": "Cardiovascular",
    "strength": "10 mg",
    "packSize": "15 Tablets / Strip",
    "batchNumber": "BAT-2026-237",
    "quantity": 403,
    "minimumStockLevel": 40,
    "expiryDate": "2028-02-22",
    "supplier": "Abbott Healthcare",
    "purchasePrice": 140,
    "sellingPrice": 195,
    "active": true
  },
  {
    "id": 62,
    "sku": "SKU-MED-062",
    "medicineName": "Clopidogrel 75 mg",
    "genericName": "Clopidogrel Bisulfate",
    "brandName": "Plavix 75",
    "category": "Medicines",
    "subcategory": "Cardiovascular",
    "strength": "75 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-254",
    "quantity": 133,
    "minimumStockLevel": 40,
    "expiryDate": "2027-02-17",
    "supplier": "Mankind Pharma Supply",
    "purchasePrice": 90,
    "sellingPrice": 128,
    "active": true
  },
  {
    "id": 63,
    "sku": "SKU-MED-063",
    "medicineName": "Ecosprin 75 mg",
    "genericName": "Aspirin Gastro-resistant",
    "brandName": "Ecosprin 75",
    "category": "Medicines",
    "subcategory": "Cardiovascular",
    "strength": "75 mg",
    "packSize": "14 Tablets / Strip",
    "batchNumber": "BAT-2026-271",
    "quantity": 0,
    "minimumStockLevel": 30,
    "expiryDate": "2026-10-20",
    "supplier": "Alkem Laboratories",
    "purchasePrice": 8,
    "sellingPrice": 12.5,
    "active": true
  },
  {
    "id": 64,
    "sku": "SKU-MED-064",
    "medicineName": "Metformin 500 mg",
    "genericName": "Metformin Hydrochloride",
    "brandName": "Glycomet 500",
    "category": "Medicines",
    "subcategory": "Diabetes",
    "strength": "500 mg",
    "packSize": "20 Tablets / Strip",
    "batchNumber": "BAT-2026-288",
    "quantity": 372,
    "minimumStockLevel": 40,
    "expiryDate": "2028-03-11",
    "supplier": "Sun Pharma Direct",
    "purchasePrice": 18,
    "sellingPrice": 28,
    "active": true
  },
  {
    "id": 65,
    "sku": "SKU-MED-065",
    "medicineName": "Metformin 850 mg",
    "genericName": "Metformin SR",
    "brandName": "Glycomet SR 850",
    "category": "Medicines",
    "subcategory": "Diabetes",
    "strength": "850 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-305",
    "quantity": 9,
    "minimumStockLevel": 25,
    "expiryDate": "2027-10-09",
    "supplier": "Cipla Lifesciences",
    "purchasePrice": 28,
    "sellingPrice": 40,
    "active": true
  },
  {
    "id": 66,
    "sku": "SKU-MED-066",
    "medicineName": "Glimepiride 1 mg",
    "genericName": "Glimepiride",
    "brandName": "Amaryl 1",
    "category": "Medicines",
    "subcategory": "Diabetes",
    "strength": "1 mg",
    "packSize": "15 Tablets / Strip",
    "batchNumber": "BAT-2026-322",
    "quantity": 168,
    "minimumStockLevel": 40,
    "expiryDate": "2026-07-11",
    "supplier": "Apollo Medical Wholesalers",
    "purchasePrice": 45,
    "sellingPrice": 65,
    "active": true
  },
  {
    "id": 67,
    "sku": "SKU-MED-067",
    "medicineName": "Glimepiride 2 mg",
    "genericName": "Glimepiride",
    "brandName": "Amaryl 2",
    "category": "Medicines",
    "subcategory": "Diabetes",
    "strength": "2 mg",
    "packSize": "15 Tablets / Strip",
    "batchNumber": "BAT-2026-339",
    "quantity": 369,
    "minimumStockLevel": 40,
    "expiryDate": "2028-03-05",
    "supplier": "Dr. Reddy's Logistics",
    "purchasePrice": 60,
    "sellingPrice": 84,
    "active": true
  },
  {
    "id": 68,
    "sku": "SKU-MED-068",
    "medicineName": "Sitagliptin 100 mg",
    "genericName": "Sitagliptin Phosphate",
    "brandName": "Januvia 100",
    "category": "Medicines",
    "subcategory": "Diabetes",
    "strength": "100 mg",
    "packSize": "7 Tablets / Strip",
    "batchNumber": "BAT-2026-356",
    "quantity": 76,
    "minimumStockLevel": 40,
    "expiryDate": "2027-09-29",
    "supplier": "GSK Healthcare India",
    "purchasePrice": 220,
    "sellingPrice": 295,
    "active": true
  },
  {
    "id": 69,
    "sku": "SKU-MED-069",
    "medicineName": "Vildagliptin 50 mg",
    "genericName": "Vildagliptin",
    "brandName": "Galvus 50",
    "category": "Medicines",
    "subcategory": "Diabetes",
    "strength": "50 mg",
    "packSize": "14 Tablets / Strip",
    "batchNumber": "BAT-2026-373",
    "quantity": 433,
    "minimumStockLevel": 40,
    "expiryDate": "2027-07-28",
    "supplier": "Abbott Healthcare",
    "purchasePrice": 180,
    "sellingPrice": 245,
    "active": true
  },
  {
    "id": 70,
    "sku": "SKU-MED-070",
    "medicineName": "Dapagliflozin 10 mg",
    "genericName": "Dapagliflozin",
    "brandName": "Forxiga 10",
    "category": "Medicines",
    "subcategory": "Diabetes",
    "strength": "10 mg",
    "packSize": "14 Tablets / Strip",
    "batchNumber": "BAT-2026-390",
    "quantity": 6,
    "minimumStockLevel": 25,
    "expiryDate": "2026-09-13",
    "supplier": "Mankind Pharma Supply",
    "purchasePrice": 340,
    "sellingPrice": 450,
    "active": true
  },
  {
    "id": 71,
    "sku": "SKU-MED-071",
    "medicineName": "Teneligliptin 20 mg",
    "genericName": "Teneligliptin Hydrobromide",
    "brandName": "Zita Plus 20",
    "category": "Medicines",
    "subcategory": "Diabetes",
    "strength": "20 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-407",
    "quantity": 63,
    "minimumStockLevel": 40,
    "expiryDate": "2027-12-28",
    "supplier": "Alkem Laboratories",
    "purchasePrice": 70,
    "sellingPrice": 98,
    "active": true
  },
  {
    "id": 72,
    "sku": "SKU-MED-072",
    "medicineName": "Permethrin Cream 5% w/w",
    "genericName": "Permethrin Anti-scabies",
    "brandName": "Scaboma Cream",
    "category": "Medicines",
    "subcategory": "Dermatology",
    "strength": "5% w/w",
    "packSize": "30 g Tube",
    "batchNumber": "BAT-2026-424",
    "quantity": 0,
    "minimumStockLevel": 30,
    "expiryDate": "2027-12-08",
    "supplier": "Sun Pharma Direct",
    "purchasePrice": 50,
    "sellingPrice": 72,
    "active": true
  },
  {
    "id": 73,
    "sku": "SKU-MED-073",
    "medicineName": "Clobetasol Propionate Cream",
    "genericName": "Clobetasol Corticosteroid",
    "brandName": "Tenovate Cream",
    "category": "Medicines",
    "subcategory": "Dermatology",
    "strength": "0.05% w/w",
    "packSize": "30 g Tube",
    "batchNumber": "BAT-2026-441",
    "quantity": 328,
    "minimumStockLevel": 40,
    "expiryDate": "2027-10-11",
    "supplier": "Cipla Lifesciences",
    "purchasePrice": 65,
    "sellingPrice": 90,
    "active": true
  },
  {
    "id": 74,
    "sku": "SKU-MED-074",
    "medicineName": "Clotrimazole Antifungal Powder",
    "genericName": "Clotrimazole Dusting Powder",
    "brandName": "Candid Powder",
    "category": "Medicines",
    "subcategory": "Dermatology",
    "strength": "1% w/w",
    "packSize": "100 g Container",
    "batchNumber": "BAT-2026-458",
    "quantity": 96,
    "minimumStockLevel": 40,
    "expiryDate": "2027-10-22",
    "supplier": "Apollo Medical Wholesalers",
    "purchasePrice": 80,
    "sellingPrice": 115,
    "active": true
  },
  {
    "id": 75,
    "sku": "SKU-MED-075",
    "medicineName": "Fusidic Acid Ointment",
    "genericName": "Fusidic Acid Topical",
    "brandName": "Fucidin 2%",
    "category": "Medicines",
    "subcategory": "Dermatology",
    "strength": "2% w/w",
    "packSize": "15 g Tube",
    "batchNumber": "BAT-2026-475",
    "quantity": 3,
    "minimumStockLevel": 25,
    "expiryDate": "2027-03-13",
    "supplier": "Dr. Reddy's Logistics",
    "purchasePrice": 95,
    "sellingPrice": 135,
    "active": true
  },
  {
    "id": 76,
    "sku": "SKU-MED-076",
    "medicineName": "Ketoconazole Shampoo 2%",
    "genericName": "Ketoconazole Anti-dandruff",
    "brandName": "Nizral Shampoo",
    "category": "Medicines",
    "subcategory": "Dermatology",
    "strength": "2% v/v",
    "packSize": "100 ml Bottle",
    "batchNumber": "BAT-2026-492",
    "quantity": 67,
    "minimumStockLevel": 40,
    "expiryDate": "2027-08-10",
    "supplier": "GSK Healthcare India",
    "purchasePrice": 180,
    "sellingPrice": 245,
    "active": true
  },
  {
    "id": 77,
    "sku": "SKU-MED-077",
    "medicineName": "Mupirocin Ointment 2%",
    "genericName": "Mupirocin Antibacterial",
    "brandName": "Bactroban Ointment",
    "category": "Medicines",
    "subcategory": "Dermatology",
    "strength": "2% w/w",
    "packSize": "5 g Tube",
    "batchNumber": "BAT-2026-509",
    "quantity": 166,
    "minimumStockLevel": 40,
    "expiryDate": "2026-06-26",
    "supplier": "Abbott Healthcare",
    "purchasePrice": 85,
    "sellingPrice": 120,
    "active": true
  },
  {
    "id": 78,
    "sku": "SKU-MED-078",
    "medicineName": "Luliconazole Cream 1%",
    "genericName": "Luliconazole Antifungal",
    "brandName": "Lulican Cream",
    "category": "Medicines",
    "subcategory": "Dermatology",
    "strength": "1% w/w",
    "packSize": "30 g Tube",
    "batchNumber": "BAT-2026-526",
    "quantity": 439,
    "minimumStockLevel": 40,
    "expiryDate": "2027-03-07",
    "supplier": "Mankind Pharma Supply",
    "purchasePrice": 195,
    "sellingPrice": 260,
    "active": true
  },
  {
    "id": 79,
    "sku": "SKU-MED-079",
    "medicineName": "Hydrocortisone Cream 1%",
    "genericName": "Hydrocortisone Acetate",
    "brandName": "Cortizone 1%",
    "category": "Medicines",
    "subcategory": "Dermatology",
    "strength": "1% w/w",
    "packSize": "15 g Tube",
    "batchNumber": "BAT-2026-543",
    "quantity": 172,
    "minimumStockLevel": 40,
    "expiryDate": "2027-08-10",
    "supplier": "Alkem Laboratories",
    "purchasePrice": 40,
    "sellingPrice": 58,
    "active": true
  },
  {
    "id": 80,
    "sku": "SKU-WEL-080",
    "medicineName": "Vitamin D3 60000 IU",
    "genericName": "Cholecalciferol",
    "brandName": "Calcirol Sachet",
    "category": "Wellness & Supplements",
    "subcategory": "Vitamins",
    "strength": "60000 IU",
    "packSize": "1 g Granules Sachet",
    "batchNumber": "BAT-2026-560",
    "quantity": 9,
    "minimumStockLevel": 25,
    "expiryDate": "2028-03-07",
    "supplier": "Sun Pharma Direct",
    "purchasePrice": 42,
    "sellingPrice": 65,
    "active": true
  },
  {
    "id": 81,
    "sku": "SKU-WEL-081",
    "medicineName": "Vitamin B12 1500 mcg",
    "genericName": "Methylcobalamin",
    "brandName": "Nurokind OD",
    "category": "Wellness & Supplements",
    "subcategory": "Vitamins",
    "strength": "1500 mcg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-577",
    "quantity": 0,
    "minimumStockLevel": 30,
    "expiryDate": "2027-12-14",
    "supplier": "Cipla Lifesciences",
    "purchasePrice": 90,
    "sellingPrice": 130,
    "active": true
  },
  {
    "id": 82,
    "sku": "SKU-WEL-082",
    "medicineName": "Vitamin C 500 mg Chewable",
    "genericName": "Ascorbic Acid",
    "brandName": "Celin 500",
    "category": "Wellness & Supplements",
    "subcategory": "Vitamins",
    "strength": "500 mg",
    "packSize": "20 Tablets / Strip",
    "batchNumber": "BAT-2026-594",
    "quantity": 60,
    "minimumStockLevel": 40,
    "expiryDate": "2028-01-24",
    "supplier": "Apollo Medical Wholesalers",
    "purchasePrice": 25,
    "sellingPrice": 38,
    "active": true
  },
  {
    "id": 83,
    "sku": "SKU-WEL-083",
    "medicineName": "Vitamin E 400 mg",
    "genericName": "Evion Tocopheryl Acetate",
    "brandName": "Evion 400",
    "category": "Wellness & Supplements",
    "subcategory": "Vitamins",
    "strength": "400 mg",
    "packSize": "10 Softgels / Strip",
    "batchNumber": "BAT-2026-611",
    "quantity": 131,
    "minimumStockLevel": 40,
    "expiryDate": "2027-12-14",
    "supplier": "Dr. Reddy's Logistics",
    "purchasePrice": 22,
    "sellingPrice": 32,
    "active": true
  },
  {
    "id": 84,
    "sku": "SKU-WEL-084",
    "medicineName": "Multivitamin A to Z Capsules",
    "genericName": "Multivitamin Complex",
    "brandName": "Becadexamin",
    "category": "Wellness & Supplements",
    "subcategory": "Vitamins",
    "strength": "Standard",
    "packSize": "30 Softgels / Bottle",
    "batchNumber": "BAT-2026-628",
    "quantity": 129,
    "minimumStockLevel": 40,
    "expiryDate": "2026-09-16",
    "supplier": "GSK Healthcare India",
    "purchasePrice": 35,
    "sellingPrice": 52,
    "active": true
  },
  {
    "id": 85,
    "sku": "SKU-WEL-085",
    "medicineName": "B-Complex + Folic Acid",
    "genericName": "B-Complex Capsules",
    "brandName": "Becosules Z",
    "category": "Wellness & Supplements",
    "subcategory": "Vitamins",
    "strength": "Standard",
    "packSize": "20 Capsules / Strip",
    "batchNumber": "BAT-2026-645",
    "quantity": 8,
    "minimumStockLevel": 25,
    "expiryDate": "2027-05-30",
    "supplier": "Abbott Healthcare",
    "purchasePrice": 30,
    "sellingPrice": 45,
    "active": true
  },
  {
    "id": 86,
    "sku": "SKU-WEL-086",
    "medicineName": "Vitamin A 25000 IU",
    "genericName": "Retinol Palmitate",
    "brandName": "Aquasol A",
    "category": "Wellness & Supplements",
    "subcategory": "Vitamins",
    "strength": "25000 IU",
    "packSize": "30 Capsules / Bottle",
    "batchNumber": "BAT-2026-662",
    "quantity": 435,
    "minimumStockLevel": 40,
    "expiryDate": "2027-09-29",
    "supplier": "Mankind Pharma Supply",
    "purchasePrice": 28,
    "sellingPrice": 42,
    "active": true
  },
  {
    "id": 87,
    "sku": "SKU-WEL-087",
    "medicineName": "Vitamin K1 Phytomenadione 10 mg",
    "genericName": "Phytonadione Vitamin K",
    "brandName": "K-Stat 10",
    "category": "Wellness & Supplements",
    "subcategory": "Vitamins",
    "strength": "10 mg",
    "packSize": "10 Ampoules Box",
    "batchNumber": "BAT-2026-679",
    "quantity": 249,
    "minimumStockLevel": 40,
    "expiryDate": "2027-11-20",
    "supplier": "Alkem Laboratories",
    "purchasePrice": 120,
    "sellingPrice": 165,
    "active": true
  },
  {
    "id": 88,
    "sku": "SKU-WEL-088",
    "medicineName": "Calcium Carbonate + Vitamin D3",
    "genericName": "Calcium / Cholecalciferol",
    "brandName": "Shelcal 500",
    "category": "Wellness & Supplements",
    "subcategory": "Minerals",
    "strength": "500 mg + 250 IU",
    "packSize": "15 Tablets / Strip",
    "batchNumber": "BAT-2026-696",
    "quantity": 377,
    "minimumStockLevel": 40,
    "expiryDate": "2026-07-16",
    "supplier": "Sun Pharma Direct",
    "purchasePrice": 75,
    "sellingPrice": 108,
    "active": true
  },
  {
    "id": 89,
    "sku": "SKU-WEL-089",
    "medicineName": "Zinc Sulfate 50 mg",
    "genericName": "Zinc Elemental",
    "brandName": "Zincotabs",
    "category": "Wellness & Supplements",
    "subcategory": "Minerals",
    "strength": "50 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-713",
    "quantity": 85,
    "minimumStockLevel": 40,
    "expiryDate": "2027-11-16",
    "supplier": "Cipla Lifesciences",
    "purchasePrice": 20,
    "sellingPrice": 30,
    "active": true
  },
  {
    "id": 90,
    "sku": "SKU-WEL-090",
    "medicineName": "Ferrous Ascorbate + Folic Acid",
    "genericName": "Iron Supplement",
    "brandName": "Orofer XT",
    "category": "Wellness & Supplements",
    "subcategory": "Minerals",
    "strength": "100 mg + 1.5 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-730",
    "quantity": 10,
    "minimumStockLevel": 25,
    "expiryDate": "2027-04-24",
    "supplier": "Apollo Medical Wholesalers",
    "purchasePrice": 110,
    "sellingPrice": 155,
    "active": true
  },
  {
    "id": 91,
    "sku": "SKU-WEL-091",
    "medicineName": "Magnesium Glycinate 250 mg",
    "genericName": "Magnesium Supplement",
    "brandName": "MagEnhance",
    "category": "Wellness & Supplements",
    "subcategory": "Minerals",
    "strength": "250 mg",
    "packSize": "30 Tablets / Bottle",
    "batchNumber": "BAT-2026-747",
    "quantity": 288,
    "minimumStockLevel": 40,
    "expiryDate": "2026-09-12",
    "supplier": "Dr. Reddy's Logistics",
    "purchasePrice": 250,
    "sellingPrice": 340,
    "active": true
  },
  {
    "id": 92,
    "sku": "SKU-WEL-092",
    "medicineName": "Potassium Chloride Chloride 600 mg",
    "genericName": "Potassium Supplement",
    "brandName": "Potchlor 600",
    "category": "Wellness & Supplements",
    "subcategory": "Minerals",
    "strength": "600 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-764",
    "quantity": 364,
    "minimumStockLevel": 40,
    "expiryDate": "2028-02-22",
    "supplier": "GSK Healthcare India",
    "purchasePrice": 38,
    "sellingPrice": 55,
    "active": true
  },
  {
    "id": 93,
    "sku": "SKU-WEL-093",
    "medicineName": "Selenium + Vitamin E Complex",
    "genericName": "Antioxidant Minerals",
    "brandName": "Selace Forte",
    "category": "Wellness & Supplements",
    "subcategory": "Minerals",
    "strength": "Standard",
    "packSize": "10 Capsules / Strip",
    "batchNumber": "BAT-2026-781",
    "quantity": 229,
    "minimumStockLevel": 40,
    "expiryDate": "2027-05-11",
    "supplier": "Abbott Healthcare",
    "purchasePrice": 85,
    "sellingPrice": 120,
    "active": true
  },
  {
    "id": 94,
    "sku": "SKU-WEL-094",
    "medicineName": "Protein Powder Vanilla 400g",
    "genericName": "Whey / Soy Protein Supplement",
    "brandName": "Protinex Original",
    "category": "Wellness & Supplements",
    "subcategory": "Nutritional Supplements",
    "strength": "400 g",
    "packSize": "400 g Tin",
    "batchNumber": "BAT-2026-798",
    "quantity": 268,
    "minimumStockLevel": 40,
    "expiryDate": "2027-03-14",
    "supplier": "Mankind Pharma Supply",
    "purchasePrice": 450,
    "sellingPrice": 595,
    "active": true
  },
  {
    "id": 95,
    "sku": "SKU-WEL-095",
    "medicineName": "Omega-3 Fish Oil 1000 mg",
    "genericName": "EPA / DHA Softgels",
    "brandName": "Seven Seas Cod Liver",
    "category": "Wellness & Supplements",
    "subcategory": "Nutritional Supplements",
    "strength": "1000 mg",
    "packSize": "60 Softgels / Bottle",
    "batchNumber": "BAT-2026-815",
    "quantity": 8,
    "minimumStockLevel": 25,
    "expiryDate": "2027-05-26",
    "supplier": "Alkem Laboratories",
    "purchasePrice": 320,
    "sellingPrice": 445,
    "active": true
  },
  {
    "id": 96,
    "sku": "SKU-WEL-096",
    "medicineName": "Coenzyme Q10 100 mg",
    "genericName": "CoQ10 Antioxidant",
    "brandName": "UbiQ 100",
    "category": "Wellness & Supplements",
    "subcategory": "Nutritional Supplements",
    "strength": "100 mg",
    "packSize": "10 Softgels / Strip",
    "batchNumber": "BAT-2026-832",
    "quantity": 225,
    "minimumStockLevel": 40,
    "expiryDate": "2027-06-13",
    "supplier": "Sun Pharma Direct",
    "purchasePrice": 420,
    "sellingPrice": 580,
    "active": true
  },
  {
    "id": 97,
    "sku": "SKU-WEL-097",
    "medicineName": "Glucosamine + Chondroitin",
    "genericName": "Joint Support Complex",
    "brandName": "Jointace DN",
    "category": "Wellness & Supplements",
    "subcategory": "Nutritional Supplements",
    "strength": "750 mg + 400 mg",
    "packSize": "10 Tablets / Strip",
    "batchNumber": "BAT-2026-849",
    "quantity": 322,
    "minimumStockLevel": 40,
    "expiryDate": "2027-10-11",
    "supplier": "Cipla Lifesciences",
    "purchasePrice": 210,
    "sellingPrice": 290,
    "active": true
  },
  {
    "id": 98,
    "sku": "SKU-WEL-098",
    "medicineName": "ORS Electrolyte Powder Apple",
    "genericName": "Oral Rehydration Salts",
    "brandName": "Electral Powder",
    "category": "Wellness & Supplements",
    "subcategory": "ORS & Hydration",
    "strength": "21.8 g Sachet",
    "packSize": "Single Sachet",
    "batchNumber": "BAT-2026-866",
    "quantity": 265,
    "minimumStockLevel": 40,
    "expiryDate": "2026-09-20",
    "supplier": "Apollo Medical Wholesalers",
    "purchasePrice": 15,
    "sellingPrice": 22,
    "active": true
  },
  {
    "id": 99,
    "sku": "SKU-WEL-099",
    "medicineName": "ORS Ready-to-drink Orange Liquid",
    "genericName": "Ready ORS Drink",
    "brandName": "Enerzal Liquid",
    "category": "Wellness & Supplements",
    "subcategory": "ORS & Hydration",
    "strength": "200 ml",
    "packSize": "200 ml Tetra Pack",
    "batchNumber": "BAT-2026-883",
    "quantity": 0,
    "minimumStockLevel": 30,
    "expiryDate": "2026-08-02",
    "supplier": "Dr. Reddy's Logistics",
    "purchasePrice": 25,
    "sellingPrice": 35,
    "active": true
  },
  {
    "id": 100,
    "sku": "SKU-WEL-100",
    "medicineName": "Glucose Powder D 500g",
    "genericName": "Dextrose Monohydrate",
    "brandName": "Dabur Glucose-D",
    "category": "Wellness & Supplements",
    "subcategory": "ORS & Hydration",
    "strength": "500 g",
    "packSize": "500 g Refill Pack",
    "batchNumber": "BAT-2026-900",
    "quantity": 10,
    "minimumStockLevel": 25,
    "expiryDate": "2027-05-03",
    "supplier": "GSK Healthcare India",
    "purchasePrice": 85,
    "sellingPrice": 120,
    "active": true
  },
  {
    "id": 101,
    "sku": "SKU-MED-101",
    "medicineName": "Antiseptic Solution 500ml",
    "genericName": "Chlorhexidine / Cetrimide",
    "brandName": "Savlon Liquid",
    "category": "Medical Supplies",
    "subcategory": "First Aid",
    "strength": "500 ml",
    "packSize": "500 ml Bottle",
    "batchNumber": "BAT-2026-917",
    "quantity": 385,
    "minimumStockLevel": 40,
    "expiryDate": "2027-11-26",
    "supplier": "Abbott Healthcare",
    "purchasePrice": 110,
    "sellingPrice": 155,
    "active": true
  },
  {
    "id": 102,
    "sku": "SKU-MED-102",
    "medicineName": "Dettol Antiseptic Liquid 250ml",
    "genericName": "Chloroxylenol Antiseptic",
    "brandName": "Dettol Liquid",
    "category": "Medical Supplies",
    "subcategory": "First Aid",
    "strength": "250 ml",
    "packSize": "250 ml Bottle",
    "batchNumber": "BAT-2026-934",
    "quantity": 97,
    "minimumStockLevel": 40,
    "expiryDate": "2027-02-16",
    "supplier": "Mankind Pharma Supply",
    "purchasePrice": 90,
    "sellingPrice": 125,
    "active": true
  },
  {
    "id": 103,
    "sku": "SKU-MED-103",
    "medicineName": "Povidone-Iodine Ointment 5%",
    "genericName": "Povidone-Iodine Antiseptic",
    "brandName": "Betadine Ointment",
    "category": "Medical Supplies",
    "subcategory": "First Aid",
    "strength": "5% w/w",
    "packSize": "15 g Tube",
    "batchNumber": "BAT-2026-951",
    "quantity": 61,
    "minimumStockLevel": 40,
    "expiryDate": "2027-08-19",
    "supplier": "Alkem Laboratories",
    "purchasePrice": 42,
    "sellingPrice": 60,
    "active": true
  },
  {
    "id": 104,
    "sku": "SKU-MED-104",
    "medicineName": "Povidone-Iodine Solution 10%",
    "genericName": "Povidone-Iodine Liquid",
    "brandName": "Betadine Solution",
    "category": "Medical Supplies",
    "subcategory": "First Aid",
    "strength": "10% v/v",
    "packSize": "100 ml Bottle",
    "batchNumber": "BAT-2026-968",
    "quantity": 112,
    "minimumStockLevel": 40,
    "expiryDate": "2028-05-12",
    "supplier": "Sun Pharma Direct",
    "purchasePrice": 80,
    "sellingPrice": 112,
    "active": true
  },
  {
    "id": 105,
    "sku": "SKU-MED-105",
    "medicineName": "Hydrogen Peroxide Solution 3%",
    "genericName": "Hydrogen Peroxide USP",
    "brandName": "Apex Peroxide",
    "category": "Medical Supplies",
    "subcategory": "First Aid",
    "strength": "3% v/v",
    "packSize": "400 ml Bottle",
    "batchNumber": "BAT-2026-985",
    "quantity": 10,
    "minimumStockLevel": 25,
    "expiryDate": "2026-10-21",
    "supplier": "Cipla Lifesciences",
    "purchasePrice": 30,
    "sellingPrice": 45,
    "active": true
  },
  {
    "id": 106,
    "sku": "SKU-MED-106",
    "medicineName": "Burn Healing Ointment 15g",
    "genericName": "Silver Sulfadiazine",
    "brandName": "Burnol Cream",
    "category": "Medical Supplies",
    "subcategory": "First Aid",
    "strength": "1% w/w",
    "packSize": "15 g Tube",
    "batchNumber": "BAT-2026-102",
    "quantity": 94,
    "minimumStockLevel": 40,
    "expiryDate": "2027-07-21",
    "supplier": "Apollo Medical Wholesalers",
    "purchasePrice": 35,
    "sellingPrice": 50,
    "active": true
  },
  {
    "id": 107,
    "sku": "SKU-MED-107",
    "medicineName": "Sterile Absorbent Cotton Wool",
    "genericName": "Surgical Cotton",
    "brandName": "Absorb Cotton 100g",
    "category": "Medical Supplies",
    "subcategory": "Bandages & Dressings",
    "strength": "100 g",
    "packSize": "100 g Roll",
    "batchNumber": "BAT-2026-119",
    "quantity": 285,
    "minimumStockLevel": 40,
    "expiryDate": "2027-02-05",
    "supplier": "Dr. Reddy's Logistics",
    "purchasePrice": 35,
    "sellingPrice": 50,
    "active": true
  },
  {
    "id": 108,
    "sku": "SKU-MED-108",
    "medicineName": "Sterile Gauze Swabs 7.5cm",
    "genericName": "Sterile Surgical Gauze",
    "brandName": "Gauze Swab Pack",
    "category": "Medical Supplies",
    "subcategory": "Bandages & Dressings",
    "strength": "7.5 x 7.5 cm",
    "packSize": "Pack of 10 Swabs",
    "batchNumber": "BAT-2026-136",
    "quantity": 0,
    "minimumStockLevel": 30,
    "expiryDate": "2027-08-14",
    "supplier": "GSK Healthcare India",
    "purchasePrice": 25,
    "sellingPrice": 38,
    "active": true
  },
  {
    "id": 109,
    "sku": "SKU-MED-109",
    "medicineName": "Adhesive Bandage Strips",
    "genericName": "First Aid Band-aid",
    "brandName": "Band-Aid Tough",
    "category": "Medical Supplies",
    "subcategory": "Bandages & Dressings",
    "strength": "Standard",
    "packSize": "Box of 100 Strips",
    "batchNumber": "BAT-2026-153",
    "quantity": 71,
    "minimumStockLevel": 40,
    "expiryDate": "2027-04-07",
    "supplier": "Abbott Healthcare",
    "purchasePrice": 120,
    "sellingPrice": 170,
    "active": true
  },
  {
    "id": 110,
    "sku": "SKU-MED-110",
    "medicineName": "Elastic Crepe Bandage 10cm",
    "genericName": "Crepe Compression Bandage",
    "brandName": "Hansaplast Crepe",
    "category": "Medical Supplies",
    "subcategory": "Bandages & Dressings",
    "strength": "10 cm x 4 m",
    "packSize": "Single Roll Box",
    "batchNumber": "BAT-2026-170",
    "quantity": 4,
    "minimumStockLevel": 25,
    "expiryDate": "2026-08-04",
    "supplier": "Mankind Pharma Supply",
    "purchasePrice": 140,
    "sellingPrice": 195,
    "active": true
  },
  {
    "id": 111,
    "sku": "SKU-MED-111",
    "medicineName": "Microporous Surgical Paper Tape",
    "genericName": "Medical Paper Tape",
    "brandName": "3M Micropore 1 inch",
    "category": "Medical Supplies",
    "subcategory": "Bandages & Dressings",
    "strength": "1 inch x 9.1 m",
    "packSize": "Single Box Roll",
    "batchNumber": "BAT-2026-187",
    "quantity": 343,
    "minimumStockLevel": 40,
    "expiryDate": "2027-10-30",
    "supplier": "Alkem Laboratories",
    "purchasePrice": 45,
    "sellingPrice": 65,
    "active": true
  },
  {
    "id": 112,
    "sku": "SKU-MED-112",
    "medicineName": "Disposable Examination Gloves Latex M",
    "genericName": "Latex Powdered Gloves",
    "brandName": "Kanam Latex M",
    "category": "Medical Supplies",
    "subcategory": "Gloves",
    "strength": "Medium Size",
    "packSize": "Box of 100 Gloves",
    "batchNumber": "BAT-2026-204",
    "quantity": 255,
    "minimumStockLevel": 40,
    "expiryDate": "2026-10-23",
    "supplier": "Sun Pharma Direct",
    "purchasePrice": 320,
    "sellingPrice": 450,
    "active": true
  },
  {
    "id": 113,
    "sku": "SKU-MED-113",
    "medicineName": "Disposable Nitrile Gloves Powder-Free L",
    "genericName": "Nitrile Blue Gloves",
    "brandName": "Safetouch Nitrile L",
    "category": "Medical Supplies",
    "subcategory": "Gloves",
    "strength": "Large Size",
    "packSize": "Box of 100 Gloves",
    "batchNumber": "BAT-2026-221",
    "quantity": 114,
    "minimumStockLevel": 40,
    "expiryDate": "2028-02-28",
    "supplier": "Cipla Lifesciences",
    "purchasePrice": 480,
    "sellingPrice": 650,
    "active": true
  },
  {
    "id": 114,
    "sku": "SKU-MED-114",
    "medicineName": "Sterile Surgical Gloves Pair Size 7.5",
    "genericName": "Sterile Latex Surgical",
    "brandName": "Surgeon Pair 7.5",
    "category": "Medical Supplies",
    "subcategory": "Gloves",
    "strength": "Size 7.5",
    "packSize": "1 Pair Pack",
    "batchNumber": "BAT-2026-238",
    "quantity": 104,
    "minimumStockLevel": 40,
    "expiryDate": "2028-04-06",
    "supplier": "Apollo Medical Wholesalers",
    "purchasePrice": 28,
    "sellingPrice": 42,
    "active": true
  },
  {
    "id": 115,
    "sku": "SKU-MED-115",
    "medicineName": "Disposable Syringe 2 ml with Needle 24G",
    "genericName": "Luer Mount Syringe",
    "brandName": "Dispovan 2ml",
    "category": "Medical Supplies",
    "subcategory": "Syringes",
    "strength": "2 ml / 24G",
    "packSize": "Box of 100 Syringes",
    "batchNumber": "BAT-2026-255",
    "quantity": 16,
    "minimumStockLevel": 25,
    "expiryDate": "2027-07-18",
    "supplier": "Dr. Reddy's Logistics",
    "purchasePrice": 280,
    "sellingPrice": 390,
    "active": true
  },
  {
    "id": 116,
    "sku": "SKU-MED-116",
    "medicineName": "Disposable Syringe 5 ml with Needle 23G",
    "genericName": "Luer Mount Syringe",
    "brandName": "Dispovan 5ml",
    "category": "Medical Supplies",
    "subcategory": "Syringes",
    "strength": "5 ml / 23G",
    "packSize": "Box of 100 Syringes",
    "batchNumber": "BAT-2026-272",
    "quantity": 141,
    "minimumStockLevel": 40,
    "expiryDate": "2028-02-15",
    "supplier": "GSK Healthcare India",
    "purchasePrice": 340,
    "sellingPrice": 470,
    "active": true
  },
  {
    "id": 117,
    "sku": "SKU-MED-117",
    "medicineName": "Insulin Syringe 1 ml U-40 31G",
    "genericName": "Fixed Needle Insulin Syringe",
    "brandName": "BD Ultra-Fine 1ml",
    "category": "Medical Supplies",
    "subcategory": "Syringes",
    "strength": "40 Units / 31G",
    "packSize": "Pack of 10 Syringes",
    "batchNumber": "BAT-2026-289",
    "quantity": 0,
    "minimumStockLevel": 30,
    "expiryDate": "2027-07-21",
    "supplier": "Abbott Healthcare",
    "purchasePrice": 110,
    "sellingPrice": 155,
    "active": true
  },
  {
    "id": 118,
    "sku": "SKU-MED-118",
    "medicineName": "Rubbing Alcohol Hand Sanitizer 500ml",
    "genericName": "Isopropyl Alcohol 70%",
    "brandName": "Sterillium Gel",
    "category": "Medical Supplies",
    "subcategory": "Antiseptics",
    "strength": "70% v/v",
    "packSize": "500 ml Pump Bottle",
    "batchNumber": "BAT-2026-306",
    "quantity": 138,
    "minimumStockLevel": 40,
    "expiryDate": "2027-05-08",
    "supplier": "Mankind Pharma Supply",
    "purchasePrice": 160,
    "sellingPrice": 225,
    "active": true
  },
  {
    "id": 119,
    "sku": "SKU-MED-119",
    "medicineName": "Chlorhexidine Mouthwash 0.2%",
    "genericName": "Chlorhexidine Gluconate",
    "brandName": "Rexidin Mouthwash",
    "category": "Medical Supplies",
    "subcategory": "Antiseptics",
    "strength": "0.2% v/v",
    "packSize": "150 ml Bottle",
    "batchNumber": "BAT-2026-323",
    "quantity": 435,
    "minimumStockLevel": 40,
    "expiryDate": "2026-09-12",
    "supplier": "Alkem Laboratories",
    "purchasePrice": 75,
    "sellingPrice": 108,
    "active": true
  },
  {
    "id": 120,
    "sku": "SKU-MED-120",
    "medicineName": "Digital Clinical Thermometer",
    "genericName": "Rigid Tip Thermometer",
    "brandName": "Dr. Morepen Digiflex",
    "category": "Medical Supplies",
    "subcategory": "Other Medical Supplies",
    "strength": "Oral/Axillary",
    "packSize": "Single Device Box",
    "batchNumber": "BAT-2026-340",
    "quantity": 13,
    "minimumStockLevel": 25,
    "expiryDate": "2027-11-28",
    "supplier": "Sun Pharma Direct",
    "purchasePrice": 180,
    "sellingPrice": 260,
    "active": true
  },
  {
    "id": 121,
    "sku": "SKU-MED-121",
    "medicineName": "Blood Pressure Monitor Automatic",
    "genericName": "Digital Upper Arm BPM",
    "brandName": "Omron HEM-7120",
    "category": "Medical Supplies",
    "subcategory": "Other Medical Supplies",
    "strength": "Automatic",
    "packSize": "Single Device Box",
    "batchNumber": "BAT-2026-357",
    "quantity": 265,
    "minimumStockLevel": 40,
    "expiryDate": "2026-07-25",
    "supplier": "Cipla Lifesciences",
    "purchasePrice": 1650,
    "sellingPrice": 2190,
    "active": true
  },
  {
    "id": 122,
    "sku": "SKU-MED-122",
    "medicineName": "Pulse Oximeter Fingertip Digital",
    "genericName": "SpO2 / Pulse Rate Monitor",
    "brandName": "Beurer PO 30",
    "category": "Medical Supplies",
    "subcategory": "Other Medical Supplies",
    "strength": "OLED Display",
    "packSize": "Single Device Box",
    "batchNumber": "BAT-2026-374",
    "quantity": 144,
    "minimumStockLevel": 40,
    "expiryDate": "2027-04-02",
    "supplier": "Apollo Medical Wholesalers",
    "purchasePrice": 850,
    "sellingPrice": 1250,
    "active": true
  },
  {
    "id": 123,
    "sku": "SKU-MED-123",
    "medicineName": "Blood Glucose Test Strips 50s",
    "genericName": "Glucometer Strips",
    "brandName": "Accu-Chek Active 50s",
    "category": "Medical Supplies",
    "subcategory": "Other Medical Supplies",
    "strength": "50 Strips",
    "packSize": "Vial of 50 Strips",
    "batchNumber": "BAT-2026-391",
    "quantity": 95,
    "minimumStockLevel": 40,
    "expiryDate": "2027-08-06",
    "supplier": "Dr. Reddy's Logistics",
    "purchasePrice": 720,
    "sellingPrice": 975,
    "active": true
  },
  {
    "id": 124,
    "sku": "SKU-MED-124",
    "medicineName": "Nebulizer Machine Compressor",
    "genericName": "Aerosol Nebulizer",
    "brandName": "Omron NE-C28",
    "category": "Medical Supplies",
    "subcategory": "Other Medical Supplies",
    "strength": "Compressor",
    "packSize": "Single Unit Kit",
    "batchNumber": "BAT-2026-408",
    "quantity": 329,
    "minimumStockLevel": 40,
    "expiryDate": "2028-01-19",
    "supplier": "GSK Healthcare India",
    "purchasePrice": 1450,
    "sellingPrice": 1890,
    "active": true
  }
];

const INITIAL_ORDERS = [
    { id: 1, orderNumber: 'ORD-2026-001', customerName: 'Apollo Care Hospital', customerPhone: '+91 98765 43210', createdAt: '2026-09-02T10:30:00', totalAmount: 4850.00, status: 'COMPLETED', processedByName: 'Admin User' },
    { id: 2, orderNumber: 'ORD-2026-002', customerName: 'City Care Clinic', customerPhone: '+91 98123 45678', createdAt: '2026-09-02T14:15:00', totalAmount: 12400.00, status: 'CONFIRMED', processedByName: 'Staff User' },
    { id: 3, orderNumber: 'ORD-2026-003', customerName: 'Sunshine Health Center', customerPhone: '+91 97654 32109', createdAt: '2026-09-01T16:45:00', totalAmount: 2150.00, status: 'PENDING', processedByName: 'Admin User' },
    { id: 4, orderNumber: 'ORD-2026-004', customerName: 'St. Jude Medical Center', customerPhone: '+91 99887 76655', createdAt: '2026-09-01T11:20:00', totalAmount: 8900.00, status: 'PREPARING', processedByName: 'Staff User' },
    { id: 5, orderNumber: 'ORD-2026-005', customerName: 'Metro Diagnostics', customerPhone: '+91 95432 10987', createdAt: '2026-08-31T09:10:00', totalAmount: 1420.00, status: 'COMPLETED', processedByName: 'Admin User' },
    { id: 6, orderNumber: 'ORD-2026-006', customerName: 'Green Valley Pharmacy', customerPhone: '+91 94321 09876', createdAt: '2026-08-30T15:50:00', totalAmount: 5600.00, status: 'CANCELLED', processedByName: 'Staff User' }
];

const INITIAL_USERS = [
    { id: 1, name: 'Admin User', email: 'admin@medistock.com', role: 'ADMIN', active: true, createdAt: '2026-01-01' },
    { id: 2, name: 'Staff User', email: 'staff@medistock.com', role: 'STAFF', active: true, createdAt: '2026-01-05' },
    { id: 3, name: 'Senior Pharmacist', email: 'pharmacist@medistock.com', role: 'STAFF', active: true, createdAt: '2026-02-10' }
];

// Helper to determine status dynamically
const getDerivedStockStatus = (quantity, reorderLevel) => {
    if (quantity <= 0) return 'OUT_OF_STOCK';
    if (quantity <= reorderLevel) return 'LOW_STOCK';
    return 'IN_STOCK';
};

const getDerivedExpiryStatus = (expiryDateStr) => {
    if (!expiryDateStr) return 'VALID';
    const exp = new Date(expiryDateStr);
    const now = new Date();
    now.setHours(0,0,0,0);
    const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'EXPIRED';
    if (diffDays <= 90) return 'EXPIRING_SOON';
    return 'VALID';
};

const api = {
    // Persistence Layer
    _getProducts() {
        const stored = localStorage.getItem('medistock_products_v3');
        if (stored) {
            try { return JSON.parse(stored); } catch (e) {}
        }
        localStorage.setItem('medistock_products_v3', JSON.stringify(INITIAL_MASTER_PRODUCTS));
        return INITIAL_MASTER_PRODUCTS;
    },

    _saveProducts(products) {
        localStorage.setItem('medistock_products_v3', JSON.stringify(products));
    },

    _getOrders() {
        const stored = localStorage.getItem('medistock_orders_v3');
        if (stored) {
            try { return JSON.parse(stored); } catch (e) {}
        }
        localStorage.setItem('medistock_orders_v3', JSON.stringify(INITIAL_ORDERS));
        return INITIAL_ORDERS;
    },

    _saveOrders(orders) {
        localStorage.setItem('medistock_orders_v3', JSON.stringify(orders));
    },

    _getHeaders() {
        const token = localStorage.getItem('medistock_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        return headers;
    },

    async _request(method, path, body = null) {
        const options = { method, headers: this._getHeaders() };
        if (body) options.body = JSON.stringify(body);

        try {
            const response = await fetch(API_BASE + path, options);

            if (response.status === 401) {
                localStorage.clear();
                const inPages = window.location.pathname.includes('/pages/');
                window.location.href = inPages ? 'login.html' : './pages/login.html';
                return;
            }

            const data = await response.json().catch(() => null);
            if (!response.ok) {
                throw new Error(data?.message || 'An error occurred');
            }
            return data;
        } catch (err) {
            // Demo fallback mode for offline / hosted GitHub Pages
            return this._mockFallback(method, path, body);
        }
    },

    _mockFallback(method, path, body) {
        let products = this._getProducts();
        
        // Ensure stock & expiry statuses are fresh
        products = products.map(p => ({
            ...p,
            stockStatus: getDerivedStockStatus(p.quantity, p.minimumStockLevel),
            expiryStatus: getDerivedExpiryStatus(p.expiryDate)
        }));

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
            const totalMedicines = products.length;
            const totalStockUnits = products.reduce((acc, m) => acc + (parseInt(m.quantity) || 0), 0);
            const totalInventoryValue = products.reduce((acc, m) => acc + ((parseInt(m.quantity) || 0) * (parseFloat(m.sellingPrice) || 0)), 0);
            const lowStockCount = products.filter(m => m.stockStatus === 'LOW_STOCK').length;
            const outOfStockCount = products.filter(m => m.stockStatus === 'OUT_OF_STOCK').length;
            const expiringSoonCount = products.filter(m => m.expiryStatus === 'EXPIRING_SOON').length;
            const expiredCount = products.filter(m => m.expiryStatus === 'EXPIRED').length;

            const categoriesMap = {};
            products.forEach(p => {
                const cat = p.category || 'Other';
                if (!categoriesMap[cat]) categoriesMap[cat] = { count: 0, value: 0, units: 0 };
                categoriesMap[cat].count++;
                categoriesMap[cat].units += (parseInt(p.quantity) || 0);
                categoriesMap[cat].value += ((parseInt(p.quantity) || 0) * (parseFloat(p.sellingPrice) || 0));
            });

            const orders = this._getOrders();

            return {
                success: true,
                data: {
                    totalMedicines,
                    totalStockUnits,
                    totalInventoryValue,
                    totalCategories: Object.keys(categoriesMap).length,
                    lowStockCount,
                    outOfStockCount,
                    expiringSoonCount,
                    expiredCount,
                    categoriesBreakdown: categoriesMap,
                    totalOrders: orders.length,
                    pendingOrders: orders.filter(o => o.status === 'PENDING').length,
                    completedOrders: orders.filter(o => o.status === 'COMPLETED').length
                }
            };
        }

        if (path === '/dashboard/low-stock' || path === '/medicines/low-stock') {
            return {
                success: true,
                data: products.filter(m => m.stockStatus === 'LOW_STOCK' || m.stockStatus === 'OUT_OF_STOCK')
            };
        }

        if (path === '/dashboard/expiring' || path === '/medicines/expiring') {
            return {
                success: true,
                data: products.filter(m => m.expiryStatus === 'EXPIRING_SOON')
            };
        }

        if (path === '/medicines/expired') {
            return {
                success: true,
                data: products.filter(m => m.expiryStatus === 'EXPIRED')
            };
        }

        if (path === '/dashboard/recent-orders') {
            return { success: true, data: this._getOrders() };
        }

        if (path.startsWith('/categories')) {
            const categoriesMap = {};
            products.forEach(p => {
                const cat = p.category || 'General';
                if (!categoriesMap[cat]) categoriesMap[cat] = { id: Object.keys(categoriesMap).length + 1, categoryName: cat, description: `All ${cat} products & supplies`, count: 0, active: true };
                categoriesMap[cat].count++;
            });
            return { success: true, data: Object.values(categoriesMap) };
        }

        if (path.startsWith('/medicines')) {
            return { success: true, data: products };
        }

        if (path.startsWith('/inventory')) {
            return {
                success: true,
                data: products.map(m => ({
                    medicineId: m.id,
                    medicineName: m.medicineName,
                    sku: m.sku,
                    brandName: m.brandName,
                    batchNumber: m.batchNumber,
                    currentStock: m.quantity,
                    minStock: m.minimumStockLevel,
                    status: m.stockStatus,
                    supplier: m.supplier,
                    sellingPrice: m.sellingPrice
                }))
            };
        }

        if (path.startsWith('/orders')) {
            return { success: true, data: this._getOrders() };
        }

        if (path.startsWith('/users')) {
            return { success: true, data: INITIAL_USERS };
        }

        return { success: true, message: 'Operation successful', data: null };
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

    // Medicines CRUD & Local Operations
    getMedicines(params = {}) {
        const { keyword = '', category = '', subcategory = '', stockStatus = '', expiryStatus = '', sortBy = 'name', page = 1, limit = 15 } = params;
        
        let products = this._getProducts();

        // Recalculate derived statuses
        products = products.map(p => ({
            ...p,
            stockStatus: getDerivedStockStatus(p.quantity, p.minimumStockLevel),
            expiryStatus: getDerivedExpiryStatus(p.expiryDate)
        }));

        // Search Filter (Matches Name, Generic, Brand, SKU, Category, Subcategory, Supplier)
        if (keyword) {
            const kw = keyword.toLowerCase().trim();
            products = products.filter(p => 
                (p.medicineName && p.medicineName.toLowerCase().includes(kw)) ||
                (p.genericName && p.genericName.toLowerCase().includes(kw)) ||
                (p.brandName && p.brandName.toLowerCase().includes(kw)) ||
                (p.sku && p.sku.toLowerCase().includes(kw)) ||
                (p.category && p.category.toLowerCase().includes(kw)) ||
                (p.subcategory && p.subcategory.toLowerCase().includes(kw)) ||
                (p.supplier && p.supplier.toLowerCase().includes(kw))
            );
        }

        // Category Filter
        if (category && category !== 'ALL') {
            products = products.filter(p => p.category === category);
        }

        // Subcategory Filter
        if (subcategory && subcategory !== 'ALL') {
            products = products.filter(p => p.subcategory === subcategory);
        }

        // Stock Status Filter
        if (stockStatus && stockStatus !== 'ALL') {
            products = products.filter(p => p.stockStatus === stockStatus);
        }

        // Expiry Status Filter
        if (expiryStatus && expiryStatus !== 'ALL') {
            products = products.filter(p => p.expiryStatus === expiryStatus);
        }

        // Sorting
        products.sort((a, b) => {
            if (sortBy === 'name') return a.medicineName.localeCompare(b.medicineName);
            if (sortBy === 'qty_asc') return a.quantity - b.quantity;
            if (sortBy === 'qty_desc') return b.quantity - a.quantity;
            if (sortBy === 'price_asc') return a.sellingPrice - b.sellingPrice;
            if (sortBy === 'price_desc') return b.sellingPrice - a.sellingPrice;
            if (sortBy === 'expiry_asc') return new Date(a.expiryDate) - new Date(b.expiryDate);
            return 0;
        });

        // Pagination
        const totalItems = products.length;
        const totalPages = Math.ceil(totalItems / limit) || 1;
        const currentPage = Math.max(1, Math.min(page, totalPages));
        const startIndex = (currentPage - 1) * limit;
        const paginatedItems = products.slice(startIndex, startIndex + limit);

        return Promise.resolve({
            success: true,
            totalItems,
            totalPages,
            currentPage,
            limit,
            data: paginatedItems
        });
    },

    getMedicineById(id) {
        const products = this._getProducts();
        const found = products.find(p => p.id == id);
        if (!found) return Promise.reject(new Error('Product not found'));
        return Promise.resolve({
            success: true,
            data: {
                ...found,
                stockStatus: getDerivedStockStatus(found.quantity, found.minimumStockLevel),
                expiryStatus: getDerivedExpiryStatus(found.expiryDate)
            }
        });
    },

    createMedicine(data) {
        const products = this._getProducts();
        const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const newSku = data.sku || `SKU-USR-${String(newId).padStart(3, '0')}`;

        const newProduct = {
            id: newId,
            sku: newSku,
            medicineName: data.medicineName,
            genericName: data.genericName || '',
            brandName: data.brandName || '',
            category: data.category || 'Medicines',
            subcategory: data.subcategory || 'General',
            strength: data.strength || '',
            packSize: data.packSize || 'Standard Pack',
            batchNumber: data.batchNumber || `BAT-2026-${Math.floor(Math.random()*900+100)}`,
            quantity: parseInt(data.quantity || 0),
            minimumStockLevel: parseInt(data.minimumStockLevel || 20),
            expiryDate: data.expiryDate || '2027-12-31',
            supplier: data.supplier || 'Sun Pharma Direct',
            purchasePrice: parseFloat(data.purchasePrice || 0),
            sellingPrice: parseFloat(data.sellingPrice || 0),
            active: true
        };

        products.unshift(newProduct);
        this._saveProducts(products);

        return Promise.resolve({ success: true, message: 'Product added successfully', data: newProduct });
    },

    updateMedicine(id, data) {
        let products = this._getProducts();
        const index = products.findIndex(p => p.id == id);
        if (index === -1) return Promise.reject(new Error('Product not found'));

        products[index] = {
            ...products[index],
            ...data,
            quantity: parseInt(data.quantity !== undefined ? data.quantity : products[index].quantity),
            minimumStockLevel: parseInt(data.minimumStockLevel !== undefined ? data.minimumStockLevel : products[index].minimumStockLevel),
            purchasePrice: parseFloat(data.purchasePrice !== undefined ? data.purchasePrice : products[index].purchasePrice),
            sellingPrice: parseFloat(data.sellingPrice !== undefined ? data.sellingPrice : products[index].sellingPrice)
        };

        this._saveProducts(products);

        return Promise.resolve({ success: true, message: 'Product updated successfully', data: products[index] });
    },

    deleteMedicine(id) {
        let products = this._getProducts();
        products = products.filter(p => p.id != id);
        this._saveProducts(products);

        return Promise.resolve({ success: true, message: 'Product deleted successfully' });
    },

    adjustStock(id, changeAmount, reason = 'Stock adjustment') {
        let products = this._getProducts();
        const index = products.findIndex(p => p.id == id);
        if (index === -1) return Promise.reject(new Error('Product not found'));

        const currentQty = parseInt(products[index].quantity || 0);
        const newQty = Math.max(0, currentQty + parseInt(changeAmount));
        products[index].quantity = newQty;

        this._saveProducts(products);

        return Promise.resolve({ success: true, message: `Stock updated to ${newQty} units`, data: products[index] });
    },

    // Auxiliary Views
    getLowStockMedicines() {
        return this.getMedicines({ stockStatus: 'LOW_STOCK', limit: 100 });
    },
    getExpiringSoonMedicines() {
        return this.getMedicines({ expiryStatus: 'EXPIRING_SOON', limit: 100 });
    },
    getExpiredMedicines() {
        return this.getMedicines({ expiryStatus: 'EXPIRED', limit: 100 });
    },

    // Inventory View
    getInventory() { return this.get('/inventory'); },
    getOrders() { return this.get('/orders'); },
    getUsers() { return this.get('/users'); }
};
