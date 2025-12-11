package com.se182393.baidautien.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.se182393.baidautien.dto.request.CartAddRequest;
import com.se182393.baidautien.dto.response.CartItemResponse;
import com.se182393.baidautien.dto.response.CartResponse;
import com.se182393.baidautien.entity.Cart;
import com.se182393.baidautien.entity.CartItem;
import com.se182393.baidautien.entity.Game;
import com.se182393.baidautien.entity.User;
import com.se182393.baidautien.exception.AppException;
import com.se182393.baidautien.exception.ErrorCode;
import com.se182393.baidautien.repository.CartRepository;
import com.se182393.baidautien.repository.GameRepository;
import com.se182393.baidautien.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CartService {

    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private GameRepository gameRepository;

    @Transactional
    public CartResponse addToCart(CartAddRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (request.getGameId() == null) {
            throw new AppException(ErrorCode.NO_GAMES_FOUND);
        }
        Game game = gameRepository.findById(request.getGameId())
                .orElseThrow(() -> new AppException(ErrorCode.NO_GAMES_FOUND));

        if (request.getQuantity() == null || request.getQuantity() < 1) {
            throw new AppException(ErrorCode.INVALID_KEY);
        }

        // Check if there's enough stock
        if (game.getQuantity() < request.getQuantity()) {
            throw new AppException(ErrorCode.INVALID_KEY); // You might want to create a specific error code for insufficient stock
        }

        Cart cart = cartRepository.findByUser(user).orElseGet(() -> {
            Cart c = new Cart();
            c.setUser(user);
            return c;
        });

        // find existing line
        CartItem existing = null;
        if (cart.getItems() != null) {
            for (CartItem ci : cart.getItems()) {
                if (ci.getGame() != null && ci.getGame().getId().equals(game.getId())) {
                    existing = ci;
                    break;
                }
            }
        } else {
            cart.setItems(new ArrayList<>());
        }

        int newQuantity = existing != null ? existing.getQuantity() + request.getQuantity() : request.getQuantity();
        
        // Check total quantity in cart doesn't exceed stock
        if (game.getQuantity() < newQuantity) {
            throw new AppException(ErrorCode.INVALID_KEY); // You might want to create a specific error code for insufficient stock
        }

        if (existing == null) {
            CartItem ci = new CartItem();
            ci.setCart(cart);
            ci.setGame(game);
            ci.setQuantity(request.getQuantity());
            cart.getItems().add(ci);
        } else {
            existing.setQuantity(newQuantity);
        }

        cart = cartRepository.save(cart);
        return toResponse(cart);
    }

    public Cart getUserCart(User user) {
        return cartRepository.findByUser(user).orElse(null);
    }

    @Transactional
    public void clearCartAndUpdateInventory(User user) {
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_KEY));
        
        if (cart.getItems() != null) {
            for (CartItem item : cart.getItems()) {
                if (item.getGame() != null) {
                    Game game = item.getGame();
                    int currentQuantity = game.getQuantity();
                    int orderedQuantity = item.getQuantity();
                    
                    // Update inventory
                    game.setQuantity(currentQuantity - orderedQuantity);
                    gameRepository.save(game);
                    
                    log.info("Updated inventory for game {}: {} -> {}", 
                            game.getName(), currentQuantity, game.getQuantity());
                }
            }
            
            // Clear cart items
            cart.getItems().clear();
            cartRepository.save(cart);
            
            log.info("Cleared cart for user: {}", user.getUsername());
        }
    }

    @SuppressWarnings({"null", "boxing"})
    private CartResponse toResponse(Cart cart) {
        List<CartItemResponse> itemResponses = new ArrayList<>();
        double total = 0.0;
        if (cart.getItems() != null) {
            for (CartItem ci : cart.getItems()) {
                double unit = ci.getGame() != null ? (ci.getGame().getPrice() != null ? ci.getGame().getPrice() : 0.0) : 0.0;
                double line = unit * (ci.getQuantity() != null ? ci.getQuantity() : 0);
                total += line;
                itemResponses.add(CartItemResponse.builder()
                        .gameId(ci.getGame() != null ? ci.getGame().getId() : null)
                        .name(ci.getGame() != null ? ci.getGame().getName() : null)
                        .quantity(ci.getQuantity())
                        .unitPrice(unit)
                        .lineTotal(line)
                        .build());
            }
        }
        return CartResponse.builder()
                .cartId(cart.getId())
                .userId(cart.getUser() != null ? cart.getUser().getId() : null)
                .items(itemResponses)
                .total(total)
                .build();
    }
}


