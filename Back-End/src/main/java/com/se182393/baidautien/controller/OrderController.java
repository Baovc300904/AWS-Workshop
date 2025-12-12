package com.se182393.baidautien.controller;

import com.se182393.baidautien.dto.request.ApiResponse;
import com.se182393.baidautien.dto.request.OrderCreationRequest;
import com.se182393.baidautien.dto.response.OrderResponse;
import com.se182393.baidautien.service.OrderService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class OrderController {
    
    OrderService orderService;
    
    @PostMapping
    public ApiResponse<OrderResponse> createOrder(@RequestBody @Valid OrderCreationRequest request) {
        log.info("Creating order with {} items", request.getItems().size());
        
        // Get username from token if authenticated
        String username = null;
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
                username = auth.getName();
            }
        } catch (Exception e) {
            log.debug("No authenticated user, creating guest order");
        }
        
        OrderResponse order = orderService.createOrder(request, username);
        return ApiResponse.<OrderResponse>builder()
                .result(order)
                .build();
    }
    
    @GetMapping
    public ApiResponse<List<OrderResponse>> getMyOrders() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            throw new RuntimeException("Authentication required");
        }
        
        String username = auth.getName();
        List<OrderResponse> orders = orderService.getOrdersByUsername(username);
        return ApiResponse.<List<OrderResponse>>builder()
                .result(orders)
                .build();
    }
    
    @GetMapping("/{orderId}")
    public ApiResponse<OrderResponse> getOrder(@PathVariable String orderId) {
        OrderResponse order = orderService.getOrderById(orderId);
        return ApiResponse.<OrderResponse>builder()
                .result(order)
                .build();
    }
    
    @PostMapping("/checkout-with-balance")
    public ApiResponse<OrderResponse> checkoutWithBalance(@RequestBody @Valid OrderCreationRequest request) {
        log.info("💳 Checkout with balance: {} items", request.getItems().size());
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            throw new RuntimeException("Authentication required for balance payment");
        }
        
        String username = auth.getName();
        OrderResponse order = orderService.checkoutWithBalance(request, username);
        
        return ApiResponse.<OrderResponse>builder()
                .result(order)
                .build();
    }
    
    @PutMapping("/{orderId}/fulfill")
    public ApiResponse<OrderResponse> fulfillOrder(
            @PathVariable String orderId,
            @RequestBody FulfillOrderRequest request) {
        log.info("Fulfilling order {} with license keys", orderId);
        OrderResponse order = orderService.fulfillOrder(orderId, request.getLicenseKeys());
        return ApiResponse.<OrderResponse>builder()
                .result(order)
                .build();
    }
    
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class FulfillOrderRequest {
        private List<LicenseKeyItem> licenseKeys;
        
        @lombok.Data
        @lombok.NoArgsConstructor
        @lombok.AllArgsConstructor
        public static class LicenseKeyItem {
            private String gameId;
            private String licenseKey;
        }
    }
}
