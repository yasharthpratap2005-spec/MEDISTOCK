package com.medistock.service;

import com.medistock.dto.MedicineResponse;
import com.medistock.dto.StockUpdateRequest;
import com.medistock.entity.Category;
import com.medistock.entity.Medicine;
import com.medistock.entity.StockTransaction;
import com.medistock.entity.User;
import com.medistock.exception.BusinessException;
import com.medistock.exception.ResourceNotFoundException;
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
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InventoryServiceTest {

    @Mock private MedicineRepository medicineRepository;
    @Mock private StockTransactionRepository stockTransactionRepository;
    @Mock private UserRepository userRepository;
    @Mock private MedicineService medicineService;

    @InjectMocks private InventoryService inventoryService;

    private Medicine medicine;
    private User user;

    @BeforeEach
    void setUp() {
        Category category = Category.builder().id(1L).name("Antibiotics").active(true).build();
        medicine = Medicine.builder()
                .id(1L).medicineName("Amoxicillin 500mg").category(category)
                .quantity(100).minimumStockLevel(20)
                .expiryDate(LocalDate.now().plusYears(1))
                .manufacturer("Cipla").batchNumber("CI-001")
                .price(new BigDecimal("85.00")).active(true)
                .prescriptionRequired(true).build();

        user = User.builder()
                .id(1L).name("Admin").email("admin@medistock.com")
                .role("ADMIN").active(true).build();
    }

    @Test
    void stockIn_success_increasesQuantity() {
        StockUpdateRequest request = new StockUpdateRequest();
        request.setTransactionType("STOCK_IN");
        request.setQuantity(50);
        request.setReason("Regular restock");

        when(medicineRepository.findById(1L)).thenReturn(Optional.of(medicine));
        when(userRepository.findByEmail("admin@medistock.com")).thenReturn(Optional.of(user));
        when(medicineRepository.save(any(Medicine.class))).thenReturn(medicine);
        when(stockTransactionRepository.save(any(StockTransaction.class))).thenReturn(null);

        MedicineResponse mockResponse = MedicineResponse.builder()
                .id(1L).medicineName("Amoxicillin 500mg").quantity(150).stockStatus("IN_STOCK").build();
        when(medicineService.toResponse(any(Medicine.class))).thenReturn(mockResponse);

        MedicineResponse response = inventoryService.stockIn(1L, request, "admin@medistock.com");

        assertThat(medicine.getQuantity()).isEqualTo(150); // 100 + 50
        verify(stockTransactionRepository, times(1)).save(any(StockTransaction.class));
    }

    @Test
    void stockOut_success_decreasesQuantity() {
        StockUpdateRequest request = new StockUpdateRequest();
        request.setTransactionType("STOCK_OUT");
        request.setQuantity(30);
        request.setReason("Dispensed");

        when(medicineRepository.findById(1L)).thenReturn(Optional.of(medicine));
        when(userRepository.findByEmail("admin@medistock.com")).thenReturn(Optional.of(user));
        when(medicineRepository.save(any(Medicine.class))).thenReturn(medicine);
        when(stockTransactionRepository.save(any(StockTransaction.class))).thenReturn(null);

        MedicineResponse mockResponse = MedicineResponse.builder()
                .id(1L).medicineName("Amoxicillin 500mg").quantity(70).stockStatus("IN_STOCK").build();
        when(medicineService.toResponse(any(Medicine.class))).thenReturn(mockResponse);

        MedicineResponse response = inventoryService.stockOut(1L, request, "admin@medistock.com");

        assertThat(medicine.getQuantity()).isEqualTo(70); // 100 - 30
    }

    @Test
    void stockOut_insufficientStock_throwsBusinessException() {
        StockUpdateRequest request = new StockUpdateRequest();
        request.setTransactionType("STOCK_OUT");
        request.setQuantity(200); // More than available 100
        request.setReason("Test");

        when(medicineRepository.findById(1L)).thenReturn(Optional.of(medicine));
        when(userRepository.findByEmail("admin@medistock.com")).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> inventoryService.stockOut(1L, request, "admin@medistock.com"))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Insufficient stock");
    }

    @Test
    void stockOut_medicineNotFound_throwsResourceNotFoundException() {
        StockUpdateRequest request = new StockUpdateRequest();
        request.setTransactionType("STOCK_OUT");
        request.setQuantity(10);

        when(medicineRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> inventoryService.stockOut(999L, request, "admin@medistock.com"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void stockIn_quantityNeverGoesNegative() {
        medicine.setQuantity(0);
        StockUpdateRequest request = new StockUpdateRequest();
        request.setTransactionType("STOCK_IN");
        request.setQuantity(50);

        when(medicineRepository.findById(1L)).thenReturn(Optional.of(medicine));
        when(userRepository.findByEmail("admin@medistock.com")).thenReturn(Optional.of(user));
        when(medicineRepository.save(any(Medicine.class))).thenReturn(medicine);
        when(stockTransactionRepository.save(any())).thenReturn(null);

        MedicineResponse mockResponse = MedicineResponse.builder().quantity(50).build();
        when(medicineService.toResponse(any())).thenReturn(mockResponse);

        inventoryService.stockIn(1L, request, "admin@medistock.com");
        assertThat(medicine.getQuantity()).isGreaterThanOrEqualTo(0);
    }
}
