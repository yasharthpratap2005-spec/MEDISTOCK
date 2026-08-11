package com.medistock.service;

import com.medistock.dto.MedicineRequest;
import com.medistock.dto.MedicineResponse;
import com.medistock.entity.Category;
import com.medistock.entity.Medicine;
import com.medistock.exception.ResourceNotFoundException;
import com.medistock.repository.CategoryRepository;
import com.medistock.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicineService {

    private final MedicineRepository medicineRepository;
    private final CategoryRepository categoryRepository;

    @Value("${app.inventory.expiry-warning-days:30}")
    private int expiryWarningDays;

    public List<MedicineResponse> searchMedicines(String keyword, Long categoryId, Boolean active) {
        return medicineRepository.searchMedicines(keyword, categoryId, active)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public MedicineResponse getMedicineById(Long id) {
        return toResponse(findById(id));
    }

    public List<MedicineResponse> getLowStockMedicines() {
        return medicineRepository.findLowStockMedicines()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<MedicineResponse> getExpiredMedicines() {
        return medicineRepository.findExpiredMedicines(LocalDate.now())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<MedicineResponse> getExpiringSoonMedicines() {
        LocalDate today = LocalDate.now();
        LocalDate threshold = today.plusDays(expiryWarningDays);
        return medicineRepository.findExpiringSoonMedicines(today, threshold)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public MedicineResponse createMedicine(MedicineRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Medicine medicine = Medicine.builder()
                .medicineName(request.getMedicineName())
                .genericName(request.getGenericName())
                .category(category)
                .manufacturer(request.getManufacturer())
                .batchNumber(request.getBatchNumber())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .minimumStockLevel(request.getMinimumStockLevel())
                .expiryDate(request.getExpiryDate())
                .prescriptionRequired(request.getPrescriptionRequired() != null ? request.getPrescriptionRequired() : false)
                .description(request.getDescription())
                .active(true)
                .build();

        return toResponse(medicineRepository.save(medicine));
    }

    @Transactional
    public MedicineResponse updateMedicine(Long id, MedicineRequest request) {
        Medicine medicine = findById(id);
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        medicine.setMedicineName(request.getMedicineName());
        medicine.setGenericName(request.getGenericName());
        medicine.setCategory(category);
        medicine.setManufacturer(request.getManufacturer());
        medicine.setBatchNumber(request.getBatchNumber());
        medicine.setPrice(request.getPrice());
        medicine.setQuantity(request.getQuantity());
        medicine.setMinimumStockLevel(request.getMinimumStockLevel());
        medicine.setExpiryDate(request.getExpiryDate());
        medicine.setPrescriptionRequired(request.getPrescriptionRequired() != null ? request.getPrescriptionRequired() : false);
        medicine.setDescription(request.getDescription());

        return toResponse(medicineRepository.save(medicine));
    }

    @Transactional
    public MedicineResponse toggleStatus(Long id) {
        Medicine medicine = findById(id);
        medicine.setActive(!medicine.getActive());
        return toResponse(medicineRepository.save(medicine));
    }

    public Medicine findById(Long id) {
        return medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + id));
    }

    public MedicineResponse toResponse(Medicine medicine) {
        LocalDate today = LocalDate.now();
        LocalDate expiryDate = medicine.getExpiryDate();
        LocalDate threshold = today.plusDays(expiryWarningDays);

        String stockStatus;
        if (medicine.getQuantity() == 0) {
            stockStatus = "OUT_OF_STOCK";
        } else if (medicine.getQuantity() <= medicine.getMinimumStockLevel()) {
            stockStatus = "LOW_STOCK";
        } else {
            stockStatus = "IN_STOCK";
        }

        String expiryStatus;
        if (expiryDate.isBefore(today)) {
            expiryStatus = "EXPIRED";
        } else if (!expiryDate.isAfter(threshold)) {
            expiryStatus = "EXPIRING_SOON";
        } else {
            expiryStatus = "VALID";
        }

        return MedicineResponse.builder()
                .id(medicine.getId())
                .medicineName(medicine.getMedicineName())
                .genericName(medicine.getGenericName())
                .categoryId(medicine.getCategory().getId())
                .categoryName(medicine.getCategory().getName())
                .manufacturer(medicine.getManufacturer())
                .batchNumber(medicine.getBatchNumber())
                .price(medicine.getPrice())
                .quantity(medicine.getQuantity())
                .minimumStockLevel(medicine.getMinimumStockLevel())
                .expiryDate(medicine.getExpiryDate())
                .prescriptionRequired(medicine.getPrescriptionRequired())
                .description(medicine.getDescription())
                .active(medicine.getActive())
                .createdAt(medicine.getCreatedAt())
                .updatedAt(medicine.getUpdatedAt())
                .stockStatus(stockStatus)
                .expiryStatus(expiryStatus)
                .build();
    }
}
