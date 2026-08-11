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
public class StockTransactionResponse {
    private Long id;
    private Long medicineId;
    private String medicineName;
    private String transactionType;
    private Integer quantity;
    private Integer previousQuantity;
    private Integer newQuantity;
    private String reason;
    private String performedByName;
    private LocalDateTime createdAt;
}
