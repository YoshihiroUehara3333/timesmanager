// スレッド情報をDynamo DBに永続化するクラス

// モジュール読み込み
const AWS = require('aws-sdk');

class DynamoThreadRepository {
  constructor() {
    this.dynamodb = new AWS.DynamoDB.DocumentClient();
  };

  // データの登録
  async putItem(params) {
    await this.dynamoDB.putItem(params).promise();
  }

  // データの取得
  async getItem(params) {
    const result = await this.dynamoDB.getItem(params).promise();
    return result.Item;
  }

  // データの削除
  async deleteItem(params) {
    await this.dynamoDB.deleteItem(params).promise();
  }
}

exports.DynamoThreadRepository = DynamoThreadRepository;