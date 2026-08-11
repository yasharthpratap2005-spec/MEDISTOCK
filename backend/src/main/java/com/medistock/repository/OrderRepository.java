package com.medistock.repository;

import com.medistock.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findAllByOrderByCreatedAtDesc();

    List<Order> findTop10ByOrderByCreatedAtDesc();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = 'PENDING'")
    long countPendingOrders();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = 'COMPLETED'")
    long countCompletedOrders();
}
