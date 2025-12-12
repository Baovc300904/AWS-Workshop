package com.se182393.baidautien.controller;


import com.se182393.baidautien.dto.request.ApiResponse;
import com.se182393.baidautien.dto.request.GameCreationRequest;
import com.se182393.baidautien.dto.request.GameUpdateRequest;
import com.se182393.baidautien.dto.response.GameResponse;
import com.se182393.baidautien.service.GameService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/games")
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GameController {

    GameService gameService;


    @PostMapping
    ApiResponse<GameResponse> create(@RequestBody @Valid GameCreationRequest request){
        return ApiResponse.<GameResponse>builder()
                .result(gameService.createGame(request))
                .build();
    }


    @GetMapping
    ApiResponse<List<GameResponse>> getAll(){
        return ApiResponse.<List<GameResponse>>builder()
                .result(gameService.getAll())
                .build();
    }

    // Get game by ID (UUID)
    @GetMapping("/id/{gameId}")
    ApiResponse<GameResponse> getGameById(@PathVariable("gameId") String gameId){
        return ApiResponse.<GameResponse>builder()
                .result(gameService.getGameById(gameId))
                .build();
    }

    // Get game by name (for backward compatibility)
    @GetMapping("/{gameName}")
    ApiResponse<GameResponse> getGameByName(@PathVariable("gameName") String gameName){
        return ApiResponse.<GameResponse>builder()
                .result(gameService.getGameByName(gameName))
                .build();
    }

    @PutMapping("/{gameId}")
    ApiResponse<GameResponse> updateGame(@PathVariable("gameId") String gameId, @RequestBody @Valid GameUpdateRequest request){
        return ApiResponse.<GameResponse>builder()
                .result(gameService.updateGame(gameId,request))
                .build();
    }

    @DeleteMapping("/{gameId}")
    ApiResponse<Void> deleteProduct(@PathVariable("gameId") String productId){
        gameService.deleteGame(productId);
        return ApiResponse.<Void>builder()
                .build();
    }


    @GetMapping("/search")
    ApiResponse<List<GameResponse>> searchByName(@RequestParam("keyword") String keyword){
        return ApiResponse.<List<GameResponse>>builder()
                .result(gameService.getGamesByNameOrCategory(keyword))
                .build();
    }

    // Public endpoint: danh sách game theo giá tăng dần
    @GetMapping("/by-price-asc")
    ApiResponse<List<GameResponse>> getByPriceAsc(){
        return ApiResponse.<List<GameResponse>>builder()
                .result(gameService.getAllByPriceAsc())
                .build();
    }

    // Public endpoint: danh sách game theo giá giảm dần
    @GetMapping("/by-price-desc")
    ApiResponse<List<GameResponse>> getByPriceDesc(){
        return ApiResponse.<List<GameResponse>>builder()
                .result(gameService.getAllByPriceDesc())
                .build();
    }
}
