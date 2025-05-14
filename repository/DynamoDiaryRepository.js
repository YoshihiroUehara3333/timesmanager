// Dynamo DBとの日記データのやり取りを担当するクラス

// モジュール読み込み
const AWS = require('aws-sdk');
const { DBConstants } = require('../constants/DBConstants');

class DynamoDiaryRepository {
    constructor () {
        this.dynamodb = new AWS.DynamoDB.DocumentClient();
    }

    async getDiaryByPartitionKey (diaryModel) {
        const key = {
            partition_key: DBConstants.POST_CATEGORY.DIARY + diaryModel.partitionKeyBase,
        };

        const result = await this.dynamodb.get({
            TableName: process.env.DYNAMO_TABLE_NAME,
            Key: key,
        }).promise();
        
        return result;
    }

    async putDiary (diaryModel) {
        const item = diaryModel.toItem();
        item.partition_key = DBConstants.POST_CATEGORY.DIARY + diaryModel.partitionKeyBase;

        const result = await this.dynamodb.put({
            TableName: process.env.DYNAMO_TABLE_NAME,
            Item: item,
        }).promise();

        return result;
    }
    
    async getDiaryByThreadTs(thread_ts) {
        const result = await this.dynamodb.query({
            TableName: process.env.DYNAMO_TABLE_NAME,
            IndexName: 'event_ts-index', // 作成したGSI名
            KeyConditionExpression: '#indexKey = :indexValue', // 条件を指定
            ExpressionAttributeNames : {
                "#indexKey"  : 'event_ts' // GSIパーティションキー名を設定
              },
              ExpressionAttributeValues: {
                ':indexValue': thread_ts // 検索する値
              }
        }).promise();

        if (result.Count == 1) {
            return result.Items[0];
        }
        return undefined;
    }
};

exports.DynamoDiaryRepository = DynamoDiaryRepository;