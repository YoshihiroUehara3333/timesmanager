// モジュール読み込み
const AWS = require('aws-sdk');

class DynamoDiaryRepository {
    constructor () {
        this.dynamodb = new AWS.DynamoDB.DocumentClient();
    }

    async getDiaryByGetParams (getParams) {
        const result = await this.dynamodb.get(getParams).promise();
        return result;
    }

    async putDiary (putParams) {
        console.log('put実行:' + JSON.stringify(putParams));

        const result = await this.dynamodb.put(putParams).promise();
        return result;
    }
    
    async getDiaryByThreadTs(thread_ts) {
        // DB検索条件を設定
        const params = {
            TableName: process.env.DYNAMO_TABLE_NAME,
            IndexName: 'event_ts-index', // 作成したGSI名
            KeyConditionExpression: '#indexKey = :indexValue', // 条件を指定
            ExpressionAttributeNames : {
                "#indexKey"  : 'event_ts' // GSIパーティションキー名を設定
              },
              ExpressionAttributeValues: {
                ':indexValue': thread_ts
              }
        };
        const result = await this.dynamodb.query(params).promise();

        if (result.Count == 1) {
            return result.Items[0];
        }
        return undefined;
    }
};

exports.DynamoDiaryRepository = DynamoDiaryRepository;