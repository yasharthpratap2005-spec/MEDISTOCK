package com.medistock.service;

import com.medistock.dto.MedicineResponse;
import com.medistock.dto.StockTransactionResponse;
import com.medistock.dto.StockUpdateRequest;
import com.medistock.entity.Medicine;
import com.medistock.entity.StockTransaction;
import com.medistock.entity.User;
import com.medistock.exception.BusinessException;
import com.medistock.exception.ResourceNotFoundException;
import com.medistock.repository.MedicineRepository;
import com.medistock.repository.StockTransactionRepository;
import com.medistock.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final MedicineRepository medicineRepository;
    private final StockTransactionRepository stockTransactionRepository;
    private final UserRepository userRepository;
    private final MedicineService medicineService;

    public List<MedicineResponse> getAllInventory() {
        return medicineRepository.findAll()
                .stream()
                .map(medicineService::toResponse)
                .collect(Collectors.toList());
    }

    public MedicineResponse getInventoryForMedicine(Long medicineId) {
        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + medicineId));
        return medicineService.toResponse(medicine);
    }

    @Transactional
    public MedicineResponse stockIn(Long medicineId, StockUpdateRequest request, String userEmail) {
        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + medicineId));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        int previousQty = medicine.getQuantity();
        int newQty = previousQty + request.getQuantity();

        medicine.setQuantity(newQty);
        medicineRepository.save(medicine);

        StockTransaction transaction = StockTransaction.builder()
                .medicine(medicine)
                .transactionType("STOCK_IN")
                .quantity(request.getQuantity())
                .previousQuantity(previousQty)
                .newQuantity(newQty)
                .reason(request.getReason())
                .performedBy(user)
                .build();
        stockTransactionRepository.save(transaction);

        return medicineService.toResponse(medicine);
    }

    @Transactional
    public MedicineResponse stockOut(Long medicineId, StockUpdateRequest request, String userEmail) {
        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + medicineId));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        int previousQty = medicine.getQuantity();
        if (request.getQuantity() > previousQty) {
            throw new BusinessException(
                "Insufficient stock. Available: " + previousQty + ", Requested: " + request.getQuantity(),
                "INSUFFICIENT_STOCK"
            );
        }

        int newQty = previousQty - request.getQuantity();
        medicine.setQuantity(newQty);
        medicineRepository.save(medicine);

        StockTransaction transaction = StockTransaction.builder()
                .medicine(medicine)
                .transactionType("STOCK_OUT")
                .quantity(request.getQuantity())
                .previousQuantity(previousQty)
                .newQuantity(newQty)
                .reason(request.getReason())
                .performedBy(user)
                .build();
        stockTransactionRepository.save(transaction);

        return medicineService.toResponse(medicine);
    }

    public List<StockTransactionResponse> getStockHistory(Long medicineId) {
        if (!medicineRepository.existsById(medicineId)) {
            throw new ResourceNotFoundException("Medicine not found with id: " + medicineId);
        }
        return stockTransactionRepository.findByMedicineIdOrderByCreatedAtDesc(medicineId)
                .stream()
                .map(this::toTransactionResponse)
                .collect(Collectors.toList());
    }

    private StockTransactionResponse toTransactionResponse(StockTransaction transaction) {
        return StockTransactionResponse.builder()
                .id(transaction.getId())
                .medicineId(transaction.getMedicine().getId())
                .medicineName(transaction.getMedicine().getMedicineName())
                .transactionType(transaction.getTransactionType())
                .quantity(transaction.getQuantity())
                .previousQuantity(transaction.getPreviousQuantity())
                .newQuantity(transaction.getNewQuantity())
                .reason(transaction.getReason())
                .performedByName(transaction.getPerformedBy().getName())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}
