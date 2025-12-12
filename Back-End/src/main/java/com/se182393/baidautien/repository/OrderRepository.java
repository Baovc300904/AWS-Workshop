package com.se182393.baidautien.repository;

import com.se182393.baidautien.entity.Order;
import com.se182393.baidautien.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    Optional<Order> findByOrderId(String orderId);
    Optional<Order> findByUserAndStatus(User user, String status);
    List<Order> findByUserOrderByCreatedAtDesc(User user);
}
