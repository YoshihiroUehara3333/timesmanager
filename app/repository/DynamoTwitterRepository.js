// Dynamo DBとの日記データのやり取りを担当するクラス

// モジュール読み込み
const AWS = require('aws-sdk');

class DynamoTwitterRepository {
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

exports.DynamoTwitterRepository = DynamoTwitterRepository;