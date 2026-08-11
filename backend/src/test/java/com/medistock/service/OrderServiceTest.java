package com.medistock.service;

import com.medistock.dto.OrderRequest;
import com.medistock.dto.OrderResponse;
import com.medistock.entity.*;
import com.medistock.exception.BusinessException;
import com.medistock.exception.ResourceNotFoundException;
import com.medistock.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock private OrderRepository orderRepository;
    @Mock private MedicineRepository medicineRepository;
    @Mock private UserRepository userRepository;
    @Mock private StockTransactionRepository stockTransactionRepository;

    @InjectMocks private OrderService orderService;

    private Medicine medicine;
    private User user;
    private Order pendingOrder;

    @BeforeEach
    void setUp() {
        Category category = Category.builder().id(1L).name("Antibiotics").active(true).build();

        medicine = Medicine.builder()
                .id(1L).medicineName("Azithromycin 500mg").category(category)
                .quantity(50).minimumStockLevel(10)
                .expiryDate(LocalDate.now().plusYears(1))
                .manufacturer("Abbott").batchNumber("AB-001")
                .price(new BigDecimal("120.00")).active(true)
                .prescriptionRequired(true).build();

        user = User.builder()
                .id(1L).name("Staff").email("staff@medistock.com")
                .role("STAFF").active(true).build();

        pendingOrder = Order.builder()
                .id(1L).orderNumber("ORD-TEST-001")
                .customerName("John Doe").customerPhone("9876543210")
                .totalAmount(new BigDecimal("240.00"))
                .status("PENDING").processedBy(user)
                .items(new ArrayList<>())
                .build();
    }

    @Test
    void createOrder_success_reducesStock() {
        OrderRequest request = new OrderRequest();
        request.setCustomerName("John Doe");
        request.setCustomerPhone("9876543210");
        OrderRequest.OrderItemRequest itemRequest = new OrderRequest.OrderItemRequest();
        itemRequest.setMedicineId(1L);
        itemRequest.setQuantity(2);
        request.setItems(List.of(itemRequest));

        when(userRepository.findByEmail("staff@medistock.com")).thenReturn(Optional.of(user));
        when(medicineRepository.findById(1L)).thenReturn(Optional.of(medicine));
        when(medicineRepository.save(any(Medicine.class))).thenReturn(medicine);
        when(stockTransactionRepository.save(any())).thenReturn(null);

        Order savedOrder = Order.builder()
                .id(2L).orderNumber("ORD-SAVED-001")
                .customerName("John Doe").customerPhone("9876543210")
                .totalAmount(new BigDecimal("240.00"))
                .status("PENDING").processedBy(user)
                .items(new ArrayList<>())
                .build();
        when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);

        OrderResponse response = orderService.createOrder(request, "staff@medistock.com");

        assertThat(response).isNotNull();
        assertThat(medicine.getQuantity()).isEqualTo(48); // 50 - 2
        verify(stockTransactionRepository, times(1)).save(any(StockTransaction.class));
    }

    @Test
    void createOrder_insufficientStock_throwsBusinessException() {
        OrderRequest request = new OrderRequest();
        request.setCustomerName("Jane Doe");
        request.setCustomerPhone("1234567890");
        OrderRequest.OrderItemRequest itemRequest = new OrderRequest.OrderItemRequest();
        itemRequest.setMedicineId(1L);
        itemRequest.setQuantity(100); // More than available 50
        request.setItems(List.of(itemRequest));

        when(userRepository.findByEmail("staff@medistock.com")).thenReturn(Optional.of(user));
        when(medicineRepository.findById(1L)).thenReturn(Optional.of(medicine));

        assertThatThrownBy(() -> orderService.createOrder(request, "staff@medistock.com"))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Insufficient stock");
    }

    @Test
    void createOrder_expiredMedicine_throwsBusinessException() {
        medicine.setExpiryDate(LocalDate.now().minusDays(1));

        OrderRequest request = new OrderRequest();
        request.setCustomerName("Jane Doe");
        request.setCustomerPhone("1234567890");
        OrderRequest.OrderItemRequest itemRequest = new OrderRequest.OrderItemRequest();
        itemRequest.setMedicineId(1L);
        itemRequest.setQuantity(2);
        request.setItems(List.of(itemRequest));

        when(userRepository.findByEmail("staff@medistock.com")).thenReturn(Optional.of(user));
        when(medicineRepository.findById(1L)).thenReturn(Optional.of(medicine));

        assertThatThrownBy(() -> orderService.createOrder(request, "staff@medistock.com"))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("expired");
    }

    @Test
    void cancelOrder_pendingOrder_success() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(pendingOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(pendingOrder);

        OrderResponse response = orderService.cancelOrder(1L);

        assertThat(pendingOrder.getStatus()).isEqualTo("CANCELLED");
    }

    @Test
    void cancelOrder_completedOrder_throwsBusinessException() {
        pendingOrder.setStatus("COMPLETED");
        when(orderRepository.findById(1L)).thenReturn(Optional.of(pendingOrder));

        assertThatThrownBy(() -> orderService.cancelOrder(1L))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Only PENDING orders");
    }

    @Test
    void updateOrderStatus_validTransition_pending_to_confirmed() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(pendingOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(pendingOrder);

        OrderResponse response = orderService.updateOrderStatus(1L, "CONFIRMED");

        assertThat(pendingOrder.getStatus()).isEqualTo("CONFIRMED");
    }

    @Test
    void updateOrderStatus_invalidTransition_completed_to_pending_throwsException() {
        pendingOrder.setStatus("COMPLETED");
        when(orderRepository.findById(1L)).thenReturn(Optional.of(pendingOrder));

        assertThatThrownBy(() -> orderService.updateOrderStatus(1L, "PENDING"))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Invalid status transition");
    }

    @Test
    void getOrderById_notFound_throwsResourceNotFoundException() {
        when(orderRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.getOrderById(999L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
