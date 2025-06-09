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
        try {
            return await this.dynamoDb.send(new PutCommand({
                TableName : this.TABLENAME,
                Item      : model.toItem(),
            }))
        } catch (error) {
            console.error("DynamoDB登録時エラー:", error);
            throw new Error(error.message, { cause: error });
        }
    }

    // dateからSortKeyを生成し、Diaryを1件取得する
    async getDiaryByDate (partitionKey, date) {
        const sortKey = `${POSTDATA.SORT_KEY_PREFIX.DIARY}#${date}`;
        try {
            const getResult = await this._getItem (partitionKey, sortKey);
            return getResult || null;

        } catch (error) {
            console.error("DynamoDB登録時エラー:", error);
            throw new Error(error.message, { cause: error });
        }
    }

    // WorkReportの最新serialを取得
    async queryWorkReportLatestSerial (partitionKey, date) {
        const sortKey = `${POSTDATA.SORT_KEY_PREFIX.WORKREPORT}#${date}`;
        try {
            const queryResult = await this._queryByPartitionKeyAndSortKey (partitionKey, sortKey);
            console.log(queryResult);
            if (queryResult) {
                return queryResult.Count + 1;
            } else {
                return 1;
            }

        } catch (error) {
            console.error("queryWorkReportLatestSerial実行時エラー:", error);
            throw new Error(error.message, { cause: error });
        }
    }

    // dateとsort_keyで絞り込みをかける
    // 絞り込みはServiceクラスで行う
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

    /**
     * 指定されたパーティションキーとソートキーで検索する。
     * @param {string} partitionKey - 検索対象のGSIパーティションキーの値
     * @param {string} sortKey - GSIソートキーのプレフィックス
     * @returns {Promise<Object[]|null>} クエリ結果（0件ならnull）
     */
    async _getItem (partitionKey, sortKey) {
        const getResult = await this.dynamoDb.send(new GetCommand({
            TableName : this.TABLENAME,
            Key : {
                [POSTDATA.ATTR_NAMES.PARTITION_KEY] : partitionKey,
                [POSTDATA.ATTR_NAMES.SORT_KEY]      : sortKey,
            }
        }))
        return getResult;
    }

    async _queryByPartitionKeyAndSortKey (partitionKey, sortKey) {
        const queryResult = await this.dynamoDb.send(new QueryCommand({
            TableName                : this.TABLENAME,
            KeyConditionExpression   : `#pk = :pk AND #sk = :sk`, // 条件指定
            ExpressionAttributeNames: {
                '#pk'     : POSTDATA.ATTR_NAMES.PARTITION_KEY,
                '#sk'     : POSTDATA.ATTR_NAMES.SORT_KEY,
            },
            ExpressionAttributeValues: {
                ':pk'     : partitionKey,
                ":sk"     : sortKey,
            },
        }));

        if (queryResult.Count === 0) {
            return null;
        } else {
            return queryResult;
        }
    }

    /**
     * GSIを使って、指定されたパーティションキーとSortKeyのprefixでデータを検索する。
     * @param {string} indexName - 使用するGSI名
     * @param {string} pkAttrName - パーティションキー属性名
     * @param {string} skAttrName - ソートキー属性名
     * @param {string} partitionKey - 検索対象のGSIパーティションキーの値
     * @param {string} prefix - GSIソートキーのプレフィックス
     * @returns {Promise<Object[]|null>} クエリ結果（0件ならnull）
     */
    async _queryByIndexUsingBeginsWithSortKeyPrefix (indexName, pkAttrName, skAttrName, partitionKey, prefix) {
        const queryResult = await this.dynamoDb.send(new QueryCommand({
            TableName                : this.TABLENAME,
            IndexName                : indexName, // GSI名
            KeyConditionExpression   : `#pk = :pk AND begins_with(#sk, :prefix)`, // 条件指定
            ExpressionAttributeNames: {
                '#pk'     : pkAttrName,
                '#sk'     : skAttrName,
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