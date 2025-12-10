package com.se182393.baidautien.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.se182393.baidautien.dto.request.ApiResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Slf4j
public class OrderController {

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<Map<String, Object>>> getAllOrders() {
        log.info("Admin fetching all orders");
        // Placeholder: Return empty list until OrderService is implemented
        return ApiResponse.<List<Map<String, Object>>>builder()
                .result(new ArrayList<>())
                .message("Order management coming soon")
                .build();
    }

    @GetMapping("/{orderId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ApiResponse<Map<String, Object>> getOrderById(@PathVariable String orderId) {
        log.info("Fetching order: {}", orderId);
        // Placeholder
        Map<String, Object> order = new HashMap<>();
        order.put("id", orderId);
        order.put("status", "pending");
        order.put("message", "Order details coming soon");
        return ApiResponse.<Map<String, Object>>builder()
                .result(order)
                .build();
    }

    @GetMapping("/summary")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Map<String, Object>> getOrderSummary() {
        log.info("Admin fetching order summary");
        Map<String, Object> summary = new HashMap<>();
        summary.put("total", 0);
        summary.put("pending", 0);
        summary.put("processing", 0);
        summary.put("completed", 0);
        summary.put("revenue", 0);
        return ApiResponse.<Map<String, Object>>builder()
                .result(summary)
                .build();
    }
}
