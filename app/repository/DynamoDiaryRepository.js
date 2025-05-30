// Dynamo DBとの日記データのやり取りを担当するクラス

// モジュール読み込み
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { DBConst } = require('../constants/DBConst');

class DynamoDiaryRepository {
    constructor () {
        const client  = new DynamoDBClient({});
        this.dynamodb = DynamoDBDocumentClient.from(client);
    }

    async getDiaryByPartitionKey (diaryModel) {

        try {
            return await this.dynamodb.send(new GetCommand({
                TableName: process.env.DYNAMO_TABLE_NAME,
                Key      : {
                    partition_key: `${DBConst.POST_CATEGORY.DIARY}-${diaryModel.partitionKeyBase}`,
                },
            }));

        } catch (error) {
            console.error("DynamoDB問い合わせ時エラー:", error);
            throw new Error(error.message);
        }
    }

    async putDiary (diaryModel) {
        const item = diaryModel.toItem();
        item.partition_key = `${DBConst.POST_CATEGORY.DIARY}-${diaryModel.partitionKeyBase}`;
        
        try {
            return await this.dynamodb.send(new PutCommand({
                TableName: process.env.DYNAMO_TABLE_NAME,
                Item     : item,
            }));
        } catch (error) {
            console.error("DynamoDB登録時エラー:", error);
            throw new Error(error.message);
        }
    }
    
    async getDiaryByThreadTs(thread_ts) {
        const result = await this.dynamodb.send(new QueryCommand({
            TableName                : process.env.DYNAMO_TABLE_NAME,
            IndexName                : DBConst.GSI_NAME.EVENT_TS, // GSI名
            KeyConditionExpression   : '#indexKey = :indexValue', // 条件指定
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
        return {};
    }
}

exports.DynamoDiaryRepository = DynamoDiaryRepository;