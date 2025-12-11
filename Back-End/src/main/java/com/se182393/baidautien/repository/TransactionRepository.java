package com.se182393.baidautien.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.se182393.baidautien.entity.Transaction;
import com.se182393.baidautien.entity.User;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {
    List<Transaction> findByUserOrderByCreatedAtDesc(User user);
    List<Transaction> findAllByOrderByCreatedAtDesc();
    Optional<Transaction> findByTransactionId(String transactionId);
}
