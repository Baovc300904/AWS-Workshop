package com.se182393.baidautien.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;

import com.se182393.baidautien.dto.request.GameCreationRequest;
import com.se182393.baidautien.dto.request.GameUpdateRequest;
import com.se182393.baidautien.dto.response.GameResponse;
import com.se182393.baidautien.entity.Category;
import com.se182393.baidautien.entity.Game;
import com.se182393.baidautien.exception.AppException;
import com.se182393.baidautien.exception.ErrorCode;
import com.se182393.baidautien.mapper.GameMapper;
import com.se182393.baidautien.repository.CategoryRepository;
import com.se182393.baidautien.repository.GameRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor()
public class AdminGameService {

    GameRepository gameRepository;
    GameMapper gameMapper;
    CategoryRepository categoryRepository;

    @SuppressWarnings("null")
    public GameResponse createGame(GameCreationRequest request) {
        log.info("Admin creating game: {}", request.getName());
        Game game = gameMapper.toGame(request);
        var category = categoryRepository.findAllById(request.getCategories() != null ? request.getCategories() : new HashSet<>());
        game.setCategories(new HashSet<>(category));

        game = gameRepository.save(game);
        return gameMapper.toGameResponse(game);
    }

    @SuppressWarnings("null")
    public GameResponse updateGame(String gameId, GameUpdateRequest request) {
        log.info("Admin updating game: {} with request: {}", gameId, request);
        if (gameId == null) {
            throw new AppException(ErrorCode.PRODUCT_NOT_EXISTED);
        }
        Game game = gameRepository.findById(gameId).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));
        log.info("Found game before update: {}", game);

        // Update fields manually instead of using mapper
        if (request.getName() != null) {
            game.setName(request.getName());
        }
        if (request.getPrice() != null) {
            game.setPrice(request.getPrice());
        }
        if (request.getQuantity() != null) {
            game.setQuantity(request.getQuantity());
        }
        if (request.getSalePercent() != null) {
            game.setSalePercent(request.getSalePercent());
        }
        if (request.getImage() != null) {
            game.setImage(request.getImage());
        }
        if (request.getReleaseDate() != null) {
            game.setReleaseDate(request.getReleaseDate());
        }
        if (request.getCover() != null) {
            game.setCover(request.getCover());
        }
        if (request.getVideo() != null) {
            game.setVideo(request.getVideo());
        }
        
        log.info("Game after manual update: {}", game);

        // Update categories only when provided to allow partial updates (e.g., just salePercent)
        if (request.getCategories() != null) {
            var categories = categoryRepository.findAllById(request.getCategories());
            game.setCategories(new HashSet<>(categories));
            log.info("Updated categories: {}", categories);
        }

        game = gameRepository.save(game);
        log.info("Game after save: {}", game);
        return gameMapper.toGameResponse(game);
    }

    public void deleteGame(String gameId) {
        log.info("Admin deleting game: {}", gameId);
        if (gameId != null) {
            gameRepository.deleteById(gameId);
        }
    }

    @SuppressWarnings("null")
    public int reseedCategoriesForAllGames() {
        var games = gameRepository.findAll();
        int updated = 0;
        for (Game g : games) {
            var tags = determineTags(g.getName());
            if (tags.isEmpty()) continue;

            List<Category> cats = new ArrayList<>();
            for (String t : tags) {
                var existing = categoryRepository.findById(t).orElseGet(() -> {
                    Category c = new Category();
                    c.setName(t);
                    c.setDescription(null);
                    return categoryRepository.save(c);
                });
                cats.add(existing);
            }
            g.setCategories(new HashSet<>(cats));
            gameRepository.save(g);
            updated++;
        }
        log.info("Reseeded categories for {} games", updated);
        return updated;
    }

    private List<String> determineTags(String name) {
        String n = name == null ? "" : name.toLowerCase(Locale.ROOT);
        List<String> result = new ArrayList<>();
        if (n.contains("phasmophobia")) { result.add("Horror"); result.add("Co-op"); result.add("Multiplayer"); }
        else if (n.contains("palworld") || n.contains("palword")) { result.add("Survival"); result.add("Open World"); result.add("Creature"); }
        else if (n.contains("repo")) { result.add("Action"); result.add("Adventure"); }
        else if (n.contains("peak")) { result.add("Multiplayer"); result.add("Casual"); }
        else if (n.contains("call of duty") || n.contains("cod")) { result.add("Shooter"); result.add("Action"); }
        else if (n.contains("v rising") || n.contains("v-rising") || n.contains("vrising")) { result.add("Action"); }
        return result;
    }
}
