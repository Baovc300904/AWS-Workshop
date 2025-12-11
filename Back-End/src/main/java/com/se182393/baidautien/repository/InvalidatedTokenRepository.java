package com.se182393.baidautien.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.se182393.baidautien.entity.InvalidatedToken;


@Repository
public interface InvalidatedTokenRepository extends JpaRepository<InvalidatedToken,String> {
}
