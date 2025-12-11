package com.se182393.baidautien.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.se182393.baidautien.controller.OrderController;
import com.se182393.baidautien.dto.request.OrderCreationRequest;
import com.se182393.baidautien.dto.request.PaymentCreateWithItemsRequest;
import com.se182393.baidautien.dto.response.OrderResponse;
import com.se182393.baidautien.entity.Game;
import com.se182393.baidautien.entity.Order;
import com.se182393.baidautien.entity.OrderItem;
import com.se182393.baidautien.entity.User;
import com.se182393.baidautien.exception.AppException;
import com.se182393.baidautien.exception.ErrorCode;
import com.se182393.baidautien.repository.GameRepository;
import com.se182393.baidautien.repository.OrderItemRepository;
import com.se182393.baidautien.repository.OrderRepository;
import com.se182393.baidautien.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final GameRepository gameRepository;
    private final UserRepository userRepository;
    private final CartService cartService;

    @SuppressWarnings("null")
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
    
    @Transactional
    public OrderResponse checkoutWithBalance(OrderCreationRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        
        // Calculate total
        double total = request.getItems().stream()
                .mapToDouble(item -> (item.getFinalPrice() != null ? item.getFinalPrice() : item.getUnitPrice()) * item.getQuantity())
                .sum();
        
        // Check balance
        Double currentBalance = user.getBalance() != null ? user.getBalance() : 0.0;
        if (currentBalance < total) {
            throw new RuntimeException("Insufficient balance. Current: " + currentBalance + ", Required: " + total);
        }
        
        // Deduct balance
        user.setBalance(currentBalance - total);
        userRepository.save(user);
        
        log.info("💰 Deducted {} from {}'s balance. New balance: {}", total, username, user.getBalance());
        
        // Create order with BALANCE payment method
        request.setPaymentMethod("BALANCE");
        request.setStatus("COMPLETED");
        
        return createOrder(request, username);
    }
    
    @Transactional
    public OrderResponse createOrder(OrderCreationRequest request, String username) {
        // Get user if authenticated
        User user = null;
        if (username != null) {
            user = userRepository.findByUsername(username).orElse(null);
        }
        
        // Generate order ID
        String orderId = "ORDER_" + System.currentTimeMillis();
        
        // Calculate total
        double total = request.getItems().stream()
                .mapToDouble(item -> (item.getFinalPrice() != null ? item.getFinalPrice() : item.getUnitPrice()) * item.getQuantity())
                .sum();
        
        // Create order
        Order order = Order.builder()
                .orderId(orderId)
                .user(user)
                .cart(null)
                .totalAmount(total)
                .status(request.getStatus() != null ? request.getStatus() : "PROCESSING")
                .paymentMethod(request.getPaymentMethod())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        order = orderRepository.save(order);
        
        // Create order items
        for (OrderCreationRequest.OrderItemRequest itemRequest : request.getItems()) {
            Game game = gameRepository.findById(itemRequest.getGameId())
                    .orElseThrow(() -> new AppException(ErrorCode.NO_GAMES_FOUND));
            
            double itemTotal = (itemRequest.getFinalPrice() != null ? itemRequest.getFinalPrice() : itemRequest.getUnitPrice()) * itemRequest.getQuantity();
            
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .game(game)
                    .quantity(itemRequest.getQuantity())
                    .unitPrice(itemRequest.getUnitPrice())
                    .totalPrice(itemTotal)
                    .build();
            
            orderItemRepository.save(orderItem);
        }
        
        log.info("Created order {} for user {}", orderId, username != null ? username : "guest");
        
        return toOrderResponse(order);
    }
    
    public List<OrderResponse> getOrdersByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
        
        List<Order> orders = orderRepository.findByUserOrderByCreatedAtDesc(user);
        return orders.stream()
                .map(this::toOrderResponse)
                .collect(Collectors.toList());
    }
    
    public OrderResponse getOrderById(String orderId) {
        Order order = orderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_KEY));
        return toOrderResponse(order);
    }
    
    @Transactional
    public OrderResponse fulfillOrder(String orderId, List<OrderController.FulfillOrderRequest.LicenseKeyItem> licenseKeys) {
        Order order = orderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_KEY));
        
        // Update order items with license keys
        for (OrderController.FulfillOrderRequest.LicenseKeyItem licenseKeyItem : licenseKeys) {
            OrderItem orderItem = order.getOrderItems().stream()
                    .filter(item -> item.getGame().getId().equals(licenseKeyItem.getGameId()))
                    .findFirst()
                    .orElseThrow(() -> new AppException(ErrorCode.INVALID_KEY));
            
            orderItem.setLicenseKey(licenseKeyItem.getLicenseKey());
            orderItemRepository.save(orderItem);
        }
        
        // Update order status to COMPLETED
        order.setStatus("COMPLETED");
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);
        
        log.info("Fulfilled order {} with license keys", orderId);
        
        return toOrderResponse(order);
    }
    
    private OrderResponse toOrderResponse(Order order) {
        List<OrderResponse.OrderItemResponse> items = order.getOrderItems().stream()
                .map(item -> OrderResponse.OrderItemResponse.builder()
                        .id(item.getId())
                        .gameId(item.getGame().getId())
                        .gameName(item.getGame().getName())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .totalPrice(item.getTotalPrice())
                        .licenseKey(item.getLicenseKey())
                        .build())
                .collect(Collectors.toList());
        
        return OrderResponse.builder()
                .id(order.getId())
                .orderId(order.getOrderId())
                .username(order.getUser() != null ? order.getUser().getUsername() : null)
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .paymentMethod(order.getPaymentMethod())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .items(items)
                .build();
    }
}
