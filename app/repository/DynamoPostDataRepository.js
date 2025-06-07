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

    // modelデータをDBに登録する
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
    // 絞り込みはServiceクラスで行う
    // sort_keyにthread_tsを使用しているModelのみ有効
    // GSI使用
    async queryByDateAndSortKeyPrefix(date, prefix) {
        const {NAME, PK, SK} = DBConst.GSI.ByDateAndSortKeyPrefix;
        try {
            const queryResult = await this.dynamoDb.send(new QueryCommand({
                TableName                : this.TABLENAME,
                IndexName                : NAME, // GSI名
                KeyConditionExpression   : `#pk = :pk AND begins_with(#sk, :prefix)`, // 条件指定
                ExpressionAttributeNames: {
                    '#pk' : PK,
                    '#sk' : SK,
                },
                ExpressionAttributeValues: {
                    ':pk' : date,
                    ':prefix' : prefix,
                },
            }));
        
            if (queryResult.Count === 0) {
                return null;
            } else {
                return queryResult;
            }

        } catch (error) {
            console.error("DynamoDB問い合わせ時エラー:", error);
            throw new Error(error.message);
        }
    }

    // 指定したsort_keyのprefixとthread_tsを条件にレコードを取得する
    // 絞り込みはServiceクラスで行う
    // GSI使用
    async queryByThreadTsAndSortKeyPrefix(threadTs, prefix) {
        const {NAME, PK, SK} = DBConst.GSI.ByThreadTsAndSortKeyPrefix;

        try {
            const queryResult = await this.dynamoDb.send(new QueryCommand({
                TableName                : this.TABLENAME,
                IndexName                : NAME, // GSI名
                KeyConditionExpression   : `#pk = :pk AND begins_with(#sk, :prefix)`, // 条件指定
                ExpressionAttributeNames: {
                    '#pk'     : PK,
                    '#sk'     : SK,
                },
                ExpressionAttributeValues: {
                    ':pk'     : threadTs,
                    ":prefix" : prefix,
                },
            }));

            if (queryResult.Count === 0) {
                return null;
            } else {
                return queryResult;
            }

        } catch (error) {
            console.error("DynamoDB問い合わせ時エラー:", error);
            throw new Error(error.message);
        }
    }

    // dateからSortKeyを生成し、Diaryを1件取得する
    async getDiaryByDate (partitionKey, date) {
        console.log(`getDiaryByDateパラメータ:${JSON.stringify({
                TableName : this.TABLENAME,
                Key : {
                    [this.COLNAMES.PARTITION_KEY]      : partitionKey,
                    [this.COLNAMES.SORT_KEY]           : `${DBConst.SORT_KEY_PREFIX.DIARY}#${date}`,
                }
            })}`);
        try {
            const getResult = await this.dynamoDb.send(new GetCommand({
                TableName : this.TABLENAME,
                Key : {
                    [this.COLNAMES.PARTITION_KEY]      : partitionKey,
                    [this.COLNAMES.SORT_KEY]           : `${DBConst.SORT_KEY_PREFIX.DIARY}#${date}`,
                }
            }));
            console.log(JSON.stringify(getResult));

            return getResult.Item || null;
        } catch (error) {
            console.error("DynamoDB登録時エラー:", error);
            throw new Error(error.message);
        }
    }
}

exports.DynamoPostDataRepository = DynamoPostDataRepository;