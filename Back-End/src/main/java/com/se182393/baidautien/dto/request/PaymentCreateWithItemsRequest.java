package com.se182393.baidautien.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentCreateWithItemsRequest {
    @Min(1)
    long amount;
    @NotBlank
    String orderId;
    String orderInfo;
    @NotEmpty
    List<OrderItemRequest> items;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class OrderItemRequest {
        @NotBlank
        String gameId;
        @NotBlank
        String gameName;
        @Min(1)
        Integer quantity;
        @Min(0)
        Double unitPrice;
        Double salePercent; // Optional field, no validation needed
    }
}
