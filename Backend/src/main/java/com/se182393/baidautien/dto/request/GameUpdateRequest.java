package com.se182393.baidautien.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GameUpdateRequest {
    String name;
    Integer quantity;
    Double price;
    Double salePercent;

    // Game image URL
    String image;

    // Game release date
    LocalDate releaseDate;

    // Game cover image URL
    String cover;

    // Game video URL
    String video;

    List<String> categories;
}
