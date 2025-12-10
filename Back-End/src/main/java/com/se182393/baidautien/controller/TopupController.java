package com.se182393.baidautien.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.se182393.baidautien.dto.request.ApiResponse;
import com.se182393.baidautien.entity.Transaction;
import com.se182393.baidautien.entity.User;
import com.se182393.baidautien.repository.TransactionRepository;
import com.se182393.baidautien.repository.UserRepository;
import com.se182393.baidautien.service.MoMoService;
import com.se182393.baidautien.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/topup")
@RequiredArgsConstructor
@Slf4j
public class TopupController {

    private final MoMoService momoService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    // Create topup request with MoMo
    @PostMapping("/momo")
    ApiResponse<Map<String, Object>> createMoMoTopup(@RequestBody Map<String, Object> request) {
        try {
            var context = SecurityContextHolder.getContext();
            String username = context.getAuthentication().getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            long amount = ((Number) request.get("amount")).longValue();
            String description = (String) request.getOrDefault("description", "Nạp tiền vào ví");

            // Create MoMo payment
            Map<String, Object> momoResult = momoService.createTopupPayment(user.getId(), amount, description);

            // Create transaction record
            Transaction transaction = Transaction.builder()
                    .user(user)
                    .transactionId((String) momoResult.get("orderId"))
                    .type("TOPUP")
                    .paymentMethod("MOMO")
                    .amount((double) amount)
                    .status("PENDING")
                    .description(description)
                    .build();
            transactionRepository.save(transaction);

            return ApiResponse.<Map<String, Object>>builder()
                    .result(momoResult)
                    .message("Payment URL created successfully")
                    .build();

        } catch (Exception e) {
            log.error("Error creating MoMo topup", e);
            throw new RuntimeException("Failed to create topup: " + e.getMessage());
        }
    }

    // MoMo callback handler for topup (both GET and POST for demo)
    @PostMapping("/momo/callback")
    ApiResponse<Void> handleMoMoCallbackPost(@RequestBody Map<String, Object> callback) {
        return processCallback(callback);
    }

    @GetMapping("/momo/callback")
    ApiResponse<Void> handleMoMoCallbackGet(@RequestParam Map<String, String> params) {
        Map<String, Object> callback = new HashMap<>(params);
        return processCallback(callback);
    }

    private ApiResponse<Void> processCallback(Map<String, Object> callback) {
        try {
            log.info("MoMo topup callback received: {}", callback);

            String orderId = (String) callback.get("orderId");
            int resultCode = (int) callback.getOrDefault("resultCode", -1);

            Transaction transaction = transactionRepository.findByTransactionId(orderId)
                    .orElseThrow(() -> new RuntimeException("Transaction not found"));

            if (resultCode == 0) {
                // Payment successful
                transaction.setStatus("SUCCESS");
                transactionRepository.save(transaction);

                // Update user balance
                userService.updateBalance(transaction.getUser().getUsername(), transaction.getAmount());

                log.info("Topup successful for user: {}, amount: {}", 
                        transaction.getUser().getUsername(), transaction.getAmount());
            } else {
                // Payment failed
                transaction.setStatus("FAILED");
                transactionRepository.save(transaction);
                log.warn("Topup failed for orderId: {}, resultCode: {}", orderId, resultCode);
            }

            return ApiResponse.<Void>builder()
                    .message("Callback processed")
                    .build();

        } catch (Exception e) {
            log.error("Error processing MoMo callback", e);
            throw new RuntimeException("Callback processing failed: " + e.getMessage());
        }
    }

    // Get transaction history for current user
    @GetMapping("/history")
    ApiResponse<List<Map<String, Object>>> getTransactionHistory() {
        try {
            var context = SecurityContextHolder.getContext();
            String username = context.getAuthentication().getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Transaction> transactions = transactionRepository.findByUserOrderByCreatedAtDesc(user);

            List<Map<String, Object>> result = transactions.stream()
                    .map(t -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", t.getId());
                        map.put("transactionId", t.getTransactionId());
                        map.put("type", t.getType());
                        map.put("paymentMethod", t.getPaymentMethod());
                        map.put("amount", t.getAmount());
                        map.put("status", t.getStatus());
                        map.put("description", t.getDescription());
                        map.put("createdAt", t.getCreatedAt());
                        return map;
                    })
                    .toList();

            return ApiResponse.<List<Map<String, Object>>>builder()
                    .result(result)
                    .build();

        } catch (Exception e) {
            log.error("Error getting transaction history", e);
            throw new RuntimeException("Failed to get history: " + e.getMessage());
        }
    }

    // Get current balance
    @GetMapping("/balance")
    ApiResponse<Map<String, Object>> getBalance() {
        try {
            var context = SecurityContextHolder.getContext();
            String username = context.getAuthentication().getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Map<String, Object> result = new HashMap<>();
            Double balance = user.getBalance();
            result.put("balance", balance != null ? balance : 0.0);
            result.put("username", user.getUsername());

            return ApiResponse.<Map<String, Object>>builder()
                    .result(result)
                    .build();

        } catch (Exception e) {
            log.error("Error getting balance", e);
            throw new RuntimeException("Failed to get balance: " + e.getMessage());
        }
    }

    // Confirm topup payment from frontend after MoMo redirect
    @PostMapping("/momo/confirm")
    public ApiResponse<Map<String, Object>> confirmTopupPayment(@RequestBody Map<String, Object> payload) {
        try {
            log.info("Confirming topup payment: {}", payload);

            String transactionId = (String) payload.get("transactionId");
            String resultCode = String.valueOf(payload.get("resultCode"));

            if (transactionId == null) {
                throw new RuntimeException("Transaction ID is required");
            }

            Transaction transaction = transactionRepository.findByTransactionId(transactionId)
                    .orElseThrow(() -> new RuntimeException("Transaction not found"));

            if ("0".equals(resultCode)) {
                // Payment successful
                transaction.setStatus("SUCCESS");
                transactionRepository.save(transaction);

                // Update user balance
                userService.updateBalance(transaction.getUser().getUsername(), transaction.getAmount());

                log.info("Topup confirmed successful: user={}, amount={}", 
                        transaction.getUser().getUsername(), transaction.getAmount());

                Map<String, Object> result = new HashMap<>();
                result.put("transactionId", transactionId);
                result.put("status", "SUCCESS");
                result.put("amount", transaction.getAmount());
                result.put("newBalance", transaction.getUser().getBalance());

                return ApiResponse.<Map<String, Object>>builder()
                        .result(result)
                        .message("Topup confirmed successfully")
                        .build();
            } else {
                // Payment failed
                transaction.setStatus("FAILED");
                transactionRepository.save(transaction);

                Map<String, Object> result = new HashMap<>();
                result.put("transactionId", transactionId);
                result.put("status", "FAILED");

                return ApiResponse.<Map<String, Object>>builder()
                        .result(result)
                        .message("Topup failed")
                        .build();
            }

        } catch (Exception e) {
            log.error("Error confirming topup payment", e);
            throw new RuntimeException("Failed to confirm topup: " + e.getMessage());
        }
    }
}

