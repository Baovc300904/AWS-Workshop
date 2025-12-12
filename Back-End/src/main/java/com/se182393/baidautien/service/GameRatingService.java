package com.se182393.baidautien.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.se182393.baidautien.entity.Game;
import com.se182393.baidautien.entity.GameRating;
import com.se182393.baidautien.exception.AppException;
import com.se182393.baidautien.exception.ErrorCode;
import com.se182393.baidautien.repository.GameRatingRepository;
import com.se182393.baidautien.repository.GameRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class GameRatingService {

    GameRepository gameRepository;
    GameRatingRepository ratingRepository;

    @Transactional
    public void submitRating(String gameId, int score, String clientId) {
        if (score < 1 || score > 5) {
            throw new AppException(ErrorCode.INVALID_KEY);
        }
        if (gameId == null) {
            throw new AppException(ErrorCode.PRODUCT_NOT_EXISTED);
        }
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));

        GameRating rating = ratingRepository.findByGameAndClientId(game, clientId)
                .orElse(GameRating.builder()
                        .game(game)
                        .clientId(clientId)
                        .createdAt(LocalDateTime.now())
                        .build());
        rating.setScore(score);
        rating.setUpdatedAt(LocalDateTime.now());
        ratingRepository.save(rating);
        log.info("Rating saved: game={}, clientId={}, score={}", game.getName(), clientId, score);
    }

    public double getAverage(String gameId) {
        if (gameId == null) {
            throw new AppException(ErrorCode.PRODUCT_NOT_EXISTED);
        }
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));
        Double avg = ratingRepository.averageForGame(game);
        return avg == null ? 0.0 : avg;
    }

    public long getCount(String gameId) {
        if (gameId == null) {
            throw new AppException(ErrorCode.PRODUCT_NOT_EXISTED);
        }
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));
        return ratingRepository.countByGame(game);
    }
}


