package com.medistock.repository;

import com.medistock.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    // Search
    @Query("SELECT m FROM Medicine m JOIN m.category c WHERE " +
           "(:keyword IS NULL OR LOWER(m.medicineName) LIKE LOWER(CONCAT('%',:keyword,'%')) OR " +
           " LOWER(m.genericName) LIKE LOWER(CONCAT('%',:keyword,'%')) OR " +
           " LOWER(m.manufacturer) LIKE LOWER(CONCAT('%',:keyword,'%'))) AND " +
           "(:categoryId IS NULL OR c.id = :categoryId) AND " +
           "(:active IS NULL OR m.active = :active)")
    List<Medicine> searchMedicines(@Param("keyword") String keyword,
                                    @Param("categoryId") Long categoryId,
                                    @Param("active") Boolean active);

    // Low stock: quantity <= minimumStockLevel (active only)
    @Query("SELECT m FROM Medicine m WHERE m.active = true AND m.quantity <= m.minimumStockLevel")
    List<Medicine> findLowStockMedicines();

    @Query("SELECT COUNT(m) FROM Medicine m WHERE m.active = true AND m.quantity <= m.minimumStockLevel")
    long countLowStockMedicines();

    // Expiry
    @Query("SELECT m FROM Medicine m WHERE m.active = true AND m.expiryDate < :today")
    List<Medicine> findExpiredMedicines(@Param("today") LocalDate today);

    @Query("SELECT m FROM Medicine m WHERE m.active = true AND m.expiryDate >= :today AND m.expiryDate <= :threshold")
    List<Medicine> findExpiringSoonMedicines(@Param("today") LocalDate today, @Param("threshold") LocalDate threshold);

    @Query("SELECT COUNT(m) FROM Medicine m WHERE m.active = true AND m.expiryDate < :today")
    long countExpiredMedicines(@Param("today") LocalDate today);

    @Query("SELECT COUNT(m) FROM Medicine m WHERE m.active = true AND m.expiryDate >= :today AND m.expiryDate <= :threshold")
    long countExpiringSoonMedicines(@Param("today") LocalDate today, @Param("threshold") LocalDate threshold);

    // Dashboard stats
    @Query("SELECT COUNT(m) FROM Medicine m WHERE m.active = true")
    long countActiveMedicines();

    @Query("SELECT COALESCE(SUM(m.quantity), 0) FROM Medicine m WHERE m.active = true")
    long sumTotalStock();
}
