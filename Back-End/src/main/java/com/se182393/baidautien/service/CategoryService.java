package com.se182393.baidautien.service;


import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.se182393.baidautien.dto.request.CategoryCreationRequest;
import com.se182393.baidautien.dto.request.CategoryUpdateRequest;
import com.se182393.baidautien.dto.response.CategoryResponse;
import com.se182393.baidautien.entity.Category;
import com.se182393.baidautien.exception.AppException;
import com.se182393.baidautien.exception.ErrorCode;
import com.se182393.baidautien.mapper.CategoryMapper;
import com.se182393.baidautien.repository.CategoryRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor() // cai nay se inject 1 constructor thi bean của cả dự án sẽ tự inject vào giùm mà k cần autowire
public class CategoryService {

    CategoryRepository categoryRepository;
    CategoryMapper categoryMapper;


    public CategoryResponse create(CategoryCreationRequest request) {
        Category category = categoryMapper.toCategory(request);
        category = categoryRepository.save(category);
        return  categoryMapper.toCategoryResponse(category);
    }


    public List<CategoryResponse> getAll() {
        return categoryRepository.findAll().stream().map(categoryMapper::toCategoryResponse).collect(Collectors.toList());
    }


    public CategoryResponse getCategoryByName(String name) {
        Category category = categoryRepository.findByNameIgnoreCase(name).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));
        return categoryMapper.toCategoryResponse(category);
    }

    public CategoryResponse updateCategory(String categoryId, CategoryUpdateRequest request) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));

        categoryMapper.updateCategory(category, request);


        return categoryMapper.toCategoryResponse(category);
    }


    public void deleteCategory(String categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
        
        // Note: Games with this category will keep the association due to ManyToMany
        // Consider removing category from all games first if needed
        // For now, just delete - the join table entry will be removed by cascade
        categoryRepository.deleteById(categoryId);
        log.info("Deleted category: {}", categoryId);
    }
}
