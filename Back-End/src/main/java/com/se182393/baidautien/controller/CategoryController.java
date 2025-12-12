package com.se182393.baidautien.controller;


import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.se182393.baidautien.dto.request.ApiResponse;
import com.se182393.baidautien.dto.request.CategoryCreationRequest;
import com.se182393.baidautien.dto.request.CategoryUpdateRequest;
import com.se182393.baidautien.dto.response.CategoryResponse;
import com.se182393.baidautien.service.CategoryService;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/category")
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryController {

    CategoryService categoryService;


    @PostMapping
    ApiResponse<CategoryResponse> create(@RequestBody @Valid CategoryCreationRequest request){
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.create(request))
                .build();
    }


    @GetMapping
    ApiResponse<List<CategoryResponse>> getAll(){
        return ApiResponse.<List<CategoryResponse>>builder()
                .result(categoryService.getAll())
                .build();
    }

    @GetMapping("/{categoryName}")
    ApiResponse<CategoryResponse> getCategoryByName(@PathVariable("categoryName") String categoryName){
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.getCategoryByName(categoryName))
                .build();
    }

    @PutMapping("/{categoryId}")
    ApiResponse<CategoryResponse> updateCategory(@PathVariable("categoryId") String categoryId, @RequestBody @Valid CategoryUpdateRequest request){
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.updateCategory(categoryId,request))
                .build();
    }

    @DeleteMapping("/{categoryId}")
    ApiResponse<Void> deleteCategory(@PathVariable("categoryId") String categoryId){
        categoryService.deleteCategory(categoryId);
        return ApiResponse.<Void>builder()
                .build();
    }

}
