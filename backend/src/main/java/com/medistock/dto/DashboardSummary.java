package com.medistock.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummary {
    private long totalMedicines;
    private long totalCategories;
    private long totalStockUnits;
    private long lowStockCount;
    private long expiredCount;
    private long expiringSoonCount;
    private long totalOrders;
    private long pendingOrders;
    private long completedOrders;
}
