package com.timesmanager.api.config;

import java.net.URI;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;

@Configuration
public class DynamoDBConfig {

    private final DynamoDbProperties properties;

    public DynamoDBConfig(DynamoDbProperties properties) {
        this.properties = properties;
    }

    @Bean
    public DynamoDbClient dynamoDbClient() {
        var builder = DynamoDbClient.builder()
                .region(Region.of(properties.getRegion()));

        if (properties.getEndpoint() != null && !properties.getEndpoint().isBlank()) {
            builder
                .endpointOverride(URI.create(properties.getEndpoint()))
                .credentialsProvider(StaticCredentialsProvider.create(
                    AwsBasicCredentials.create(
                        properties.getAccessKey(),
                        properties.getSecretKey()
                    )
                ));
        } else {
            builder.credentialsProvider(DefaultCredentialsProvider.create());
        }

        return builder.build();
    }
}