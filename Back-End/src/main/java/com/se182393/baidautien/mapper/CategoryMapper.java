package com.se182393.baidautien.mapper;

import com.se182393.baidautien.dto.request.CategoryCreationRequest;
import com.se182393.baidautien.dto.request.CategoryUpdateRequest;
import com.se182393.baidautien.dto.response.CategoryResponse;
import com.se182393.baidautien.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;


@Mapper(componentModel = "spring")
public interface CategoryMapper {

    Category toCategory(CategoryCreationRequest request);

    CategoryResponse toCategoryResponse(Category category);


//    @Mapping(target = "roles", ignore = true)
    void updateCategory(@MappingTarget Category category, CategoryUpdateRequest request);
}
