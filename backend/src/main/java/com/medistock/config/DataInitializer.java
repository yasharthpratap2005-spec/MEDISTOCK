package com.medistock.config;

import com.medistock.entity.Category;
import com.medistock.entity.Medicine;
import com.medistock.entity.User;
import com.medistock.repository.CategoryRepository;
import com.medistock.repository.MedicineRepository;
import com.medistock.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final MedicineRepository medicineRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            initUsers();
        }
        if (categoryRepository.count() == 0) {
            initCategories();
        }
        if (medicineRepository.count() == 0) {
            initMedicines();
        }
        log.info("MEDISTOCK data initialization complete.");
    }

    private void initUsers() {
        List<User> users = List.of(
            User.builder()
                .name("Admin User")
                .email("admin@medistock.com")
                .password(passwordEncoder.encode("Admin@123"))
                .role("ADMIN")
                .active(true)
                .build(),
            User.builder()
                .name("Staff User")
                .email("staff@medistock.com")
                .password(passwordEncoder.encode("Staff@123"))
                .role("STAFF")
                .active(true)
                .build()
        );
        userRepository.saveAll(users);
        log.info("Users initialized.");
    }

    private void initCategories() {
        List<Category> categories = List.of(
            Category.builder().name("Pain Relief").description("Medicines for pain management and analgesics").active(true).build(),
            Category.builder().name("Antibiotics").description("Antibacterial medicines for infections").active(true).build(),
            Category.builder().name("Vitamins & Supplements").description("Nutritional supplements and vitamins").active(true).build(),
            Category.builder().name("Cold & Flu").description("Medicines for cold, flu and respiratory issues").active(true).build(),
            Category.builder().name("Digestive Health").description("Medicines for digestion and gastrointestinal issues").active(true).build(),
            Category.builder().name("Diabetes Care").description("Medicines and supplies for diabetes management").active(true).build(),
            Category.builder().name("Skin Care").description("Topical medicines and skin treatments").active(true).build(),
            Category.builder().name("First Aid").description("Basic first aid supplies and antiseptics").active(true).build(),
            Category.builder().name("Cardiovascular").description("Medicines for heart and blood pressure conditions").active(true).build(),
            Category.builder().name("Antacids").description("Medicines for acidity and heartburn").active(true).build()
        );
        categoryRepository.saveAll(categories);
        log.info("Categories initialized.");
    }

    private void initMedicines() {
        Category painRelief = categoryRepository.findByNameIgnoreCase("Pain Relief").orElseThrow();
        Category antibiotics = categoryRepository.findByNameIgnoreCase("Antibiotics").orElseThrow();
        Category vitamins = categoryRepository.findByNameIgnoreCase("Vitamins & Supplements").orElseThrow();
        Category coldFlu = categoryRepository.findByNameIgnoreCase("Cold & Flu").orElseThrow();
        Category digestive = categoryRepository.findByNameIgnoreCase("Digestive Health").orElseThrow();
        Category diabetes = categoryRepository.findByNameIgnoreCase("Diabetes Care").orElseThrow();
        Category skinCare = categoryRepository.findByNameIgnoreCase("Skin Care").orElseThrow();
        Category firstAid = categoryRepository.findByNameIgnoreCase("First Aid").orElseThrow();
        Category cardio = categoryRepository.findByNameIgnoreCase("Cardiovascular").orElseThrow();
        Category antacids = categoryRepository.findByNameIgnoreCase("Antacids").orElseThrow();

        LocalDate today = LocalDate.now();

        List<Medicine> medicines = List.of(
            // Normal stock medicines
            Medicine.builder().medicineName("Paracetamol 500mg").genericName("Acetaminophen").category(painRelief)
                .manufacturer("Sun Pharma").batchNumber("SP-2024-001").price(new BigDecimal("25.00"))
                .quantity(250).minimumStockLevel(50).expiryDate(today.plusYears(2))
                .prescriptionRequired(false).description("Commonly used for fever and mild pain").active(true).build(),

            Medicine.builder().medicineName("Ibuprofen 400mg").genericName("Ibuprofen").category(painRelief)
                .manufacturer("Cipla").batchNumber("CI-2024-002").price(new BigDecimal("45.00"))
                .quantity(180).minimumStockLevel(40).expiryDate(today.plusMonths(20))
                .prescriptionRequired(false).description("Anti-inflammatory and pain reliever").active(true).build(),

            Medicine.builder().medicineName("Azithromycin 500mg").genericName("Azithromycin").category(antibiotics)
                .manufacturer("Abbott").batchNumber("AB-2024-003").price(new BigDecimal("120.00"))
                .quantity(8).minimumStockLevel(20).expiryDate(today.plusMonths(18))  // LOW STOCK
                .prescriptionRequired(true).description("Macrolide antibiotic for bacterial infections").active(true).build(),

            Medicine.builder().medicineName("Amoxicillin 250mg").genericName("Amoxicillin").category(antibiotics)
                .manufacturer("Lupin").batchNumber("LP-2024-004").price(new BigDecimal("85.00"))
                .quantity(0).minimumStockLevel(30).expiryDate(today.plusMonths(15))  // OUT OF STOCK
                .prescriptionRequired(true).description("Broad spectrum antibiotic").active(true).build(),

            Medicine.builder().medicineName("Vitamin D3 1000 IU").genericName("Cholecalciferol").category(vitamins)
                .manufacturer("Neurobion").batchNumber("NB-2024-005").price(new BigDecimal("200.00"))
                .quantity(120).minimumStockLevel(30).expiryDate(today.plusYears(3))
                .prescriptionRequired(false).description("Vitamin D3 supplement for bone health").active(true).build(),

            Medicine.builder().medicineName("Vitamin B12 500mcg").genericName("Cyanocobalamin").category(vitamins)
                .manufacturer("Mankind").batchNumber("MK-2024-006").price(new BigDecimal("150.00"))
                .quantity(5).minimumStockLevel(20).expiryDate(today.plusMonths(24))  // LOW STOCK
                .prescriptionRequired(false).description("B12 supplement for nerve health").active(true).build(),

            Medicine.builder().medicineName("Cetirizine 10mg").genericName("Cetirizine").category(coldFlu)
                .manufacturer("Dr. Reddy's").batchNumber("DR-2024-007").price(new BigDecimal("35.00"))
                .quantity(300).minimumStockLevel(50).expiryDate(today.plusMonths(22))
                .prescriptionRequired(false).description("Antihistamine for allergies and cold").active(true).build(),

            Medicine.builder().medicineName("Dextromethorphan Syrup").genericName("Dextromethorphan").category(coldFlu)
                .manufacturer("Pfizer").batchNumber("PF-2024-008").price(new BigDecimal("95.00"))
                .quantity(75).minimumStockLevel(20).expiryDate(today.plusMonths(18))
                .prescriptionRequired(false).description("Cough suppressant syrup").active(true).build(),

            Medicine.builder().medicineName("Metformin 500mg").genericName("Metformin HCl").category(diabetes)
                .manufacturer("USV").batchNumber("UV-2024-009").price(new BigDecimal("55.00"))
                .quantity(200).minimumStockLevel(50).expiryDate(today.plusYears(2))
                .prescriptionRequired(true).description("First-line medicine for Type 2 diabetes").active(true).build(),

            Medicine.builder().medicineName("Glipizide 5mg").genericName("Glipizide").category(diabetes)
                .manufacturer("Torrent").batchNumber("TR-2024-010").price(new BigDecimal("80.00"))
                .quantity(12).minimumStockLevel(25).expiryDate(today.plusMonths(16))  // LOW STOCK
                .prescriptionRequired(true).description("Sulfonylurea for blood sugar control").active(true).build(),

            Medicine.builder().medicineName("Omeprazole 20mg").genericName("Omeprazole").category(antacids)
                .manufacturer("Sun Pharma").batchNumber("SP-2024-011").price(new BigDecimal("65.00"))
                .quantity(160).minimumStockLevel(40).expiryDate(today.plusMonths(20))
                .prescriptionRequired(false).description("Proton pump inhibitor for acidity").active(true).build(),

            Medicine.builder().medicineName("Pantoprazole 40mg").genericName("Pantoprazole").category(antacids)
                .manufacturer("Alkem").batchNumber("AK-2024-012").price(new BigDecimal("75.00"))
                .quantity(90).minimumStockLevel(30).expiryDate(today.plusMonths(18))
                .prescriptionRequired(false).description("PPI for GERD and peptic ulcer").active(true).build(),

            Medicine.builder().medicineName("Atorvastatin 10mg").genericName("Atorvastatin").category(cardio)
                .manufacturer("Cipla").batchNumber("CI-2024-013").price(new BigDecimal("110.00"))
                .quantity(140).minimumStockLevel(40).expiryDate(today.plusYears(2))
                .prescriptionRequired(true).description("Statin for lowering cholesterol").active(true).build(),

            Medicine.builder().medicineName("Amlodipine 5mg").genericName("Amlodipine Besylate").category(cardio)
                .manufacturer("Zydus").batchNumber("ZY-2024-014").price(new BigDecimal("90.00"))
                .quantity(7).minimumStockLevel(25).expiryDate(today.plusMonths(15))  // LOW STOCK
                .prescriptionRequired(true).description("Calcium channel blocker for hypertension").active(true).build(),

            Medicine.builder().medicineName("Domperidone 10mg").genericName("Domperidone").category(digestive)
                .manufacturer("Lupin").batchNumber("LP-2024-015").price(new BigDecimal("40.00"))
                .quantity(200).minimumStockLevel(50).expiryDate(today.plusMonths(22))
                .prescriptionRequired(false).description("Antiemetic for nausea and vomiting").active(true).build(),

            Medicine.builder().medicineName("Loperamide 2mg").genericName("Loperamide").category(digestive)
                .manufacturer("Johnson & Johnson").batchNumber("JJ-2024-016").price(new BigDecimal("55.00"))
                .quantity(100).minimumStockLevel(20).expiryDate(today.plusMonths(19))
                .prescriptionRequired(false).description("Anti-diarrheal medicine").active(true).build(),

            // Expiring soon (within 30 days)
            Medicine.builder().medicineName("Betamethasone Cream").genericName("Betamethasone").category(skinCare)
                .manufacturer("GSK").batchNumber("GK-2024-017").price(new BigDecimal("130.00"))
                .quantity(30).minimumStockLevel(10).expiryDate(today.plusDays(15))  // EXPIRING SOON
                .prescriptionRequired(true).description("Topical corticosteroid for skin inflammation").active(true).build(),

            Medicine.builder().medicineName("Povidone Iodine Solution").genericName("Povidone Iodine").category(firstAid)
                .manufacturer("Win Medicare").batchNumber("WM-2024-018").price(new BigDecimal("70.00"))
                .quantity(45).minimumStockLevel(15).expiryDate(today.plusDays(20))  // EXPIRING SOON
                .prescriptionRequired(false).description("Antiseptic solution for wound care").active(true).build(),

            // Expired
            Medicine.builder().medicineName("Tetracycline 250mg").genericName("Tetracycline HCl").category(antibiotics)
                .manufacturer("IPCA").batchNumber("IP-2023-019").price(new BigDecimal("60.00"))
                .quantity(15).minimumStockLevel(20).expiryDate(today.minusMonths(3))  // EXPIRED
                .prescriptionRequired(true).description("Broad spectrum antibiotic - EXPIRED").active(true).build(),

            Medicine.builder().medicineName("Chlorhexidine Mouthwash").genericName("Chlorhexidine Gluconate").category(firstAid)
                .manufacturer("Colgate").batchNumber("CG-2023-020").price(new BigDecimal("150.00"))
                .quantity(8).minimumStockLevel(10).expiryDate(today.minusDays(45))  // EXPIRED
                .prescriptionRequired(false).description("Antibacterial mouthwash - EXPIRED").active(true).build()
        );

        medicineRepository.saveAll(medicines);
        log.info("Medicines initialized.");
    }
}
