package com.medistock.service;

import com.medistock.dto.MedicineRequest;
import com.medistock.dto.MedicineResponse;
import com.medistock.dto.StockTransactionResponse;
import com.medistock.dto.StockUpdateRequest;
import com.medistock.entity.Category;
import com.medistock.entity.Medicine;
import com.medistock.entity.StockTransaction;
import com.medistock.entity.User;
import com.medistock.exception.BusinessException;
import com.medistock.exception.ResourceNotFoundException;
import com.medistock.repository.CategoryRepository;
import com.medistock.repository.MedicineRepository;
import com.medistock.repository.StockTransactionRepository;
import com.medistock.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MedicineServiceTest {

    @Mock private MedicineRepository medicineRepository;
    @Mock private CategoryRepository categoryRepository;

    @InjectMocks private MedicineService medicineService;

    private Category testCategory;
    private Medicine testMedicine;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(medicineService, "expiryWarningDays", 30);

        testCategory = Category.builder()
                .id(1L).name("Pain Relief").active(true).build();

        testMedicine = Medicine.builder()
                .id(1L)
                .medicineName("Paracetamol 500mg")
                .genericName("Acetaminophen")
                .category(testCategory)
                .manufacturer("Sun Pharma")
                .batchNumber("SP-001")
                .price(new BigDecimal("25.00"))
                .quantity(100)
                .minimumStockLevel(20)
                .expiryDate(LocalDate.now().plusYears(1))
                .prescriptionRequired(false)
                .active(true)
                .build();
    }

    @Test
    void createMedicine_success() {
        MedicineRequest request = new MedicineRequest();
        request.setMedicineName("Ibuprofen 400mg");
        request.setGenericName("Ibuprofen");
        request.setCategoryId(1L);
        request.setManufacturer("Cipla");
        request.setBatchNumber("CI-001");
        request.setPrice(new BigDecimal("45.00"));
        request.setQuantity(50);
        request.setMinimumStockLevel(10);
        request.setExpiryDate(LocalDate.now().plusYears(2));

        Medicine savedMedicine = Medicine.builder()
                .id(2L)
                .medicineName("Ibuprofen 400mg")
                .genericName("Ibuprofen")
                .category(testCategory)
                .manufacturer("Cipla")
                .batchNumber("CI-001")
                .price(new BigDecimal("45.00"))
                .quantity(50)
                .minimumStockLevel(10)
                .expiryDate(LocalDate.now().plusYears(2))
                .prescriptionRequired(false)
                .active(true)
                .build();

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(medicineRepository.save(any(Medicine.class))).thenReturn(savedMedicine);

        MedicineResponse response = medicineService.createMedicine(request);

        assertThat(response).isNotNull();
        assertThat(response.getMedicineName()).isEqualTo("Ibuprofen 400mg");
        assertThat(response.getStockStatus()).isEqualTo("IN_STOCK");
        verify(medicineRepository, times(1)).save(any(Medicine.class));
    }

    @Test
    void createMedicine_categoryNotFound_throwsException() {
        MedicineRequest request = new MedicineRequest();
        request.setCategoryId(999L);
        request.setMedicineName("Test");
        request.setManufacturer("Test");
        request.setBatchNumber("T-001");
        request.setPrice(new BigDecimal("10.00"));
        request.setQuantity(10);
        request.setMinimumStockLevel(5);
        request.setExpiryDate(LocalDate.now().plusYears(1));

        when(categoryRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> medicineService.createMedicine(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Category not found");
    }

    @Test
    void toResponse_stockStatus_outOfStock() {
        testMedicine.setQuantity(0);
        MedicineResponse response = medicineService.toResponse(testMedicine);
        assertThat(response.getStockStatus()).isEqualTo("OUT_OF_STOCK");
    }

    @Test
    void toResponse_stockStatus_lowStock() {
        testMedicine.setQuantity(10); // below minimumStockLevel=20
        MedicineResponse response = medicineService.toResponse(testMedicine);
        assertThat(response.getStockStatus()).isEqualTo("LOW_STOCK");
    }

    @Test
    void toResponse_stockStatus_inStock() {
        testMedicine.setQuantity(100);
        MedicineResponse response = medicineService.toResponse(testMedicine);
        assertThat(response.getStockStatus()).isEqualTo("IN_STOCK");
    }

    @Test
    void toResponse_expiryStatus_expired() {
        testMedicine.setExpiryDate(LocalDate.now().minusDays(1));
        MedicineResponse response = medicineService.toResponse(testMedicine);
        assertThat(response.getExpiryStatus()).isEqualTo("EXPIRED");
    }

    @Test
    void toResponse_expiryStatus_expiringSoon() {
        testMedicine.setExpiryDate(LocalDate.now().plusDays(15));
        MedicineResponse response = medicineService.toResponse(testMedicine);
        assertThat(response.getExpiryStatus()).isEqualTo("EXPIRING_SOON");
    }

    @Test
    void toResponse_expiryStatus_valid() {
        testMedicine.setExpiryDate(LocalDate.now().plusYears(1));
        MedicineResponse response = medicineService.toResponse(testMedicine);
        assertThat(response.getExpiryStatus()).isEqualTo("VALID");
    }

    @Test
    void getLowStockMedicines_returnsLowStockOnly() {
        Medicine lowStock = Medicine.builder()
                .id(2L).medicineName("Low Stock Med").category(testCategory)
                .quantity(5).minimumStockLevel(20)
                .expiryDate(LocalDate.now().plusYears(1)).active(true)
                .manufacturer("X").batchNumber("X-001").price(BigDecimal.TEN)
                .prescriptionRequired(false).build();

        when(medicineRepository.findLowStockMedicines()).thenReturn(List.of(lowStock));

        List<MedicineResponse> result = medicineService.getLowStockMedicines();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getStockStatus()).isEqualTo("LOW_STOCK");
    }
}
