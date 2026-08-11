package com.medistock.controller;

import com.medistock.dto.ApiResponse;
import com.medistock.dto.MedicineRequest;
import com.medistock.dto.MedicineResponse;
import com.medistock.service.MedicineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineService medicineService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MedicineResponse>>> getMedicines(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Boolean active) {
        return ResponseEntity.ok(ApiResponse.success("Medicines retrieved", medicineService.searchMedicines(keyword, categoryId, active)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicineResponse>> getMedicineById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Medicine retrieved", medicineService.getMedicineById(id)));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse<List<MedicineResponse>>> getLowStockMedicines() {
        return ResponseEntity.ok(ApiResponse.success("Low stock medicines", medicineService.getLowStockMedicines()));
    }

    @GetMapping("/expiring")
    public ResponseEntity<ApiResponse<List<MedicineResponse>>> getExpiringSoonMedicines() {
        return ResponseEntity.ok(ApiResponse.success("Expiring soon medicines", medicineService.getExpiringSoonMedicines()));
    }

    @GetMapping("/expired")
    public ResponseEntity<ApiResponse<List<MedicineResponse>>> getExpiredMedicines() {
        return ResponseEntity.ok(ApiResponse.success("Expired medicines", medicineService.getExpiredMedicines()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MedicineResponse>> createMedicine(@Valid @RequestBody MedicineRequest request) {
        MedicineResponse response = medicineService.createMedicine(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Medicine created successfully", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MedicineResponse>> updateMedicine(
            @PathVariable Long id, @Valid @RequestBody MedicineRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Medicine updated successfully", medicineService.updateMedicine(id, request)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MedicineResponse>> toggleStatus(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Medicine status updated", medicineService.toggleStatus(id)));
    }
}
