package com.medistock.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicineResponse {
    private Long id;
    private String medicineName;
    private String genericName;
    private Long categoryId;
    private String categoryName;
    private String manufacturer;
    private String batchNumber;
    private BigDecimal price;
    private Integer quantity;
    private Integer minimumStockLevel;
    private LocalDate expiryDate;
    private Boolean prescriptionRequired;
    private String description;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String stockStatus;
    private String expiryStatus;
}
