package com.se182393.baidautien.entity;

public enum TransactionType {
    DEPOSIT("Nạp tiền vào ví"),
    TOPUP("Nạp tiền"),  // Alias for DEPOSIT
    BUY_GAME("Mua game"),
    PURCHASE("Mua game"),  // Alias for BUY_GAME
    REFUND("Hoàn tiền");

    private final String description;

    TransactionType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
