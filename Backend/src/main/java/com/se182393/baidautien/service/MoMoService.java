package com.se182393.baidautien.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Hex;
import org.apache.commons.codec.digest.HmacUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

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

    final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> createPayment(String orderId, long amount, String orderInfo) {
        // Fallback for demo/dev when sandbox credentials are placeholders
        if ("MOMO".equalsIgnoreCase(partnerCode) || "test_access".equalsIgnoreCase(accessKey) || "test_secret".equalsIgnoreCase(secretKey)) {
            Map<String, Object> demo = new HashMap<>();
            demo.put("payUrl", redirectUrl + "?demo=1&orderId=" + orderId + "&amount=" + amount);
            demo.put("resultCode", 0);
            demo.put("message", "DEMO_REDIRECT");
            return demo;
        }
        String requestId = orderId + System.currentTimeMillis();
        String requestType = "captureWallet";
        String raw = "accessKey=" + accessKey +
                "&amount=" + amount +
                "&extraData=" + "" +
                "&ipnUrl=" + ipnUrl +
                "&orderId=" + orderId +
                "&orderInfo=" + orderInfo +
                "&partnerCode=" + partnerCode +
                "&redirectUrl=" + redirectUrl +
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
        payload.put("redirectUrl", redirectUrl);
        payload.put("ipnUrl", ipnUrl);
        payload.put("lang", "vi");
        payload.put("extraData", "");
        payload.put("requestType", requestType);
        payload.put("signature", signature);
        payload.put("accessKey", accessKey);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        ResponseEntity<Map> resp = restTemplate.postForEntity(endpoint, entity, Map.class);
        if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null) {
            return resp.getBody();
        }
        // Propagate provider error message if available
        Map<String, Object> body = resp.getBody();
        String message = body != null && body.get("message") != null ? String.valueOf(body.get("message")) : "MoMo create payment failed";
        throw new IllegalStateException(message);
    }

    public boolean verifySignature(String rawData, String signature) {
        String expected = hmacSHA256(rawData, secretKey);
        return expected.equals(signature);
        
    }

    private String hmacSHA256(String data, String key) {
        byte[] hmac = HmacUtils.hmacSha256(key.getBytes(StandardCharsets.UTF_8), data.getBytes(StandardCharsets.UTF_8));
        return Hex.encodeHexString(hmac);
    }
}


