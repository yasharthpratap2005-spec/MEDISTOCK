package com.medistock.controller;

import com.medistock.dto.ApiResponse;
import com.medistock.dto.OrderRequest;
import com.medistock.dto.OrderResponse;
import com.medistock.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved", orderService.getAllOrders()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Order retrieved", orderService.getOrderById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @Valid @RequestBody OrderRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        OrderResponse response = orderService.createOrder(request, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Order created successfully", response));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        if (newStatus == null || newStatus.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Status is required", "MISSING_STATUS"));
        }
        return ResponseEntity.ok(ApiResponse.success("Order status updated", orderService.updateOrderStatus(id, newStatus.toUpperCase())));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Order cancelled", orderService.cancelOrder(id)));
    }
}
