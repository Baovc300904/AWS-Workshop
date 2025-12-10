package com.se182393.baidautien.controller;


import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.se182393.baidautien.dto.request.ApiResponse;
import com.se182393.baidautien.dto.request.GameCreationRequest;
import com.se182393.baidautien.dto.request.GameUpdateRequest;
import com.se182393.baidautien.dto.response.GameResponse;
import com.se182393.baidautien.service.GameService;
import com.se182393.baidautien.service.S3Service;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/games")
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GameController {

    GameService gameService;
    S3Service s3Service;


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
    @GetMapping("/name/{gameName}")
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

    // Upload game image
    @PostMapping("/{gameId}/upload-image")
    ApiResponse<String> uploadGameImage(
            @PathVariable("gameId") String gameId,
            @RequestParam("file") MultipartFile file) {

        log.info("Uploading image for game: {}", gameId);

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("File must be an image");
        }

        // Upload to S3
        String imageUrl = s3Service.uploadFile(file, "games/images");

        // Update game with new image URL
        String result = gameService.updateGameImage(gameId, imageUrl);

        return ApiResponse.<String>builder()
                .result(result)
                .build();
    }

    // Upload game cover
    @PostMapping("/{gameId}/upload-cover")
    ApiResponse<String> uploadGameCover(
            @PathVariable("gameId") String gameId,
            @RequestParam("file") MultipartFile file) {

        log.info("Uploading cover for game: {}", gameId);

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("File must be an image");
        }

        // Upload to S3
        String coverUrl = s3Service.uploadFile(file, "games/covers");

        // Update game with new cover URL
        String result = gameService.updateGameCover(gameId, coverUrl);

        return ApiResponse.<String>builder()
                .result(result)
                .build();
    }

    // Upload game video
    @PostMapping("/{gameId}/upload-video")
    ApiResponse<String> uploadGameVideo(
            @PathVariable("gameId") String gameId,
            @RequestParam("file") MultipartFile file) {

        log.info("Uploading video for game: {}", gameId);

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("video/")) {
            throw new RuntimeException("File must be a video");
        }

        // Upload to S3
        String videoUrl = s3Service.uploadFile(file, "games/videos");

        // Update game with new video URL
        String result = gameService.updateGameVideo(gameId, videoUrl);

        return ApiResponse.<String>builder()
                .result(result)
                .build();
    }
}
