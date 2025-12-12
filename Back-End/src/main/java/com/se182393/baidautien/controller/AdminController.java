package com.se182393.baidautien.controller;

import com.se182393.baidautien.dto.request.ApiResponse;
import com.se182393.baidautien.dto.request.GameCreationRequest;
import com.se182393.baidautien.dto.request.GameUpdateRequest;
import com.se182393.baidautien.dto.response.AdminReportResponse;
import com.se182393.baidautien.dto.response.GameResponse;
import com.se182393.baidautien.dto.response.TransactionResponse;
import com.se182393.baidautien.entity.TransactionStatus;
import com.se182393.baidautien.entity.TransactionType;
import com.se182393.baidautien.repository.*;
import com.se182393.baidautien.service.AdminGameService;
import com.se182393.baidautien.service.TransactionService;
import org.springframework.http.MediaType;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminController {

    AdminGameService adminGameService;
    TransactionService transactionService;
    TransactionRepository transactionRepository;
    UserRepository userRepository;
    GameRepository gameRepository;
    OrderRepository orderRepository;

    // ==================== GAME MANAGEMENT ====================
    
    @PostMapping("/games")
    ApiResponse<GameResponse> create(@RequestBody @Valid GameCreationRequest request){
        log.info("Admin creating game: {}", request.getName());
        return ApiResponse.<GameResponse>builder()
                .result(adminGameService.createGame(request))
                .build();
    }

    @PutMapping("/games/{gameId}")
    ApiResponse<GameResponse> updateGame(@PathVariable("gameId") String gameId, @RequestBody @Valid GameUpdateRequest request){
        log.info("Admin updating game: {}", gameId);
        return ApiResponse.<GameResponse>builder()
                .result(adminGameService.updateGame(gameId,request))
                .build();
    }

    @DeleteMapping("/games/{gameId}")
    ApiResponse<Void> deleteGame(@PathVariable("gameId") String gameId){
        log.info("Admin deleting game: {}", gameId);
        adminGameService.deleteGame(gameId);
        return ApiResponse.<Void>builder()
                .build();
    }

    // Utility endpoint to reseed categories for existing games based on name heuristics
    @PostMapping(path = "/games/reseed-categories")
    ApiResponse<Integer> reseedCategories(){
        int updated = adminGameService.reseedCategoriesForAllGames();
        return ApiResponse.<Integer>builder().result(updated).build();
    }

    // Convenience GET variant (so you can call from browser)
    @GetMapping("/games/reseed-categories")
    ApiResponse<Integer> reseedCategoriesGet(){
        int updated = adminGameService.reseedCategoriesForAllGames();
        return ApiResponse.<Integer>builder().result(updated).build();
    }
    
    // ==================== REPORTS & ANALYTICS ====================
    
    /**
     * Lấy báo cáo tổng quan hệ thống (Admin only)
     */
    @GetMapping("/reports")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<AdminReportResponse> getSystemReports() {
        // Total transactions
        Long totalTransactions = transactionRepository.count();
        
        // Successful vs Failed transactions
        Long successfulTransactions = transactionRepository.findAll().stream()
                .filter(t -> t.getStatus() == TransactionStatus.SUCCESS)
                .count();
        
        Long failedTransactions = transactionRepository.findAll().stream()
                .filter(t -> t.getStatus() == TransactionStatus.FAILED)
                .count();

        // Total revenue (all successful transactions)
        Double totalRevenue = transactionRepository.findAll().stream()
                .filter(t -> t.getStatus() == TransactionStatus.SUCCESS)
                .mapToDouble(t -> t.getAmount() != null ? t.getAmount() : 0.0)
                .sum();

        // Total deposits
        Double totalDeposits = transactionRepository.findAll().stream()
                .filter(t -> t.getStatus() == TransactionStatus.SUCCESS 
                        && t.getType() == TransactionType.DEPOSIT)
                .mapToDouble(t -> t.getAmount() != null ? t.getAmount() : 0.0)
                .sum();

        // Total game sales
        Double totalGameSales = transactionRepository.findAll().stream()
                .filter(t -> t.getStatus() == TransactionStatus.SUCCESS 
                        && t.getType() == TransactionType.BUY_GAME)
                .mapToDouble(t -> t.getAmount() != null ? t.getAmount() : 0.0)
                .sum();

        // Total users, games, orders
        Long totalUsers = userRepository.count();
        Long totalGames = gameRepository.count();
        Long totalOrders = orderRepository.count();

        AdminReportResponse report = AdminReportResponse.builder()
                .totalTransactions(totalTransactions)
                .successfulTransactions(successfulTransactions)
                .failedTransactions(failedTransactions)
                .totalRevenue(totalRevenue)
                .totalDeposits(totalDeposits)
                .totalGameSales(totalGameSales)
                .totalUsers(totalUsers)
                .totalGames(totalGames)
                .totalOrders(totalOrders)
                .build();

        return ApiResponse.<AdminReportResponse>builder()
                .result(report)
                .build();
    }

    /**
     * Lấy tất cả transactions (Admin only)
     */
    @GetMapping("/transactions")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<TransactionResponse>> getAllTransactions() {
        List<TransactionResponse> transactions = transactionService.getAllTransactions();
        return ApiResponse.<List<TransactionResponse>>builder()
                .result(transactions)
                .build();
    }

    // ==================== ORDER MANAGEMENT ====================
    
    /**
     * Lấy tất cả orders (Admin only)
     */
    @GetMapping("/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<Object>> getAllOrders() {
        Long totalOrders = orderRepository.count();
        log.info("Admin getting all orders. Total count: {}", totalOrders);
        // Return empty list for now - proper implementation with OrderService later
        return ApiResponse.<List<Object>>builder()
                .code(1000)
                .message("Orders endpoint - implementation pending")
                .result(List.of())
                .build();
    }
    
    /**
     * Lấy orders theo tháng (Admin only)
     */
    @GetMapping("/orders/monthly-sales")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<Object>> getMonthlySales() {
        log.info("Admin getting monthly sales");
        // Return empty array - frontend expects array of monthly data
        return ApiResponse.<List<Object>>builder()
                .code(1000)
                .result(List.of())
                .build();
    }
    
    /**
     * Lấy orders tổng hợp (Admin only)
     */
    @GetMapping("/orders/summary")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<java.util.Map<String, Object>> getOrdersSummary() {
        Long totalOrders = orderRepository.count();
        log.info("Admin getting orders summary. Total orders: {}", totalOrders);
        
        // Return proper summary object
        java.util.Map<String, Object> summary = new java.util.HashMap<>();
        summary.put("totalOrders", totalOrders);
        summary.put("pendingOrders", 0L);
        summary.put("completedOrders", 0L);
        summary.put("totalRevenue", 0.0);
        
        return ApiResponse.<java.util.Map<String, Object>>builder()
                .code(1000)
                .result(summary)
                .build();
    }
    
    /**
     * Lấy orders recent limit (Admin only)
     */
    @GetMapping("/orders/recent-limit")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<Object>> getRecentOrders() {
        log.info("Admin getting recent orders");
        // Return empty list
        return ApiResponse.<List<Object>>builder()
                .code(1000)
                .result(List.of())
                .build();
    }
}
