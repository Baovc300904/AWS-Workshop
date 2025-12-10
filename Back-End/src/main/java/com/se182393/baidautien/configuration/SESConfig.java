package com.se182393.baidautien.configuration;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.ses.SesClient;

@Configuration
@Slf4j
public class SESConfig {

    @Value("${aws.ses.region:ap-southeast-1}")
    private String region;

    @Bean
    public SesClient sesClient() {
        log.info("Initializing AWS SES Client for region: {}", region);

        return SesClient.builder()
                .region(Region.of(region))
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build();
    }
}

