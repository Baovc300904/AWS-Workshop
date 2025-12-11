package com.se182393.baidautien.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.FieldDefaults;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@ToString
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;
    
    @Column(name = "transaction_id")
    String transactionId; // External transaction ID (MoMo, VNPay, etc.)
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    TransactionType type; // DEPOSIT, BUY_GAME, REFUND
    
    @Column(name = "payment_method")
    String paymentMethod; // MOMO, VNPAY, CARD
    
    @Column(nullable = false)
    Double amount;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    TransactionStatus status; // PENDING, SUCCESS, FAILED, CANCELLED
    
    String description;
    
    // For BUY_GAME transactions
    @Column(name = "game_id")
    String gameId;
    
    // Link to Order if applicable
    @Column(name = "order_id")
    String orderId;
    
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = TransactionStatus.PENDING;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
