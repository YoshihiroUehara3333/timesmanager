package com.timesmanager.api.feature.thread.repository;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import com.timesmanager.api.common.dynamodb.AbstractDynamoRepository;
import com.timesmanager.api.common.enums.DynamoAttrName;
import com.timesmanager.api.feature.thread.domain.ThreadReply;

import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.UpdateItemRequest;

@Repository
public class ThreadReplyDynamoRepository
        extends AbstractDynamoRepository
        implements ThreadReplyRepository {

	/* Logger */
    private static final Logger log =
            LoggerFactory.getLogger(ThreadReplyDynamoRepository.class);

    public ThreadReplyDynamoRepository(
            DynamoDbClient dynamoDbClient,
            @Value("${aws.dynamodb.tableName}") String tableName) {
        super(dynamoDbClient, tableName);
    }

    /**
     * 
     */
    @Override
    public void save(ThreadReply domain) {
        log.info("ThreadReplyDynamoRepository.save: userId={}, date={}, replyTs={}",
                domain.getUserId(),
                domain.getDate(),
                domain.getReplyTs());

        Map<String, AttributeValue> key = Map.of(
        		DynamoAttrName.PK.getValue(), AttributeValue.builder()
                        .s(domain.getUserId() + "/THREAD")
                        .build(),
                DynamoAttrName.SK.getValue(), AttributeValue.builder()
                        .s(domain.getDate())
                        .build()
        );

        Map<String, AttributeValue> replyMap = Map.of(
                "user_id", AttributeValue.builder().s(domain.getUserId()).build(),
                "channel_id", AttributeValue.builder().s(domain.getChannelId()).build(),
                "thread_ts", AttributeValue.builder().s(domain.getParentTs()).build(),
                "reply_ts", AttributeValue.builder().s(domain.getReplyTs()).build(),
                "text", AttributeValue.builder().s(domain.getText()).build()
        );

        UpdateItemRequest request = UpdateItemRequest.builder()
                .tableName(tableName)
                .key(key)
                .updateExpression("""
                        SET #replies = list_append(if_not_exists(#replies, :emptyList), :newReply)
                        ADD #replyTsSet :replyTsSet
                        """)
                .conditionExpression("""
                        attribute_exists(#pk)
                        AND attribute_exists(#sk)
                        AND (attribute_not_exists(#replyTsSet) OR NOT contains(#replyTsSet, :replyTs))
                        """)
                .expressionAttributeNames(Map.of(
                        "#pk", DynamoAttrName.PK.getValue(),
                        "#sk", DynamoAttrName.SK.getValue(),
                        "#replies", "replies",
                        "#replyTsSet", "reply_ts_set"
                ))
                .expressionAttributeValues(Map.of(
                        ":emptyList", AttributeValue.builder()
                                .l(List.of())
                                .build(),
                        ":newReply", AttributeValue.builder()
                                .l(List.of(AttributeValue.builder()
                                        .m(replyMap)
                                        .build()))
                                .build(),
                        ":replyTs", AttributeValue.builder()
                                .s(domain.getReplyTs())
                                .build(),
                        ":replyTsSet", AttributeValue.builder()
                                .ss(List.of(domain.getReplyTs()))
                                .build()
                ))
                .build();

        dynamoDbClient.updateItem(request);
    }
}
