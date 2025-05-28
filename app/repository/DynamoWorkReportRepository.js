// 作業経過情報をDynamo DBに永続化するクラス

// モジュール読み込み
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { DBConst } = require('../constants/DBConst');

class DynamoWorkReportRepository {
    constructor() {
        const client = new DynamoDBClient({});
        this.dynamoDb = DynamoDBDocumentClient.from(client);
    }
};

exports.DynamoWorkReportRepository = DynamoWorkReportRepository;