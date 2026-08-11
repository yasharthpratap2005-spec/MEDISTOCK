package com.medistock.controller;

import com.medistock.dto.ApiResponse;
import com.medistock.dto.DashboardSummary;
import com.medistock.dto.MedicineResponse;
import com.medistock.dto.OrderResponse;
import com.medistock.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummary>> getSummary() {
        return ResponseEntity.ok(ApiResponse.success("Dashboard summary", dashboardService.getSummary()));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse<List<MedicineResponse>>> getLowStock() {
        return ResponseEntity.ok(ApiResponse.success("Low stock medicines", dashboardService.getLowStockMedicines()));
    }

    @GetMapping("/expiring")
    public ResponseEntity<ApiResponse<List<MedicineResponse>>> getExpiring() {
        return ResponseEntity.ok(ApiResponse.success("Expiring medicines", dashboardService.getExpiringMedicines()));
    }

    @GetMapping("/recent-orders")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getRecentOrders() {
        return ResponseEntity.ok(ApiResponse.success("Recent orders", dashboardService.getRecentOrders()));
    }
}
