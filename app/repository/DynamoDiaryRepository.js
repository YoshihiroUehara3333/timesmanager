// Dynamo DBとの日記データのやり取りを担当するクラス

// モジュール読み込み
const AWS = require('aws-sdk');
const { DBConst } = require('../constants/DBConst');

class DynamoDiaryRepository {
    constructor () {
        this.dynamodb = new AWS.DynamoDB.DocumentClient();
    }

    async getDiaryByPartitionKey (diaryModel) {
        const key = {
            partition_key: `${DBConst.POST_CATEGORY.DIARY}-${diaryModel.partitionKeyBase}`,
        };

        const result = await this.dynamodb.get({
            TableName: process.env.DYNAMO_TABLE_NAME,
            Key: key,
        }).promise();
        
        return result;
    }

    async putDiary (diaryModel) {
        const item = diaryModel.toItem();
        item.partition_key = `${DBConst.POST_CATEGORY.DIARY}-${diaryModel.partitionKeyBase}`;

        const result = await this.dynamodb.put({
            TableName: process.env.DYNAMO_TABLE_NAME,
            Item: item,
        }).promise();

        return result;
    }
    
    async getDiaryByThreadTs(thread_ts) {
        const result = await this.dynamodb.query({
            TableName: process.env.DYNAMO_TABLE_NAME,
            IndexName: DBConst.GSI_NAME.EVENT_TS, // 作成したGSI名
            KeyConditionExpression: '#indexKey = :indexValue', // 条件を指定
            ExpressionAttributeNames : {
                "#indexKey"  : DBConst.GSI_PARTITION.EVENT_TS // GSIパーティションキー名を設定
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