package com.se182393.baidautien.repository;

import com.se182393.baidautien.entity.Cart;
import com.se182393.baidautien.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, String> {
    Optional<Cart> findByUser(User user);
}


