# timesmanager
times投稿を管理したい

## 機能
- timesチャンネル内でbotにメンションを付けて投稿された日報をDBに保存する
- 投稿された日報が編集されたときにDBのレコードを上書きする
- 投稿のスレッド内でメンション時、chatGPTによるフィードバックを生成しスレッドに返信する

#### 日報投稿フォーマット
````
【日付】0000-00-00
【時間】09:00-18:00
【業務内容】
業務内容1
業務内容2

【自己評価】
うまくいった点
改善できる点

【翌日の計画】
予定している作業と完了目標
懸念点や準備しておくべきこと

【その他】
その他の内容
````

<br>

## 疑似スラッシュコマンド
botメンション+下記の疑似スラッシュコマンドをポストすると使える機能<br><br>
*/AIフィードバック*<br>
投稿した日報に対してスレッド返信で使用する。<br>
AIによるフィードバックを生成し、スレッド内に返信する。<br>
<br>

## スラッシュコマンド
*/makethread*<br>
*/warmup*<br>
<br>
<br>
## ディレクトリ構成
````
/timesmanager
├── src/
│   ├── index.js      ← Lambda
│   ├── constants/
│   │   └──DynamoDB/
│   ├── controller/
│   ├── model/
│   ├── repository/
│   ├── service/
│   └── utility/
├── .github
│   └── workflows
├── package.json
├── package-lock.json
├── .env
└── README.md
````
