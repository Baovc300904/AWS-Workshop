package com.se182393.baidautien.configuration;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.auth.InstanceProfileCredentialsProvider;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class S3Config {

    @Value("${aws.s3.region}")
    private String region;

    @Value("${aws.s3.access-key:}")
    private String accessKey;

    @Value("${aws.s3.secret-key:}")
    private String secretKey;

    @Bean
    public AmazonS3 amazonS3() {
        AmazonS3ClientBuilder builder = AmazonS3ClientBuilder.standard()
                .withRegion(region);

        // If running on EC2 with IAM role, use instance profile
        // Otherwise use access keys
        if (accessKey == null || accessKey.isBlank() || accessKey.equals("NOT_SET")) {
            log.info("Using EC2 instance profile for S3 credentials");
            builder.withCredentials(new InstanceProfileCredentialsProvider(false));
        } else {
            log.info("Using access keys for S3 credentials");
            BasicAWSCredentials awsCreds = new BasicAWSCredentials(accessKey, secretKey);
            builder.withCredentials(new AWSStaticCredentialsProvider(awsCreds));
        }

        return builder.build();
    }
}
