package com.se182393.baidautien.repository;

import com.se182393.baidautien.entity.PhoneOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PhoneOtpRepository extends JpaRepository<PhoneOtp, String> {
    Optional<PhoneOtp> findTopByPhoneOrderByExpiresAtDesc(String phone);
    Optional<PhoneOtp> findByPhoneAndCode(String phone, String code);
}


