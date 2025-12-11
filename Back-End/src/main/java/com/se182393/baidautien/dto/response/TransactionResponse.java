package com.se182393.baidautien.dto.response;

import com.se182393.baidautien.entity.TransactionStatus;
import com.se182393.baidautien.entity.TransactionType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TransactionResponse {
    String id;
    String userId;
    String userName; // firstName + lastName
    String transactionId; // External ID from MoMo
    TransactionType type;
    String paymentMethod;
    Double amount;
    TransactionStatus status;
    String description;
    String gameId;
    String gameName; // If type is BUY_GAME
    String orderId;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
