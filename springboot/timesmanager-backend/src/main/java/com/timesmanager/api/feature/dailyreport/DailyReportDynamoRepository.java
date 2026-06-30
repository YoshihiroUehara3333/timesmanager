package com.timesmanager.api.feature.dailyreport;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;

import com.timesmanager.api.common.core.repository.AbstractDynamoRepository;
import com.timesmanager.api.common.core.repository.Repository;
import com.timesmanager.api.common.enums.DynamoAttrName;
import com.timesmanager.api.dynamodb.DynamoDbAttributeValueMapBuilder;
import com.timesmanager.api.dynamodb.DynamoKey;
import com.timesmanager.api.dynamodb.DynamoKeyFactory;
import com.timesmanager.api.feature.dailyreport.domain.DailyReport;
import com.timesmanager.api.feature.dailyreport.dto.DailyReportResponse;

import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.DynamoDbException;
import software.amazon.awssdk.services.dynamodb.model.GetItemRequest;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;
import software.amazon.awssdk.services.dynamodb.model.UpdateItemRequest;

@org.springframework.stereotype.Repository
public class DailyReportDynamoRepository 
		extends AbstractDynamoRepository
		implements Repository<DailyReport> {

	public DailyReportDynamoRepository(
			DynamoDbClient dynamoDbClient,
			@Value("${aws.dynamodb.tableName}") String tableName) {
		super(dynamoDbClient, tableName);
	}

	/**
	 * 日報を1件保存
	 */
	public void putItem(DailyReport domain) {
		DynamoKey itemKey = DynamoKeyFactory.dailyreportItemKey(
				domain.getUserId(),
				domain.getDate());

		Map<String, AttributeValue> item = 
				new DynamoDbAttributeValueMapBuilder()
				.putString(DynamoAttrName.PK.getValue(), itemKey.getPartitionKey())
				.putString(DynamoAttrName.SK.getValue(), itemKey.getSortKey())
				.putString(DynamoAttrName.USER_ID.getValue(), domain.getUserId())
				.putString(DynamoAttrName.CHANNEL_ID.getValue(), domain.getChannelId())
				.build();

		PutItemRequest putItemRequest = PutItemRequest.builder()
				.tableName(tableName)
				.item(item)
				.build();

		try {
			dynamoDbClient.putItem(putItemRequest);
		} catch (DynamoDbException e) {
			throw new RuntimeException("DynamoDB putItem failed", e);
		}
	}

	/**
	 * 日報を1件取得（PK+SKでユニーク）
	 * 返り値は既存互換のため List<DiaryResponse> としている
	 */
	public List<DailyReportResponse> getDiary(String userId, String date) {
		DynamoKey itemKey = DynamoKeyFactory.dailyreportItemKey(
				userId,
				date);

		Map<String, AttributeValue> key = new DynamoDbAttributeValueMapBuilder()
				.putString(DynamoAttrName.PK.getValue(), itemKey.getPartitionKey())
				.putString(DynamoAttrName.SK.getValue(), itemKey.getSortKey())
				.build();

		GetItemRequest request = GetItemRequest.builder()
				.tableName(tableName)
				.key(key)
				.build();

		try {
			Map<String, AttributeValue> item = dynamoDbClient.getItem(request).item();
			if (item == null || item.isEmpty()) {
				// 「レコード0件」の時は null ではなく空Listを返す
				return Collections.emptyList();
			}

			return List.of(mapToDiaryResponse(item));

		} catch (DynamoDbException e) {
			throw new RuntimeException("DynamoDB getDiary failed", e);
		}
	}

	public void updateItem(DailyReport domain) {
		DynamoKey itemKey = DynamoKeyFactory.dailyreportItemKey(
				domain.getUserId(),
				domain.getDate());

		Map<String, AttributeValue> key = new DynamoDbAttributeValueMapBuilder()
				.putString(DynamoAttrName.PK.getValue(), itemKey.getPartitionKey())
				.putString(DynamoAttrName.SK.getValue(), itemKey.getSortKey())
				.build();

		Map<String, String> expressionAttributeNames = new HashMap<>();
		expressionAttributeNames.put("#st", "startTime");
		expressionAttributeNames.put("#et", "endTime");
		expressionAttributeNames.put("#wp", "workplace");

		UpdateItemRequest updateRequest = UpdateItemRequest.builder()
				.tableName(tableName)
				.key(key)
				.updateExpression("SET #st = :startTime, #et = :endTime, #wp = :workplace")
				.expressionAttributeNames(expressionAttributeNames)
				.build();

		try {
			dynamoDbClient.updateItem(updateRequest);
		} catch (DynamoDbException e) {
			throw new RuntimeException("DynamoDB updateItem failed", e);
		}
	}

	/**
	 * DynamoDB 1アイテム → TaskResponse 変換
	 */
	private DailyReportResponse mapToDiaryResponse(Map<String, AttributeValue> item) {
		DailyReportResponse response = new DailyReportResponse();

		response.setUserId(item.get(DynamoAttrName.PK.getValue()).s());
		response.setDate(item.get(DynamoAttrName.SK.getValue()).s());

		return response;
	}
}
