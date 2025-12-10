package com.se182393.baidautien.repository;

import com.se182393.baidautien.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,String> {
    boolean existsUserByUsername(String username);

    @EntityGraph(attributePaths = {"roles","roles.permissions"})
    Optional<User> findByUsername(String username);

    @EntityGraph(attributePaths = {"roles","roles.permissions"})
    Optional<User> findByEmail(String email);
}
