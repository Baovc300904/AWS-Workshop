package com.se182393.baidautien.service;

import java.io.IOException;
import java.time.Duration;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.HeadObjectRequest;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class S3Service {

    final S3Client s3Client;
    final S3Presigner s3Presigner;

    @Value("${aws.s3.bucket-name}")
    String bucketName;

    @Value("${aws.s3.region}")
    String region;

    /**
     * Upload file lên S3 và trả về URL công khai
     * @param file MultipartFile từ request
     * @param folder Thư mục trong S3 (ví dụ: "games/images", "games/videos")
     * @return URL của file trên S3
     */
    public String uploadFile(MultipartFile file, String folder) {
        try {
            // Tạo tên file unique
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : "";
            String fileName = folder + "/" + UUID.randomUUID() + extension;

            // Upload lên S3
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .contentType(file.getContentType())
                    // ACL removed - bucket configured with public-read policy instead
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));

            // Trả về URL công khai
            String fileUrl = String.format("https://%s.s3.%s.amazonaws.com/%s",
                    bucketName, region, fileName);

            log.info("File uploaded successfully: {}", fileUrl);
            return fileUrl;

        } catch (IOException e) {
            log.error("Error uploading file to S3", e);
            throw new RuntimeException("Failed to upload file to S3", e);
        }
    }

    /**
     * Xóa file khỏi S3
     * @param fileUrl URL của file cần xóa
     */
    public void deleteFile(String fileUrl) {
        try {
            // Extract key từ URL
            String key = extractKeyFromUrl(fileUrl);

            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);
            log.info("File deleted successfully: {}", fileUrl);

        } catch (Exception e) {
            log.error("Error deleting file from S3: {}", fileUrl, e);
            throw new RuntimeException("Failed to delete file from S3", e);
        }
    }

    /**
     * Tạo presigned URL (URL tạm thời) cho file private
     * @param fileKey Key của file trong S3
     * @param duration Thời gian URL có hiệu lực
     * @return Presigned URL
     */
    public String generatePresignedUrl(String fileKey, Duration duration) {
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileKey)
                    .build();

            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(duration)
                    .getObjectRequest(getObjectRequest)
                    .build();

            PresignedGetObjectRequest presignedRequest = s3Presigner.presignGetObject(presignRequest);
            return presignedRequest.url().toString();

        } catch (Exception e) {
            log.error("Error generating presigned URL for key: {}", fileKey, e);
            throw new RuntimeException("Failed to generate presigned URL", e);
        }
    }

    /**
     * Extract key từ S3 URL
     * Example: https://bucket-name.s3.region.amazonaws.com/folder/file.jpg -> folder/file.jpg
     */
    private String extractKeyFromUrl(String url) {
        if (url == null || url.isEmpty()) {
            throw new IllegalArgumentException("URL cannot be null or empty");
        }

        // Format: https://bucket-name.s3.region.amazonaws.com/key
        String[] parts = url.split(".amazonaws.com/");
        if (parts.length < 2) {
            throw new IllegalArgumentException("Invalid S3 URL format");
        }

        return parts[1];
    }

    /**
     * Kiểm tra file có tồn tại trong S3 không
     */
    public boolean fileExists(String fileUrl) {
        try {
            String key = extractKeyFromUrl(fileUrl);
            HeadObjectRequest headObjectRequest = HeadObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            s3Client.headObject(headObjectRequest);
            return true;

        } catch (NoSuchKeyException e) {
            return false;
        } catch (Exception e) {
            log.error("Error checking file existence: {}", fileUrl, e);
            return false;
        }
    }
}

