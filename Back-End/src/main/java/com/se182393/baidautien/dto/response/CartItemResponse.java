package com.se182393.baidautien.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemResponse {
    String gameId;
    String name;
    Integer quantity;
    Double unitPrice;
    Double lineTotal;
}


