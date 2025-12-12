package com.se182393.baidautien.controller;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.se182393.baidautien.dto.request.ApiResponse;
import com.se182393.baidautien.dto.request.DepositRequest;
import com.se182393.baidautien.dto.response.TransactionResponse;
import com.se182393.baidautien.entity.Transaction;
import com.se182393.baidautien.entity.TransactionStatus;
import com.se182393.baidautien.entity.TransactionType;
import com.se182393.baidautien.entity.User;
import com.se182393.baidautien.repository.TransactionRepository;
import com.se182393.baidautien.repository.UserRepository;
import com.se182393.baidautien.service.MoMoService;
import com.se182393.baidautien.service.TransactionService;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/topup")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class TopupController {

    TransactionService transactionService;
    UserRepository userRepository;
    TransactionRepository transactionRepository;
    MoMoService momoService;

    /**
     * Lấy số dư của user hiện tại
     */
    @GetMapping("/balance")
    public ApiResponse<Map<String, Object>> getBalance() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Double balance = user.getBalance() != null ? user.getBalance() : 0.0;
        
        return ApiResponse.<Map<String, Object>>builder()
                .code(1000)
                .result(Map.of(
                    "balance", balance,
                    "username", username
                ))
                .build();
    }

    /**
     * Nạp tiền qua MoMo (endpoint mới)
     */
    @PostMapping("/deposit")
    public ApiResponse<Map<String, Object>> createMoMoDeposit(@RequestBody @Valid DepositRequest request) {
        return createTopup(request);
    }

    /**
     * Nạp tiền qua MoMo (frontend alias)
     */
    @PostMapping("/momo")
    public ApiResponse<Map<String, Object>> createMoMoTopup(@RequestBody @Valid DepositRequest request) {
        return createTopup(request);
    }

    private ApiResponse<Map<String, Object>> createTopup(DepositRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        
        log.info("User {} creating MoMo topup for amount: {}", username, request.getAmount());
        
        // Tạo transaction trước để có UUID (id)
        // PaymentController callback cần format: DEPOSIT_{transactionUUID}
        Transaction transaction = Transaction.builder()
                .user(userRepository.findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("User not found")))
                .amount(request.getAmount())
                .type(TransactionType.DEPOSIT)
                .status(TransactionStatus.PENDING)
                .paymentMethod("MOMO")
                .description("MoMo deposit")
                .build();
        transaction = transactionRepository.save(transaction);
        
        // Dùng UUID primary key (id) cho orderId
        String orderId = "DEPOSIT_" + transaction.getId();
        long amount = request.getAmount().longValue();
        String orderInfo = "Nap tien vao tai khoan " + username;
        
        // Tạo MoMo payment cho nạp tiền
        Map<String, Object> momoPayment = momoService.createPayment(orderId, amount, orderInfo);
        
        return ApiResponse.<Map<String, Object>>builder()
                .code(1000)
                .result(momoPayment)
                .build();
    }

    /**
     * Lấy lịch sử nạp tiền/giao dịch
     */
    @GetMapping("/history")
    public ApiResponse<List<TransactionResponse>> getTransactionHistory() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<TransactionResponse> history = transactionService.getUserTransactionHistory(user);
        return ApiResponse.<List<TransactionResponse>>builder()
                .code(1000)
                .result(history)
                .build();
    }
}
