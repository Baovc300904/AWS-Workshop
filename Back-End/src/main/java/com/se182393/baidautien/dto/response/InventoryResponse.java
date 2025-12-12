package com.se182393.baidautien.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InventoryResponse {
    Long id;
    String gameId;
    String gameName;
    String gameImage;
    String licenseKey;
    LocalDateTime purchasedAt;
    Boolean activated;
    LocalDateTime activatedAt;
    String transactionId; // Link to transaction
    Double pricePaid; // Price when purchased
}
