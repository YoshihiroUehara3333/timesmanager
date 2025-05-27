// スレッド情報をDynamo DBに永続化するクラス

// モジュール読み込み
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { DBConst } = require('../constants/DBConst');

class DynamoThreadRepository {
  constructor() {
    const client = new DynamoDBClient({});
    this.dynamodb = DynamoDBDocumentClient.from(client);
  };

  // データの登録
  async putItem(params) {
    return await this.dynamoDB.send(new PutCommand(params));
  }

  // データの取得
  async getItem(params) {
    const result = await this.dynamoDB.send(new GetCommand(params));
    return result.Item;
  }

  // データの削除
  async deleteItem(params) {
    return await this.dynamoDB.send(new DeleteCommand(params));
  }
}

exports.DynamoThreadRepository = DynamoThreadRepository;