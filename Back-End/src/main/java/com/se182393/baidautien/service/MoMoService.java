package com.se182393.baidautien.service;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.codec.digest.HmacUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MoMoService {

    @Value("${momo.partnerCode}")
    String partnerCode;
    @Value("${momo.accessKey}")
    String accessKey;
    @Value("${momo.secretKey}")
    String secretKey;
    @Value("${momo.endpoint}")
    String endpoint;
    @Value("${momo.redirectUrl}")
    String redirectUrl;
    @Value("${momo.ipnUrl}")
    String ipnUrl;
    @Value("${momo.topupRedirectUrl}")
    String topupRedirectUrl;
    @Value("${momo.topupIpnUrl}")
    String topupIpnUrl;

    final RestTemplate restTemplate = new RestTemplate();
    
    @jakarta.annotation.PostConstruct
    public void logConfig() {
        log.info("=== MoMo Config Loaded ===");
        log.info("redirectUrl: {}", redirectUrl);
        log.info("ipnUrl: {}", ipnUrl);
        log.info("topupRedirectUrl: {}", topupRedirectUrl);
        log.info("topupIpnUrl: {}", topupIpnUrl);
        log.info("========================");
    }

    public Map<String, Object> createPayment(String orderId, long amount, String orderInfo) {
        return createPaymentWithUrls(orderId, amount, orderInfo, redirectUrl, ipnUrl);
    }

    public boolean verifySignature(String rawData, String signature) {
        String expected = hmacSHA256(rawData, secretKey);
        return expected.equals(signature);
        
    }

    private String hmacSHA256(String data, String key) {
        return new HmacUtils("HmacSHA256", key.getBytes(StandardCharsets.UTF_8)).hmacHex(data);
    }

    // Create topup payment for wallet
    public Map<String, Object> createTopupPayment(String userId, long amount, String description) {
        String orderId = "TOPUP_" + userId + "_" + System.currentTimeMillis();
        String orderInfo = description != null ? description : "Nạp tiền vào ví";
        return createPaymentWithUrls(orderId, amount, orderInfo, topupRedirectUrl, topupIpnUrl);
    }
    
    private Map<String, Object> createPaymentWithUrls(String orderId, long amount, String orderInfo, String useRedirectUrl, String useIpnUrl) {
        log.info("Creating MoMo payment - orderId: {}, redirectUrl: {}, ipnUrl: {}", orderId, useRedirectUrl, useIpnUrl);
        // Fallback for demo/dev when sandbox credentials are empty or placeholders
        if (partnerCode == null || partnerCode.isEmpty() || 
            "MOMO".equalsIgnoreCase(partnerCode) || 
            accessKey == null || accessKey.isEmpty() || 
            "test_access".equalsIgnoreCase(accessKey) || 
            secretKey == null || secretKey.isEmpty() || 
            "test_secret".equalsIgnoreCase(secretKey)) {
            log.warn("MoMo credentials not configured, using DEMO mode");
            Map<String, Object> demo = new HashMap<>();
            demo.put("payUrl", useRedirectUrl + "?demo=1&orderId=" + orderId + "&amount=" + amount);
            demo.put("orderId", orderId);
            demo.put("resultCode", 0);
            demo.put("message", "DEMO_MODE - Simulated payment URL");
            return demo;
        }
        String requestId = orderId + System.currentTimeMillis();
        String requestType = "captureWallet";
        String raw = "accessKey=" + accessKey +
                "&amount=" + amount +
                "&extraData=" + "" +
                "&ipnUrl=" + useIpnUrl +
                "&orderId=" + orderId +
                "&orderInfo=" + orderInfo +
                "&partnerCode=" + partnerCode +
                "&redirectUrl=" + useRedirectUrl +
                "&requestId=" + requestId +
                "&requestType=" + requestType;

        String signature = hmacSHA256(raw, secretKey);

        Map<String, Object> payload = new HashMap<>();
        payload.put("partnerCode", partnerCode);
        payload.put("partnerName", "Test");
        payload.put("storeId", "MoMoTestStore");
        payload.put("requestId", requestId);
        payload.put("amount", String.valueOf(amount));
        payload.put("orderId", orderId);
        payload.put("orderInfo", orderInfo);
        payload.put("redirectUrl", useRedirectUrl);
        payload.put("ipnUrl", useIpnUrl);
        payload.put("lang", "vi");
        payload.put("extraData", "");
        payload.put("requestType", requestType);
        payload.put("signature", signature);
        payload.put("accessKey", accessKey);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        @SuppressWarnings("unchecked")
        ResponseEntity<Map<String, Object>> resp = (ResponseEntity<Map<String, Object>>) (ResponseEntity<?>) restTemplate.postForEntity(endpoint, entity, Map.class);
        if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null) {
            return resp.getBody();
        }
        // Propagate provider error message if available
        Map<String, Object> body = resp.getBody();
        String message = body != null && body.get("message") != null ? String.valueOf(body.get("message")) : "MoMo create payment failed";
        throw new IllegalStateException(message);
    }
}


