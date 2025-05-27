// Dynamo DBとの日記データのやり取りを担当するクラス

// モジュール読み込み
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { DBConst } = require('../constants/DBConst');

class DynamoDiaryRepository {
    constructor () {
        const client = new DynamoDBClient({});
        this.dynamodb = DynamoDBDocumentClient.from(client);
    }

    async getDiaryByPartitionKey (diaryModel) {
        const key = {
            partition_key: `${DBConst.POST_CATEGORY.DIARY}-${diaryModel.partitionKeyBase}`,
        };

        const result = await this.dynamodb.send(new GetCommand({
            TableName: process.env.DYNAMO_TABLE_NAME,
            Key: key,
        }));
        
        return result;
    }

    async putDiary (diaryModel) {
        const item = diaryModel.toItem();
        item.partition_key = `${DBConst.POST_CATEGORY.DIARY}-${diaryModel.partitionKeyBase}`;

        try {
            return await this.dynamodb.send(new PutCommand({
                TableName: process.env.DYNAMO_TABLE_NAME,
                Item: item,
            }));
        } catch (error) {
            console.error("DynamoDB登録時エラー:", error);
        }
    }
    
    async getDiaryByThreadTs(thread_ts) {
        const result = await this.dynamodb.send(new QueryCommand({
            TableName: process.env.DYNAMO_TABLE_NAME,
            IndexName: DBConst.GSI_NAME.EVENT_TS, // 作成したGSI名
            KeyConditionExpression: '#indexKey = :indexValue', // 条件を指定
            ExpressionAttributeNames : {
                "#indexKey"  : DBConst.GSI_PARTITION.EVENT_TS // GSIパーティションキー名を設定
              },
              ExpressionAttributeValues: {
                ':indexValue': thread_ts // 検索する値
              }
        }));

        if (result.Count == 1) {
            return result.Items[0];
        }
        return undefined;
    }
};

exports.DynamoDiaryRepository = DynamoDiaryRepository;