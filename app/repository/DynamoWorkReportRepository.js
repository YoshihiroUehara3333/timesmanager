// 作業経過情報をDynamo DBに永続化するクラス

// モジュール読み込み
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { DBConst } = require('../constants/DBConst');

class DynamoWorkReportRepository {
    constructor() {
        const client  = new DynamoDBClient({});
        this.dynamoDb = DynamoDBDocumentClient.from(client);
    }

    async putWorkReport (workReportModel) {
        const item = workReportModel.toItem();
        item.partition_key = `${DBConst.POST_CATEGORY.WORKREPORT}-${workReportModel.partitionKeyBase}`;
        
        try {
            return await this.dynamoDb.send(new PutCommand({
                TableName: process.env.DYNAMO_TABLE_NAME,
                Item     : item,
            }));
        } catch (error) {
            console.error("DynamoDB登録時エラー:", error);
            throw new Error(error.message);
        }
    }

};

exports.DynamoWorkReportRepository = DynamoWorkReportRepository;