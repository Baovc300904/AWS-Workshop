package com.se182393.baidautien.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DepositRequest {
    @NotNull(message = "Amount is required")
    @Min(value = 10000, message = "Minimum deposit is 10,000 VND")
    Double amount;
    
    String description;
}
