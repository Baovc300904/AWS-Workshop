package com.se182393.baidautien.controller;

import com.se182393.baidautien.dto.request.ApiResponse;
import com.se182393.baidautien.service.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/s3")
@RequiredArgsConstructor
@Slf4j
public class S3Controller {

    private final S3Service s3Service;

    /**
     * Upload file to S3
     * Endpoint: POST /identity/s3/upload
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Map<String, String>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", required = false, defaultValue = "uploads") String folder) {

        log.info("Uploading file: {} to folder: {}", file.getOriginalFilename(), folder);

        String fileUrl = s3Service.uploadFile(file, folder);

        Map<String, String> response = new HashMap<>();
        response.put("url", fileUrl);
        response.put("fileName", file.getOriginalFilename());
        response.put("contentType", file.getContentType());
        response.put("size", String.valueOf(file.getSize()));

        return ApiResponse.<Map<String, String>>builder()
                .result(response)
                .build();
    }

    /**
     * Upload game image
     * Endpoint: POST /identity/s3/upload/game-image
     */
    @PostMapping(value = "/upload/game-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Map<String, String>> uploadGameImage(
            @RequestParam("file") MultipartFile file) {

        log.info("Uploading game image: {}", file.getOriginalFilename());

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("File must be an image");
        }

        String fileUrl = s3Service.uploadFile(file, "games");

        Map<String, String> response = new HashMap<>();
        response.put("url", fileUrl);
        response.put("fileName", file.getOriginalFilename());

        return ApiResponse.<Map<String, String>>builder()
                .result(response)
                .build();
    }

    /**
     * Delete file from S3
     * Endpoint: DELETE /identity/s3/delete
     */
    @DeleteMapping("/delete")
    public ApiResponse<String> deleteFile(@RequestParam("fileUrl") String fileUrl) {
        log.info("Deleting file: {}", fileUrl);

        s3Service.deleteFile(fileUrl);

        return ApiResponse.<String>builder()
                .result("File deleted successfully")
                .build();
    }

    /**
     * Generate presigned URL for temporary access
     * Endpoint: GET /identity/s3/presigned-url
     */
    @GetMapping("/presigned-url")
    public ApiResponse<Map<String, String>> generatePresignedUrl(
            @RequestParam("fileName") String fileName,
            @RequestParam(value = "expiresInMinutes", defaultValue = "60") int expiresInMinutes) {

        log.info("Generating presigned URL for: {} with expiration: {} minutes", fileName, expiresInMinutes);

        String presignedUrl = s3Service.generatePresignedUrl(fileName, Duration.ofMinutes(expiresInMinutes));

        Map<String, String> response = new HashMap<>();
        response.put("presignedUrl", presignedUrl);
        response.put("expiresIn", expiresInMinutes + " minutes");

        return ApiResponse.<Map<String, String>>builder()
                .result(response)
                .build();
    }

    /**
     * Check if file exists
     * Endpoint: GET /identity/s3/exists
     */
    @GetMapping("/exists")
    public ApiResponse<Map<String, Boolean>> checkFileExists(
            @RequestParam("fileName") String fileName) {

        boolean exists = s3Service.fileExists(fileName);

        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);

        return ApiResponse.<Map<String, Boolean>>builder()
                .result(response)
                .build();
    }
}
