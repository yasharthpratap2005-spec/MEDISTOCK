package com.medistock.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class MedicineRequest {

    @NotBlank(message = "Medicine name is required")
    @Size(max = 200, message = "Medicine name must not exceed 200 characters")
    private String medicineName;

    @Size(max = 200, message = "Generic name must not exceed 200 characters")
    private String genericName;

    @NotNull(message = "Category is required")
    private Long categoryId;

    @NotBlank(message = "Manufacturer is required")
    @Size(max = 200, message = "Manufacturer must not exceed 200 characters")
    private String manufacturer;

    @NotBlank(message = "Batch number is required")
    @Size(max = 100, message = "Batch number must not exceed 100 characters")
    private String batchNumber;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than zero")
    private BigDecimal price;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    @NotNull(message = "Minimum stock level is required")
    @Min(value = 0, message = "Minimum stock level cannot be negative")
    private Integer minimumStockLevel;

    @NotNull(message = "Expiry date is required")
    private LocalDate expiryDate;

    private Boolean prescriptionRequired = false;

    private String description;
}
