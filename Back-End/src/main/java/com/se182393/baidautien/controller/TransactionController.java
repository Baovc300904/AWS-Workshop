package com.se182393.baidautien.controller;

import com.se182393.baidautien.dto.request.ApiResponse;
import com.se182393.baidautien.dto.request.DepositRequest;
import com.se182393.baidautien.dto.request.PurchaseGameRequest;
import com.se182393.baidautien.dto.response.InventoryResponse;
import com.se182393.baidautien.dto.response.TransactionResponse;
import com.se182393.baidautien.entity.Game;
import com.se182393.baidautien.entity.Transaction;
import com.se182393.baidautien.entity.TransactionType;
import com.se182393.baidautien.entity.User;
import com.se182393.baidautien.repository.GameRepository;
import com.se182393.baidautien.repository.UserRepository;
import com.se182393.baidautien.service.MoMoService;
import com.se182393.baidautien.service.TransactionService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class TransactionController {

    TransactionService transactionService;
    UserRepository userRepository;
    GameRepository gameRepository;
    MoMoService momoService;

    /**
     * Lấy lịch sử giao dịch của user hiện tại
     */
    @GetMapping("/history")
    @PreAuthorize("hasRole('USER')")
    public ApiResponse<List<TransactionResponse>> getMyTransactionHistory() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<TransactionResponse> history = transactionService.getUserTransactionHistory(user);
        return ApiResponse.<List<TransactionResponse>>builder()
                .result(history)
                .build();
    }

    /**
     * Lấy danh sách game đã mua (inventory)
     */
    @GetMapping("/inventory")
    @PreAuthorize("hasRole('USER')")
    public ApiResponse<List<InventoryResponse>> getMyInventory() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<InventoryResponse> inventory = transactionService.getUserInventory(user);
        return ApiResponse.<List<InventoryResponse>>builder()
                .result(inventory)
                .build();
    }

    /**
     * Tạo yêu cầu nạp tiền vào ví
     */
    @PostMapping("/deposit")
    @PreAuthorize("hasRole('USER')")
    public ApiResponse<Map<String, Object>> createDepositRequest(@RequestBody @Valid DepositRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Tạo transaction DEPOSIT
        Transaction transaction = transactionService.createTransaction(
                user,
                TransactionType.DEPOSIT,
                request.getAmount(),
                request.getDescription() != null ? request.getDescription() : "Nạp tiền vào ví",
                null,
                null
        );

        // Tạo payment URL với MoMo
        // orderId format: DEPOSIT_{transactionId}
        String orderId = "DEPOSIT_" + transaction.getId();
        String orderInfo = "Nạp " + request.getAmount().longValue() + " VND vào ví";
        Map<String, Object> paymentResult = momoService.createPayment(orderId, request.getAmount().longValue(), orderInfo);

        return ApiResponse.<Map<String, Object>>builder()
                .result(paymentResult)
                .build();
    }

    /**
     * Mua game bằng ví (trừ tiền trực tiếp)
     */
    @PostMapping("/purchase-with-balance")
    @PreAuthorize("hasRole('USER')")
    public ApiResponse<String> purchaseGameWithBalance(@RequestBody @Valid PurchaseGameRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Game game = gameRepository.findById(request.getGameId())
                .orElseThrow(() -> new RuntimeException("Game not found"));

        Double currentBalance = user.getBalance() != null ? user.getBalance() : 0.0;
        if (currentBalance < game.getPrice()) {
            throw new RuntimeException("Số dư không đủ. Vui lòng nạp thêm tiền!");
        }

        // Trừ tiền và tạo transaction
        user.setBalance(currentBalance - game.getPrice());
        userRepository.save(user);

        Transaction transaction = transactionService.createTransaction(
                user,
                TransactionType.BUY_GAME,
                game.getPrice(),
                "Mua game: " + game.getName(),
                game.getId(),
                null
        );

        // Process purchase immediately
        transactionService.processPurchase(transaction.getId(), "BALANCE_PAYMENT");

        return ApiResponse.<String>builder()
                .result("Mua game thành công!")
                .build();
    }

    /**
     * Mua game bằng MoMo (thanh toán trực tiếp)
     */
    @PostMapping("/purchase-with-momo")
    @PreAuthorize("hasRole('USER')")
    public ApiResponse<Map<String, Object>> purchaseGameWithMomo(@RequestBody @Valid PurchaseGameRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Game game = gameRepository.findById(request.getGameId())
                .orElseThrow(() -> new RuntimeException("Game not found"));

        // Tạo transaction BUY_GAME
        Transaction transaction = transactionService.createTransaction(
                user,
                TransactionType.BUY_GAME,
                game.getPrice(),
                "Mua game: " + game.getName(),
                game.getId(),
                null
        );

        // Tạo payment URL với MoMo
        // orderId format: GAME_{transactionId}
        String orderId = "GAME_" + transaction.getId();
        String orderInfo = "Mua game: " + game.getName();
        Map<String, Object> paymentResult = momoService.createPayment(orderId, game.getPrice().longValue(), orderInfo);

        return ApiResponse.<Map<String, Object>>builder()
                .result(paymentResult)
                .build();
    }
}
