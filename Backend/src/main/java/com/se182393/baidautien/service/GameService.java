package com.se182393.baidautien.service;


import com.se182393.baidautien.dto.request.GameCreationRequest;
import com.se182393.baidautien.dto.request.GameUpdateRequest;
import com.se182393.baidautien.dto.response.GameResponse;
import com.se182393.baidautien.entity.Game;
import com.se182393.baidautien.exception.AppException;
import com.se182393.baidautien.exception.ErrorCode;
import com.se182393.baidautien.mapper.GameMapper;
import com.se182393.baidautien.repository.CategoryRepository;
import com.se182393.baidautien.repository.GameRepository;
import com.se182393.baidautien.repository.GameRatingRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor() // cai nay se inject 1 constructor thi bean của cả dự án sẽ tự inject vào giùm mà k cần autowire
public class GameService {

    GameRepository gameRepository;
    GameMapper gameMapper;
    CategoryRepository categoryRepository;
    GameRatingRepository gameRatingRepository;


    public GameResponse createGame(GameCreationRequest request) {
        Game game = gameMapper.toGame(request);
        var category = categoryRepository.findAllById(request.getCategories());
        game.setCategories(new HashSet<>(category));

        game = gameRepository.save(game);
        GameResponse res = gameMapper.toGameResponse(game);
        res.setAverageRating(getAverageInternal(game));
        res.setRatingCount(gameRatingRepository.countByGame(game));
        return  res;
    }


    public List<GameResponse> getAll() {
        return gameRepository.findAll().stream().map(g -> {
            GameResponse r = gameMapper.toGameResponse(g);
            r.setAverageRating(getAverageInternal(g));
            r.setRatingCount(gameRatingRepository.countByGame(g));
            return r;
        }).collect(Collectors.toList());
    }


    public GameResponse getGameByName(String name) {
        Game game = gameRepository.findByNameIgnoreCase(name).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));
        GameResponse r = gameMapper.toGameResponse(game);
        r.setAverageRating(getAverageInternal(game));
        r.setRatingCount(gameRatingRepository.countByGame(game));
        return r;
    }


    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public GameResponse updateGame(String gameId, GameUpdateRequest request) {
        Game game = gameRepository.findById(gameId).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));

        gameMapper.updateGame(game, request);

        // Update categories only when provided to allow partial updates (e.g., just salePercent)
        if (request.getCategories() != null) {
            var categories = categoryRepository.findAllById(request.getCategories());
            game.setCategories(new HashSet<>(categories));
        }


        gameRepository.save(game);
        GameResponse r = gameMapper.toGameResponse(game);
        r.setAverageRating(getAverageInternal(game));
        r.setRatingCount(gameRatingRepository.countByGame(game));
        return r;
    }


    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public void deleteGame(String gameId) {
        gameRepository.deleteById(gameId);
    }


    public List<GameResponse> getGamesByNameOrCategory(String keyword) {
        List<Game> games = gameRepository.findByNameContainingIgnoreCaseOrCategories_NameContainingIgnoreCase(keyword, keyword);
        return games.stream().map(g -> {
            GameResponse r = gameMapper.toGameResponse(g);
            r.setAverageRating(getAverageInternal(g));
            r.setRatingCount(gameRatingRepository.countByGame(g));
            return r;
        }).collect(Collectors.toList());
    }

    public List<GameResponse> getAllByPriceAsc() {
        var games = gameRepository.findAllByOrderByPriceAsc();
        if (games.isEmpty()) {
            throw new AppException(ErrorCode.NO_GAMES_FOUND);
        }
        return games.stream().map(g -> {
            GameResponse r = gameMapper.toGameResponse(g);
            r.setAverageRating(getAverageInternal(g));
            r.setRatingCount(gameRatingRepository.countByGame(g));
            return r;
        }).collect(Collectors.toList());
    }

    public List<GameResponse> getAllByPriceDesc() {
        var games = gameRepository.findAllByOrderByPriceDesc();
        if (games.isEmpty()) {
            throw new AppException(ErrorCode.NO_GAMES_FOUND);
        }
        return games.stream().map(g -> {
            GameResponse r = gameMapper.toGameResponse(g);
            r.setAverageRating(getAverageInternal(g));
            r.setRatingCount(gameRatingRepository.countByGame(g));
            return r;
        }).collect(Collectors.toList());
    }

    private Double getAverageInternal(Game game) {
        Double avg = gameRatingRepository.averageForGame(game);
        return avg == null ? 0.0 : avg;
    }
}
