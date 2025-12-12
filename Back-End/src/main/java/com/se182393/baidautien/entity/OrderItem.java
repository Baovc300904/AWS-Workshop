package com.se182393.baidautien.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@ToString
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    Order order;
    
    @ManyToOne(fetch = FetchType.LAZY)
    Game game;
    
    Integer quantity;
    
    Double unitPrice;
    
    Double totalPrice;
    
    String licenseKey; // License key for the game (filled by admin after payment)

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(Double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }
    
    public String getLicenseKey() {
        return licenseKey;
    }
    
    public void setLicenseKey(String licenseKey) {
        this.licenseKey = licenseKey;
    }
}
