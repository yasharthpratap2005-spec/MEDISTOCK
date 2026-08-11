package com.medistock.controller;

import com.medistock.dto.ApiResponse;
import com.medistock.dto.MedicineResponse;
import com.medistock.dto.StockTransactionResponse;
import com.medistock.dto.StockUpdateRequest;
import com.medistock.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MedicineResponse>>> getAllInventory() {
        return ResponseEntity.ok(ApiResponse.success("Inventory retrieved", inventoryService.getAllInventory()));
    }

    @GetMapping("/{medicineId}")
    public ResponseEntity<ApiResponse<MedicineResponse>> getInventoryForMedicine(@PathVariable Long medicineId) {
        return ResponseEntity.ok(ApiResponse.success("Inventory for medicine", inventoryService.getInventoryForMedicine(medicineId)));
    }

    @PostMapping("/{medicineId}/stock-in")
    public ResponseEntity<ApiResponse<MedicineResponse>> stockIn(
            @PathVariable Long medicineId,
            @Valid @RequestBody StockUpdateRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(ApiResponse.success("Stock added successfully", inventoryService.stockIn(medicineId, request, userEmail)));
    }

    @PostMapping("/{medicineId}/stock-out")
    public ResponseEntity<ApiResponse<MedicineResponse>> stockOut(
            @PathVariable Long medicineId,
            @Valid @RequestBody StockUpdateRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(ApiResponse.success("Stock removed successfully", inventoryService.stockOut(medicineId, request, userEmail)));
    }

    @GetMapping("/{medicineId}/history")
    public ResponseEntity<ApiResponse<List<StockTransactionResponse>>> getStockHistory(@PathVariable Long medicineId) {
        return ResponseEntity.ok(ApiResponse.success("Stock history", inventoryService.getStockHistory(medicineId)));
    }
}
