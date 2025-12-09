package com.se182393.baidautien.service;

import com.se182393.baidautien.dto.request.PaymentCreateWithItemsRequest;
import com.se182393.baidautien.entity.*;
import com.se182393.baidautien.exception.AppException;
import com.se182393.baidautien.exception.ErrorCode;
import com.se182393.baidautien.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final GameRepository gameRepository;
    private final CartService cartService;
    private final UserRepository userRepository;

    @Transactional
    public Order createOrderFromItems(PaymentCreateWithItemsRequest request) {
        // Create order without user (guest checkout)
        Order order = Order.builder()
                .orderId(request.getOrderId())
                .user(null) // Guest user
                .cart(null) // No cart association for guest
                .totalAmount((double) request.getAmount())
                .status("PENDING")
                .paymentMethod("MOMO")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        order = orderRepository.save(order);
        
        // Create order items and update inventory immediately
        for (PaymentCreateWithItemsRequest.OrderItemRequest itemRequest : request.getItems()) {
            log.info("Processing item: gameId={}, gameName={}, quantity={}", 
                    itemRequest.getGameId(), itemRequest.getGameName(), itemRequest.getQuantity());
            
            Game game = gameRepository.findById(itemRequest.getGameId())
                    .orElseThrow(() -> {
                        log.error("Game not found with ID: {}", itemRequest.getGameId());
                        return new AppException(ErrorCode.NO_GAMES_FOUND);
                    });
            
            // Check stock availability
            if (game.getQuantity() < itemRequest.getQuantity()) {
                throw new AppException(ErrorCode.INVALID_KEY); // Insufficient stock
            }
            
            // Update inventory immediately (reserve stock)
            int currentQuantity = game.getQuantity();
            int orderedQuantity = itemRequest.getQuantity();
            game.setQuantity(currentQuantity - orderedQuantity);
            gameRepository.save(game);
            
            log.info("Updated inventory for game {}: {} -> {}", 
                    game.getName(), currentQuantity, game.getQuantity());
            
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .game(game)
                    .quantity(itemRequest.getQuantity())
                    .unitPrice(itemRequest.getUnitPrice())
                    .totalPrice(itemRequest.getUnitPrice() * itemRequest.getQuantity())
                    .build();
            
            orderItemRepository.save(orderItem);
        }
        
        log.info("Created guest order {} with {} items", request.getOrderId(), request.getItems().size());
        
        return order;
    }

    @Transactional
    public Order createOrderFromCart(String orderId, double totalAmount) {
        // For guest checkout, we don't require authentication
        // The cart items are passed from frontend via localStorage
        // We'll create a temporary order without user association
        
        // Create order without user (guest checkout)
        Order order = Order.builder()
                .orderId(orderId)
                .user(null) // Guest user
                .cart(null) // No cart association for guest
                .totalAmount(totalAmount)
                .status("PENDING")
                .paymentMethod("MOMO")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        order = orderRepository.save(order);
        log.info("Created guest order {}", orderId);
        
        return order;
    }

    @Transactional
    public void processSuccessfulPayment(String orderId) {
        Order order = orderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_KEY));

        if (!"PENDING".equals(order.getStatus())) {
            log.warn("Order {} is not in PENDING status, current status: {}", orderId, order.getStatus());
            return;
        }

        // Update order status
        order.setStatus("COMPLETED");
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);

        // Inventory was already updated when order was created
        // No need to update again here
        log.info("Order {} completed - inventory was already reserved during order creation", orderId);
        
        // Clear cart if user is logged in
        if (order.getUser() != null) {
            cartService.clearCartAndUpdateInventory(order.getUser());
        } else {
            log.info("Guest order completed - inventory updated from order items");
        }

        log.info("Successfully processed payment for order: {}", orderId);
    }

    @Transactional
    public void processFailedPayment(String orderId) {
        Order order = orderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_KEY));

        order.setStatus("FAILED");
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);

        log.info("Marked order {} as FAILED", orderId);
    }
}
