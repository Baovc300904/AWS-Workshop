package com.se182393.baidautien.controller;

import com.se182393.baidautien.dto.request.ApiResponse;
import com.se182393.baidautien.dto.request.CartAddRequest;
import com.se182393.baidautien.dto.response.CartResponse;
import com.se182393.baidautien.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    ApiResponse<CartResponse> addToCart(@Valid @RequestBody CartAddRequest request) {
        return ApiResponse.<CartResponse>builder()
                .result(cartService.addToCart(request))
                .build();
    }
}


