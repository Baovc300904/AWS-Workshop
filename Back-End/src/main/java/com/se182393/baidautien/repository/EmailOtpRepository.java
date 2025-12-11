package com.se182393.baidautien.repository;

import com.se182393.baidautien.entity.EmailOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailOtpRepository extends JpaRepository<EmailOtp, String> {
    Optional<EmailOtp> findTopByEmailOrderByExpiresAtDesc(String email);
}


