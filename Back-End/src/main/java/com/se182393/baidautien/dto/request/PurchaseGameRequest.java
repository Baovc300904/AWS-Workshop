package com.se182393.baidautien.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PurchaseGameRequest {
    @NotBlank(message = "Game ID is required")
    String gameId;
}
