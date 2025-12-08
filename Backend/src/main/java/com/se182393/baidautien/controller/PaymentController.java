package com.se182393.baidautien.controller;

import com.se182393.baidautien.dto.request.ApiResponse;
import com.se182393.baidautien.dto.request.PaymentCreateRequest;
import com.se182393.baidautien.dto.request.PaymentCreateWithItemsRequest;
import com.se182393.baidautien.service.MoMoService;
import com.se182393.baidautien.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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
}


