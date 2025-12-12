package com.se182393.baidautien.dto.request;

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
public class OrderCreationRequest {
    
    @NotEmpty
    List<OrderItemRequest> items;
    
    @NotBlank
    String paymentMethod;
    
    String status; // Optional, defaults to PROCESSING
    
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
        
        Integer quantity;
        
        Double unitPrice;
        
        Double salePercent;
        
        Double finalPrice;
    }
}
