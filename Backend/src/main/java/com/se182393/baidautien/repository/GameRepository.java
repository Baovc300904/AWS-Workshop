package com.se182393.baidautien.repository;

import com.se182393.baidautien.entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameRepository extends JpaRepository<Game,String> {
    Optional<Game> findByNameIgnoreCase(String name);


    List<Game> findByNameContainingIgnoreCaseOrCategories_NameContainingIgnoreCase(String name, String categoryName);

    List<Game> findAllByOrderByPriceAsc();

    List<Game> findAllByOrderByPriceDesc();

}
