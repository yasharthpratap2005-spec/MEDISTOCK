package com.medistock.service;

import com.medistock.dto.OrderRequest;
import com.medistock.dto.OrderResponse;
import com.medistock.entity.Medicine;
import com.medistock.entity.Order;
import com.medistock.entity.OrderItem;
import com.medistock.entity.StockTransaction;
import com.medistock.entity.User;
import com.medistock.exception.BusinessException;
import com.medistock.exception.ResourceNotFoundException;
import com.medistock.repository.MedicineRepository;
import com.medistock.repository.OrderRepository;
import com.medistock.repository.StockTransactionRepository;
import com.medistock.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private static final Set<String> VALID_STATUSES = Set.of("PENDING", "CONFIRMED", "PREPARING", "COMPLETED", "CANCELLED");

    private final OrderRepository orderRepository;
    private final MedicineRepository medicineRepository;
    private final UserRepository userRepository;
    private final StockTransactionRepository stockTransactionRepository;

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public OrderResponse createOrder(OrderRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        // Validate and prepare items
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (OrderRequest.OrderItemRequest itemRequest : request.getItems()) {
            Medicine medicine = medicineRepository.findById(itemRequest.getMedicineId())
                    .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + itemRequest.getMedicineId()));

            if (!medicine.getActive()) {
                throw new BusinessException("Medicine '" + medicine.getMedicineName() + "' is not active", "MEDICINE_INACTIVE");
            }

            if (medicine.getExpiryDate().isBefore(LocalDate.now())) {
                throw new BusinessException("Medicine '" + medicine.getMedicineName() + "' is expired and cannot be ordered", "MEDICINE_EXPIRED");
            }

            if (medicine.getQuantity() < itemRequest.getQuantity()) {
                throw new BusinessException(
                    "Insufficient stock for '" + medicine.getMedicineName() + "'. Available: " + medicine.getQuantity(),
                    "INSUFFICIENT_STOCK"
                );
            }

            BigDecimal subtotal = medicine.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            total = total.add(subtotal);

            OrderItem item = OrderItem.builder()
                    .medicine(medicine)
                    .quantity(itemRequest.getQuantity())
                    .unitPrice(medicine.getPrice())
                    .subtotal(subtotal)
                    .build();
            orderItems.add(item);
        }

        // Create order
        String orderNumber = generateOrderNumber();
        Order order = Order.builder()
                .orderNumber(orderNumber)
                .customerName(request.getCustomerName())
                .customerPhone(request.getCustomerPhone())
                .totalAmount(total)
                .status("PENDING")
                .processedBy(user)
                .build();

        // Link items to order
        for (OrderItem item : orderItems) {
            item.setOrder(order);
            order.getItems().add(item);
        }

        // Reduce stock and save transactions
        for (int i = 0; i < orderItems.size(); i++) {
            OrderItem item = orderItems.get(i);
            Medicine medicine = item.getMedicine();
            int previousQty = medicine.getQuantity();
            int newQty = previousQty - item.getQuantity();

            medicine.setQuantity(newQty);
            medicineRepository.save(medicine);

            StockTransaction transaction = StockTransaction.builder()
                    .medicine(medicine)
                    .transactionType("STOCK_OUT")
                    .quantity(item.getQuantity())
                    .previousQuantity(previousQty)
                    .newQuantity(newQty)
                    .reason("Order: " + orderNumber)
                    .performedBy(user)
                    .build();
            stockTransactionRepository.save(transaction);
        }

        Order saved = orderRepository.save(order);
        return toResponse(saved);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long id, String newStatus) {
        if (!VALID_STATUSES.contains(newStatus)) {
            throw new BusinessException("Invalid order status: " + newStatus, "INVALID_STATUS");
        }

        Order order = findById(id);
        String currentStatus = order.getStatus();

        // Validate transitions
        validateStatusTransition(currentStatus, newStatus);

        order.setStatus(newStatus);
        return toResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse cancelOrder(Long id) {
        Order order = findById(id);
        if (!order.getStatus().equals("PENDING")) {
            throw new BusinessException("Only PENDING orders can be cancelled", "INVALID_CANCELLATION");
        }
        order.setStatus("CANCELLED");
        return toResponse(orderRepository.save(order));
    }

    private void validateStatusTransition(String current, String next) {
        boolean valid = switch (current) {
            case "PENDING" -> next.equals("CONFIRMED") || next.equals("CANCELLED");
            case "CONFIRMED" -> next.equals("PREPARING") || next.equals("CANCELLED");
            case "PREPARING" -> next.equals("COMPLETED");
            case "COMPLETED", "CANCELLED" -> false;
            default -> false;
        };

        if (!valid) {
            throw new BusinessException(
                "Invalid status transition from " + current + " to " + next,
                "INVALID_STATUS_TRANSITION"
            );
        }
    }

    private Order findById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }

    private String generateOrderNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "ORD-" + timestamp;
    }

    public OrderResponse toResponse(Order order) {
        List<OrderResponse.OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> OrderResponse.OrderItemResponse.builder()
                        .id(item.getId())
                        .medicineId(item.getMedicine().getId())
                        .medicineName(item.getMedicine().getMedicineName())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .subtotal(item.getSubtotal())
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .customerName(order.getCustomerName())
                .customerPhone(order.getCustomerPhone())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .processedByName(order.getProcessedBy().getName())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .items(itemResponses)
                .build();
    }
}
