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
                KeyConditionExpression   : `#${PK} = :${PK} AND #${SK} = :${SK}`, // 条件指定
                ExpressionAttributeNames: {
                    [`#${PK}`]: PK,
                    [`#${SK}`]: SK,
                },
                ExpressionAttributeValues: {
                    [`:${PK}`]: date,
                    [`:${SK}`]: sortKey,
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
        const COL_THREAD_TS = DBConst.COLUMN_NAMES.POSTDATA.THREAD_TS;

        try {
            const result = await this.dynamoDb.send(new QueryCommand({
                TableName                : this.TABLENAME,
                KeyConditionExpression   : `${COL_THREAD_TS} = :${COL_THREAD_TS} AND begins_with(sort_key, :prefix)`, // 条件指定
                ExpressionAttributeValues: {
                    [`:${COL_THREAD_TS}`]: threadTs,
                    ":prefix" : prefix,
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
}

exports.DynamoPostDataRepository = DynamoPostDataRepository;