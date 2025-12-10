package com.se182393.baidautien.dto.request;

import java.time.LocalDate;
import java.util.List;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

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

    // System requirements (JSON string)
    String systemRequirements;

    List<String> categories;
}
