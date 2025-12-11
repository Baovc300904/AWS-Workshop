package com.se182393.baidautien.service;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3Service {

    private final AmazonS3 amazonS3;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    public String uploadFile(MultipartFile file, String folder) {
        try {
            String fileName = folder + "/" + UUID.randomUUID() + "-" + file.getOriginalFilename();
            
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());
            metadata.setContentType(file.getContentType());

            // Don't use ACL - bucket uses bucket policy for public access
            PutObjectRequest putObjectRequest = new PutObjectRequest(
                bucketName,
                fileName,
                file.getInputStream(),
                metadata
            );

            amazonS3.putObject(putObjectRequest);
            
            String fileUrl = amazonS3.getUrl(bucketName, fileName).toString();
            log.info("File uploaded successfully to S3: {}", fileUrl);
            
            return fileUrl;
        } catch (IOException e) {
            log.error("Failed to upload file to S3", e);
            throw new RuntimeException("Failed to upload file: " + e.getMessage());
        }
    }

    public void deleteFile(String fileUrl) {
        try {
            String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            amazonS3.deleteObject(bucketName, fileName);
            log.info("File deleted successfully from S3: {}", fileName);
        } catch (Exception e) {
            log.error("Failed to delete file from S3", e);
        }
    }
}
