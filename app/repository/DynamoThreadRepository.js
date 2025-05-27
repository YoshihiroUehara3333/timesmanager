// スレッド情報をDynamo DBに永続化するクラス

// モジュール読み込み
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { DBConst } = require('../constants/DBConst');

class DynamoThreadRepository {
  constructor() {
    const client = new DynamoDBClient({});
    this.dynamoDb = DynamoDBDocumentClient.from(client);
  };

  // データの登録
  async putNewThread(threadModel) {
    const item = threadModel.toItem();
    item.partition_key = `${DBConst.POST_CATEGORY.THREAD}-${threadModel.partitionKeyBase}`;

    console.log(JSON.stringify(item));
    try {
      return await this.dynamoDb.send(new PutCommand({
        TableName: process.env.DYNAMO_TABLE_NAME,
        Item: item,
      }));
    } catch (error) {
      console.error("DynamoDB登録時エラー:", error);
      return {};
    }
  };

  // データの登録
  async putThreadReply(replyModel) {
    const item = replyModel.toItem();
    item.partition_key = `${DBConst.POST_CATEGORY.REPLY}-${replyModel.partitionKeyBase}`;

    try {
      return await this.dynamoDb.send(new PutCommand({
        TableName: process.env.DYNAMO_TABLE_NAME,
        Item: item,
      }));
    } catch (error) {
      console.error("DynamoDB登録時エラー:", error);
      return {};
    }
  };

  // データの取得
  async getItem(params) {
    const result = await this.dynamoDb.send(new GetCommand(params));
    return result.Item;
  }

  // データの削除
  async deleteItem(params) {
    return await this.dynamoDb.send(new DeleteCommand(params));
  }
}

exports.DynamoThreadRepository = DynamoThreadRepository;