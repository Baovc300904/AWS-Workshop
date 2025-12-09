package com.se182393.baidautien.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;


@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class   GameCreationRequest {

    @Size(min = 2,message = "PRODUCT_NAME_INVALID")
    String name;

    @NotNull(message = "The number of quantity must be >=2")
    @Min(value = 2,message = "You must sell more or equal 2 for budget")
    Integer quantity;


    @Min(value = 10000,message = "price must be at least 10000")
    @Max(value = 1000000,message = "price must be at least 10000")
    Double price;

    // optional sale percent at creation
    Double salePercent;

    // Game image URL
    String image;

    // Game release date
    LocalDate releaseDate;

    // Game cover image URL
    String cover;

    // Game video URL
    String video;

    Set<String>  categories;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getSalePercent() {
        return salePercent;
    }

    public void setSalePercent(Double salePercent) {
        this.salePercent = salePercent;
    }

    public Set<String> getCategories() {
        return categories;
    }

    public void setCategories(Set<String> categories) {
        this.categories = categories;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public LocalDate getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(LocalDate releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getCover() {
        return cover;
    }

    public void setCover(String cover) {
        this.cover = cover;
    }

    public String getVideo() {
        return video;
    }

    public void setVideo(String video) {
        this.video = video;
    }
}
