package com.se182393.baidautien.controller;

import com.se182393.baidautien.dto.request.ApiResponse;
import com.se182393.baidautien.service.GameRatingService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ratings")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GameRatingController {

    GameRatingService ratingService;

    @PostMapping(path = "/{gameId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ApiResponse<Void> submit(@PathVariable String gameId, @RequestBody SubmitRequest req) {
        ratingService.submitRating(gameId, req.score, req.clientId);
        return ApiResponse.<Void>builder().build();
    }

    @GetMapping("/{gameId}/avg")
    public ApiResponse<Double> average(@PathVariable String gameId) {
        return ApiResponse.<Double>builder().result(ratingService.getAverage(gameId)).build();
    }

    @GetMapping("/{gameId}/count")
    public ApiResponse<Long> count(@PathVariable String gameId) {
        return ApiResponse.<Long>builder().result(ratingService.getCount(gameId)).build();
    }

    public static class SubmitRequest {
        public int score;
        public String clientId; // generated on frontend
    }
}


