package com.se182393.baidautien.repository;

import com.se182393.baidautien.entity.Game;
import com.se182393.baidautien.entity.GameRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface GameRatingRepository extends JpaRepository<GameRating, String> {
    long countByGame(Game game);

    @Query("select avg(r.score) from GameRating r where r.game = :game")
    Double averageForGame(Game game);

    Optional<GameRating> findByGameAndClientId(Game game, String clientId);
}


