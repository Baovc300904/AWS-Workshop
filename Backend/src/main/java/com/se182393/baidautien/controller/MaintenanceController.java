package com.se182393.baidautien.controller;

import com.se182393.baidautien.dto.request.ApiResponse;
import com.se182393.baidautien.service.AdminGameService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/maintenance")
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MaintenanceController {

    AdminGameService adminGameService;

    @PostMapping("/reseed-categories")
    public ApiResponse<Integer> reseedCategoriesPost() {
        int updated = adminGameService.reseedCategoriesForAllGames();
        return ApiResponse.<Integer>builder().result(updated).build();
    }

    @GetMapping("/reseed-categories")
    public ApiResponse<Integer> reseedCategoriesGet() {
        int updated = adminGameService.reseedCategoriesForAllGames();
        return ApiResponse.<Integer>builder().result(updated).build();
    }
}


