package com.se182393.baidautien.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;
    
    @Column(name = "license_key", nullable = false, unique = true)
    private String licenseKey;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", referencedColumnName = "order_id")
    private Order order;
    
    @Column(name = "transaction_id")
    private String transactionId; // Link to Transaction for payment tracking
    
    @Column(name = "purchased_at")
    private LocalDateTime purchasedAt;
    
    @Column(name = "activated")
    private Boolean activated;
    
    @Column(name = "activated_at")
    private LocalDateTime activatedAt;
}
