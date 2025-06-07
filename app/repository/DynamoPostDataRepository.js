// DynamoDBのPostDataテーブルとデータのやり取りを行うクラス

// モジュール読み込み
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { DBConst } = require('../constants/DBConst');

class DynamoPostDataRepository {
    TABLENAME = `timesmanager_postdata${process.env.TABLE_POSTFIX}`;
    COLNAMES  = DBConst.COLUMN_NAMES.POSTDATA;

    constructor () {
        const client  = new DynamoDBClient({});
        this.dynamoDb = DynamoDBDocumentClient.from(client);
    }

    // DBに登録する
    async putItem (model) {
        try {
            return await this.dynamoDb.send(new PutCommand({
                TableName : this.TABLENAME,
                Item      : model.toItem(),
            }));
        } catch (error) {
            console.error("DynamoDB登録時エラー:", error);
            throw new Error(error.message);
        }
    }

    // dateとsort_keyで絞り込みをかける
    async queryByDateAndSortKey(date, sortKey) {
        const {NAME, PK, SK} = DBConst.GSI.ByDateAndSortKey;
        try {
            const result = await this.dynamoDb.send(new QueryCommand({
                TableName                : this.TABLENAME,
                IndexName                : NAME, // GSI名
                KeyConditionExpression   : `#pk = :pk AND #sk = :sk`, // 条件指定
                ExpressionAttributeNames: {
                    '#pk' : PK,
                    '#sk' : SK,
                },
                ExpressionAttributeValues: {
                    ':pk' : date,
                    ':sk' : sortKey,
                },
            }));
        
            if (result.Count === 1) {
                return result.Items[0];
            } else {
                console.log(`DB取得結果${JSON.stringify(result)}`);
                throw new Error(`同じtsのデータが二つ以上存在しています`);
            }

        } catch (error) {
            console.error("DynamoDB問い合わせ時エラー:", error);
            throw new Error(error.message);
        }
    }

    // 指定したsort_keyのprefixとthread_tsからレコードを一意に取得する
    async queryByThreadTsAndSortKeyPrefix(threadTs, prefix) {
        const { THREAD_TS, SORT_KEY }= DBConst.COLUMN_NAMES.POSTDATA;

        try {
            const result = await this.dynamoDb.send(new QueryCommand({
                TableName                : this.TABLENAME,
                KeyConditionExpression   : `${THREAD_TS} = :${THREAD_TS} AND begins_with(${SORT_KEY}, :prefix)`, // 条件指定
                ExpressionAttributeValues: {
                    [`:${THREAD_TS}`]: threadTs,
                    ":prefix" : prefix,
                },
            }));
        
            if (result.Count === 1) {
                return result.Items[0];
            } else if (result.Count === 0) {
                return null;
            } else {
                console.log(`DB取得結果${JSON.stringify(result)}`);
                throw new Error(`同じtsのデータが二つ以上存在しています`);
            }

        } catch (error) {
            console.error("DynamoDB問い合わせ時エラー:", error);
            throw new Error(error.message);
        }
    }

    // dateからDiaryを取得する
    async getDiaryByDate (partitionKey, date) {
        try {
            const getResult = await this.dynamoDb.send(new GetCommand({
                TableName : this.TABLENAME,
                Key : {
                    [COLNAMES.PARTITION_KEY]      : partitionKey,
                    [COLNAMES.SORT_KEY]           : `${DBConst.SORT_KEY_BASE.DIARY}#${date}`,
                }
            }));

            return getResult.Item || null;
        } catch (error) {
            console.error("DynamoDB登録時エラー:", error);
            throw new Error(error.message);
        }
    }
}

exports.DynamoPostDataRepository = DynamoPostDataRepository;