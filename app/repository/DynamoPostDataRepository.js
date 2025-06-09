// DynamoDBのPostDataテーブルとデータのやり取りを行うクラス

// モジュール読み込み
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { POSTDATA } = require('../constants/DynamoDB/PostData');

class DynamoPostDataRepository {
    TABLENAME        = `timesmanager_postdata${process.env.TABLE_POSTFIX}`;

    constructor () {
        const client  = new DynamoDBClient({});
        this.dynamoDb = DynamoDBDocumentClient.from(client);
    }

    // modelデータをDBに登録する
    async putItem (model) {
        console.log(`putItem実行:${model.toItem()}`);
        try {
            return await this.dynamoDb.send(new PutCommand({
                TableName : this.TABLENAME,
                Item      : model.toItem(),
            }));
        } catch (error) {
            console.error("DynamoDB登録時エラー:", error);
            throw new Error(error.message, { cause: error });
        }
    }

    // dateとsort_keyで絞り込みをかける
    // 絞り込みはServiceクラスで行う
    // sort_keyにthread_tsを使用しているModelのみ有効
    // GSI使用
    async queryByDateAndSortKeyPrefix(date, prefix) {
        const {NAME, PK, SK} = POSTDATA.GSI.ByDateAndSortKeyPrefix;
        
        try {
            return await this._queryByIndexUsingBeginsWithSortKeyPrefix(NAME, PK, SK, date, prefix);
        } catch (error) {
            console.error("DynamoDB問い合わせ時エラー:", error);
            throw new Error(error.message);
        }
    }

    // 指定したsort_keyのprefixとthread_tsを条件にレコードを取得する
    // 絞り込みはServiceクラスで行う
    // GSI使用
    async queryByThreadTsAndSortKeyPrefix(threadTs, prefix) {
        const {NAME, PK, SK} = POSTDATA.GSI.ByThreadTsAndSortKeyPrefix;

        try {
            return await this._queryByIndexUsingBeginsWithSortKeyPrefix(NAME, PK, SK, threadTs, prefix);
        } catch (error) {
            console.error("DynamoDB問い合わせ時エラー:", error);
            throw new Error(error.message, { cause: error });
        }
    }

    // dateからSortKeyを生成し、Diaryを1件取得する
    async getDiaryByDate (partitionKey, date) {
        try {
            const getResult = await this.dynamoDb.send(new GetCommand({
                TableName : this.TABLENAME,
                Key : {
                    [POSTDATA.PARTITION_KEY]      : partitionKey,
                    [POSTDATA.SORT_KEY]           : `${POSTDATA.SORT_KEY_PREFIX.DIARY}#${date}`,
                }
            }));
            console.log(JSON.stringify(getResult));

            return getResult.Item || null;
        } catch (error) {
            console.error("DynamoDB登録時エラー:", error);
            throw new Error(error.message, { cause: error });
        }
    }

    /**
     * GSIを使って、指定されたパーティションキーとSortKeyのprefixでデータを検索する。
     * @param {string} indexName - 使用するGSI名
     * @param {string} pkAttr - パーティションキー属性名
     * @param {string} skAttr - ソートキー属性名
     * @param {string} partitionKey - 検索対象のGSIパーティションキーの値
     * @param {string} prefix - GSIソートキーのプレフィックス
     * @returns {Promise<Object[]|null>} クエリ結果（0件ならnull）
     */
    async _queryByIndexUsingBeginsWithSortKeyPrefix (indexName, pkAttr, skAttr, partitionKey, prefix) {
        const queryResult = await this.dynamoDb.send(new QueryCommand({
            TableName                : this.TABLENAME,
            IndexName                : indexName, // GSI名
            KeyConditionExpression   : `#pk = :pk AND begins_with(#sk, :prefix)`, // 条件指定
            ExpressionAttributeNames: {
                '#pk'     : PK,
                '#sk'     : SK,
            },
            ExpressionAttributeValues: {
                ':pk'     : partitionKey,
                ":prefix" : prefix,
            },
        }));

        if (queryResult.Count === 0) {
            return null;
        } else {
            return queryResult;
        }
    }
}

exports.DynamoPostDataRepository = DynamoPostDataRepository;