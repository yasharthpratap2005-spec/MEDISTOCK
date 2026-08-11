package com.medistock.service;

import com.medistock.dto.DashboardSummary;
import com.medistock.dto.MedicineResponse;
import com.medistock.dto.OrderResponse;
import com.medistock.repository.CategoryRepository;
import com.medistock.repository.MedicineRepository;
import com.medistock.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final MedicineRepository medicineRepository;
    private final CategoryRepository categoryRepository;
    private final OrderRepository orderRepository;
    private final MedicineService medicineService;
    private final OrderService orderService;

    @Value("${app.inventory.expiry-warning-days:30}")
    private int expiryWarningDays;

    public DashboardSummary getSummary() {
        LocalDate today = LocalDate.now();
        LocalDate threshold = today.plusDays(expiryWarningDays);

        return DashboardSummary.builder()
                .totalMedicines(medicineRepository.countActiveMedicines())
                .totalCategories(categoryRepository.count())
                .totalStockUnits(medicineRepository.sumTotalStock())
                .lowStockCount(medicineRepository.countLowStockMedicines())
                .expiredCount(medicineRepository.countExpiredMedicines(today))
                .expiringSoonCount(medicineRepository.countExpiringSoonMedicines(today, threshold))
                .totalOrders(orderRepository.count())
                .pendingOrders(orderRepository.countPendingOrders())
                .completedOrders(orderRepository.countCompletedOrders())
                .build();
    }

    public List<MedicineResponse> getLowStockMedicines() {
        return medicineService.getLowStockMedicines();
    }

    public List<MedicineResponse> getExpiringMedicines() {
        return medicineService.getExpiringSoonMedicines();
    }

    public List<OrderResponse> getRecentOrders() {
        return orderRepository.findTop10ByOrderByCreatedAtDesc()
                .stream()
                .map(orderService::toResponse)
                .collect(Collectors.toList());
    }
}
