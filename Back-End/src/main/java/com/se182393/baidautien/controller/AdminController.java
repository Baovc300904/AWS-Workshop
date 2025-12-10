package com.se182393.baidautien.controller;

import com.se182393.baidautien.dto.request.ApiResponse;
import com.se182393.baidautien.dto.request.GameCreationRequest;
import com.se182393.baidautien.dto.request.GameUpdateRequest;
import com.se182393.baidautien.dto.response.GameResponse;
import com.se182393.baidautien.service.AdminGameService;
import org.springframework.http.MediaType;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/games")
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminController {

    AdminGameService adminGameService;

    @PostMapping
    ApiResponse<GameResponse> create(@RequestBody @Valid GameCreationRequest request){
        log.info("Admin creating game: {}", request.getName());
        return ApiResponse.<GameResponse>builder()
                .result(adminGameService.createGame(request))
                .build();
    }

    @PutMapping("/{gameId}")
    ApiResponse<GameResponse> updateGame(@PathVariable("gameId") String gameId, @RequestBody @Valid GameUpdateRequest request){
        log.info("Admin updating game: {}", gameId);
        return ApiResponse.<GameResponse>builder()
                .result(adminGameService.updateGame(gameId,request))
                .build();
    }

    @DeleteMapping("/{gameId}")
    ApiResponse<Void> deleteGame(@PathVariable("gameId") String gameId){
        log.info("Admin deleting game: {}", gameId);
        adminGameService.deleteGame(gameId);
        return ApiResponse.<Void>builder()
                .build();
    }

    // Utility endpoint to reseed categories for existing games based on name heuristics
    @PostMapping(path = "/reseed-categories")
    ApiResponse<Integer> reseedCategories(){
        int updated = adminGameService.reseedCategoriesForAllGames();
        return ApiResponse.<Integer>builder().result(updated).build();
    }

    // Convenience GET variant (so you can call from browser)
    @GetMapping("/reseed-categories")
    ApiResponse<Integer> reseedCategoriesGet(){
        int updated = adminGameService.reseedCategoriesForAllGames();
        return ApiResponse.<Integer>builder().result(updated).build();
    }
}
