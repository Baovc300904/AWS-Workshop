package com.se182393.baidautien.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.se182393.baidautien.dto.request.ApiResponse;
import com.se182393.baidautien.dto.request.PaymentCreateRequest;
import com.se182393.baidautien.dto.request.PaymentCreateWithItemsRequest;
import com.se182393.baidautien.service.MoMoService;
import com.se182393.baidautien.service.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/payment/momo")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final MoMoService momoService;
    private final OrderService orderService;

    @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ApiResponse<Map<String, Object>> createPayment(@RequestBody @Valid PaymentCreateRequest request) {
        // Create order first
        orderService.createOrderFromCart(request.getOrderId(), request.getAmount());
        
        // Create MoMo payment
        Map<String, Object> result = momoService.createPayment(request.getOrderId(), request.getAmount(), request.getOrderInfo());
        return ApiResponse.<Map<String, Object>>builder().result(result).build();
    }

    @PostMapping(value = "/create-with-items", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ApiResponse<Map<String, Object>> createPaymentWithItems(@RequestBody @Valid PaymentCreateWithItemsRequest request) {
        try {
            log.info("Received payment request: orderId={}, amount={}, items={}", 
                    request.getOrderId(), request.getAmount(), request.getItems().size());
            
            // Create order with items first
            orderService.createOrderFromItems(request);
            
            // Create MoMo payment
            Map<String, Object> result = momoService.createPayment(request.getOrderId(), request.getAmount(), request.getOrderInfo());
            return ApiResponse.<Map<String, Object>>builder().result(result).build();
        } catch (Exception e) {
            log.error("Error creating payment with items", e);
            throw e;
        }
    }

    // MoMo IPN callback (sandbox)
    @PostMapping("/callback")
    public String ipnCallback(@RequestBody Map<String, Object> payload) {
        log.info("Received MoMo callback: {}", payload);
        
        try {
            String orderId = (String) payload.get("orderId");
            String resultCode = String.valueOf(payload.get("resultCode"));
            
            if (orderId != null) {
                if ("0".equals(resultCode)) {
                    // Payment successful
                    orderService.processSuccessfulPayment(orderId);
                    log.info("Payment successful for order: {}", orderId);
                } else {
                    // Payment failed
                    orderService.processFailedPayment(orderId);
                    log.info("Payment failed for order: {}", orderId);
                }
            }
        } catch (Exception e) {
            log.error("Error processing MoMo callback", e);
        }
        
        return "success";
    }

    // Check payment status
    @GetMapping("/status/{orderId}")
    public ApiResponse<Map<String, Object>> checkPaymentStatus(@PathVariable String orderId) {
        log.info("Checking payment status for order: {}", orderId);
        try {
            Map<String, Object> status = orderService.getOrderStatus(orderId);
            return ApiResponse.<Map<String, Object>>builder().result(status).build();
        } catch (Exception e) {
            log.error("Error checking payment status", e);
            throw e;
        }
    }

    // Manual test endpoint to simulate successful payment
    @PostMapping("/test-success/{orderId}")
    public String testSuccessfulPayment(@PathVariable String orderId) {
        log.info("Manual test: Processing successful payment for order: {}", orderId);
        try {
            orderService.processSuccessfulPayment(orderId);
            return "Payment processed successfully for order: " + orderId;
        } catch (Exception e) {
            log.error("Error processing test payment", e);
            return "Error: " + e.getMessage();
        }
    }

    // Confirm payment from frontend after MoMo redirect
    @PostMapping("/confirm/{orderId}")
    public ApiResponse<Map<String, Object>> confirmPayment(
            @PathVariable String orderId,
            @RequestBody Map<String, Object> payload) {
        log.info("Confirming payment for order: {} with payload: {}", orderId, payload);
        
        try {
            String resultCode = String.valueOf(payload.get("resultCode"));
            
            if ("0".equals(resultCode)) {
                // Payment successful
                orderService.processSuccessfulPayment(orderId);
                
                Map<String, Object> result = new HashMap<>();
                result.put("orderId", orderId);
                result.put("status", "COMPLETED");
                result.put("message", "Payment confirmed successfully");
                
                return ApiResponse.<Map<String, Object>>builder().result(result).build();
            } else {
                // Payment failed
                orderService.processFailedPayment(orderId);
                
                Map<String, Object> result = new HashMap<>();
                result.put("orderId", orderId);
                result.put("status", "FAILED");
                result.put("message", payload.get("message"));
                
                return ApiResponse.<Map<String, Object>>builder().result(result).build();
            }
        } catch (Exception e) {
            log.error("Error confirming payment", e);
            throw e;
        }
    }
}


