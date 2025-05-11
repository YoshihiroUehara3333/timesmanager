// Dynamo DBとのデータのやり取りを担当するクラス

// モジュール読み込み
const AWS = require('aws-sdk');

class DynamoDiaryRepository {
    constructor () {
        this.dynamodb = new AWS.DynamoDB.DocumentClient();
    }

    async getDiaryByPartitionKey (partitionKey) {
        const result = await this.dynamodb.get({
            TableName: process.env.DYNAMO_TABLE_NAME,
            Key: {
                partition_key: partitionKey
            }
        }).promise();
        return result;
    }

    async putDiary (diaryModel) {
        const result = await this.dynamodb.put({
            TableName: process.env.DYNAMO_TABLE_NAME,
            Item: {
                partition_key: diaryModel.partitionKey,
                date: diaryModel.date,
                user_id: diaryModel.userId,
                event_ts: diaryModel.eventTs,
                content: {
                    workingTime: diaryModel.content.workingTime,
                    work: diaryModel.content.work,
                    evaluation: diaryModel.content.evaluation,
                    plan: diaryModel.content.plan,
                    other: diaryModel.content.other,
                },
                slack_url: diaryModel.slackUrl,
                edited_ts: diaryModel.editedTs
            },
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